"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ru } from "@/content/dict/ru";
import { VARIETIES } from "@/content/varieties";
import { crmPost } from "@/lib/crm";
import { tenge } from "@/lib/format";
import { isLang, localHref } from "@/lib/i18n";
import { linesFromPicks, parsePicks, quote, slotsFor } from "@/lib/order";
import { almatyDay, PREPAYMENTS } from "@/lib/pricing";
import { cachedSeason, type PrepaymentPct } from "@/lib/season";
import { isBin, isEmail, normalizePhone, text } from "@/lib/validate";

export type OrderError = "items" | "stock" | "closed" | "min" | "date" | "slot" | "company" | "name" | "phone" | "email" | "bin" | "org" | "send";
// message: the CRM's own refusal text (Russian), shown as is
export type OrderState = { errors: OrderError[]; overStock?: string[]; waText?: string; message?: string } | null;

// Everything from the form is re-checked here, then once more by the CRM, which owns prices and stock
export async function submitOrder(_: OrderState, fd: FormData): Promise<OrderState> {
  if (text(fd.get("website"))) return null; // honeypot: bots fill every field
  const lang = isLang(text(fd.get("lang"))) ? (text(fd.get("lang")) as "ru" | "kz") : "ru";
  const pct = Number(fd.get("pct")) as PrepaymentPct;
  // pay: the client pays the prepayment now (a Kaspi invoice, the order is held at once); otherwise a booking for Tatiana to confirm (review 09.11.2026, С9)
  const payNow = fd.get("pay") === "1";
  const picks = parsePicks(text(fd.get("picks"), 2000));
  if (!PREPAYMENTS.includes(pct) || !picks) return { errors: ["items"] };

  const { season, asOf, priceGrid, stock } = await cachedSeason();
  const { lines, sorts } = linesFromPicks(picks, VARIETIES, stock);
  const date = text(fd.get("date"), 10);
  const day = almatyDay(new Date(asOf));
  const q = quote({ season, priceGrid, stock }, lines, pct, day);
  // The CRM sells colors; the varieties the client picked reach Tatiana as a wish
  const wishes = sorts.length ? `Сорта: ${sorts.map((x) => `${x.name} ${x.packs} пач.`).join(", ")}` : "";
  const comment = [wishes, text(fd.get("comment"), 1000)].filter(Boolean).join("\n");
  const slot = text(fd.get("slot"), 20);
  const method = fd.get("method") === "client_truck" ? "client_truck" : "self";
  const company = text(fd.get("company"));
  const name = text(fd.get("name"));
  const phone = normalizePhone(text(fd.get("phone"), 30));
  const email = text(fd.get("email"));
  const legal = fd.get("legal") === "too" ? "too" : fd.get("legal") === "person" ? "person" : "ip";
  const bin = text(fd.get("bin"), 20).replace(/\s/g, "");
  const org = text(fd.get("org"));

  const errors: OrderError[] = [];
  if (!q.lines.length || q.unknown.length) errors.push("items");
  if (q.closed) errors.push("closed");
  if (q.overStock.length) errors.push("stock");
  if (q.missingStems > 0) errors.push("min");
  const slots = slotsFor(season, date, day);
  if (!slots.length) errors.push("date");
  else if (!slots.includes(slot)) errors.push("slot");
  if (!company && legal !== "person") errors.push("company");
  if (!name) errors.push("name");
  if (!phone) errors.push("phone");
  if (email && !isEmail(email)) errors.push("email");
  if (legal === "too" && !isBin(bin)) errors.push("bin");
  if (legal === "too" && !org) errors.push("org");
  if (errors.length) return { errors, overStock: q.overStock };

  // The same request as a WhatsApp text: the way out when the CRM is unreachable
  const waText = [
    `Заявка с сайта${lang === "kz" ? " (KZ)" : ""}`,
    ...q.lines.map((l) => `${ru.product(l.color, l.type)}: ${l.packs} пач. × ${l.pricePerStem} ₸ = ${tenge(l.sum)}`),
    `Итого ${tenge(q.total)}, предоплата ${pct} % = ${tenge(q.prepayment)}, остаток ${tenge(q.remainder)}`,
    payNow ? "Хочу внести предоплату сейчас, жду счёт Kaspi" : "Бронь без предоплаты",
    `Вывоз ${date} ${slot}, ${method === "self" ? "самовывоз" : "машина клиента"}`,
    [company, name, phone, email].filter(Boolean).join(", "),
    legal === "too" ? `ТОО «${org}», БИН ${bin}` : legal === "person" ? "Физлицо" : "ИП",
    comment,
  ]
    .filter(Boolean)
    .join("\n");

  let r: Awaited<ReturnType<typeof crmPost<{ token: string }>>>;
  try {
    r = await crmPost<{ token: string }>(
      "/orders",
      {
        items: q.lines.map((l) => ({ productId: l.productId, packs: l.packs })),
        prepaymentPct: pct,
        pickupDate: date,
        pickupSlot: slot,
        pickupMethod: method,
        payNow,
        client: { company, name, phone, email, legalType: legal, bin, orgName: org },
        comment,
        source: "site",
        prefillToken: text(fd.get("c"), 40),
      },
      (await headers()).get("x-forwarded-for"),
    );
  } catch (e) {
    console.error(`[guldala] CRM недоступна: ${e}`);
    return { errors: ["send"], waText };
  }
  if (!r.ok) return { errors: [], message: r.error };
  updateTag("season"); // stock changed: the next visitor sees it
  redirect(localHref(lang, `/o/${r.data.token}?new=1`)); // ?new=1: the order page empties the basket
}
