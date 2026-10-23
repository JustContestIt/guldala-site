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
import { isBin, normalizePhone, text } from "@/lib/validate";

export type OrderError = "items" | "stock" | "closed" | "min" | "date" | "slot" | "company" | "name" | "phone" | "bin" | "org" | "send";
// message: the CRM's own refusal text (Russian), shown as is
export type OrderState = { errors: OrderError[]; overStock?: string[]; waText?: string; message?: string } | null;

// Everything from the form is re-checked here, then once more by the CRM, which owns prices and stock
export async function submitOrder(_: OrderState, fd: FormData): Promise<OrderState> {
  if (text(fd.get("website"))) return null; // honeypot: bots fill every field
  const lang = isLang(text(fd.get("lang"))) ? (text(fd.get("lang")) as "ru" | "kz") : "ru";
  const pct = Number(fd.get("pct")) as PrepaymentPct;
  const picks = parsePicks(text(fd.get("picks"), 2000));
  if (!PREPAYMENTS.includes(pct) || !picks) return { errors: ["items"] };

  const { season, asOf, priceGrid, stock } = await cachedSeason();
  const { lines, sorts } = linesFromPicks(picks, VARIETIES, stock);
  const q = quote({ priceGrid, stock }, lines, pct, almatyDay(new Date(asOf)));
  // The CRM sells colors; the varieties the client picked reach Tatiana as a wish
  const wishes = sorts.length ? `Сорта: ${sorts.map((x) => `${x.name} — ${x.packs} пач.`).join(", ")}` : "";
  const comment = [wishes, text(fd.get("comment"), 1000)].filter(Boolean).join("\n");
  const date = text(fd.get("date"), 10);
  const slot = text(fd.get("slot"), 20);
  const method = fd.get("method") === "client_truck" ? "client_truck" : "self";
  const company = text(fd.get("company"));
  const name = text(fd.get("name"));
  const phone = normalizePhone(text(fd.get("phone"), 30));
  const legal = fd.get("legal") === "too" ? "too" : "ip";
  const bin = text(fd.get("bin"), 20).replace(/\s/g, "");
  const org = text(fd.get("org"));

  const errors: OrderError[] = [];
  if (!q.lines.length || q.unknown.length) errors.push("items");
  if (q.closed) errors.push("closed");
  if (q.overStock.length) errors.push("stock");
  if (q.missingStems > 0) errors.push("min");
  if (!slotsFor(season, date).length) errors.push("date");
  else if (!slotsFor(season, date).includes(slot)) errors.push("slot");
  if (!company) errors.push("company");
  if (!name) errors.push("name");
  if (!phone) errors.push("phone");
  if (legal === "too" && !isBin(bin)) errors.push("bin");
  if (legal === "too" && !org) errors.push("org");
  if (errors.length) return { errors, overStock: q.overStock };

  // The same request as a WhatsApp text: the way out when the CRM is unreachable
  const waText = [
    `Заявка с сайта${lang === "kz" ? " (KZ)" : ""}`,
    ...q.lines.map((l) => `${ru.product(l.color, l.type)}: ${l.packs} пач. × ${l.pricePerStem} ₸ = ${tenge(l.sum)}`),
    `Итого ${tenge(q.total)}, предоплата ${pct} % = ${tenge(q.prepayment)}, остаток ${tenge(q.remainder)}`,
    `Вывоз ${date} ${slot}, ${method === "self" ? "самовывоз" : "машина клиента"}${fd.get("storage") ? ", холодильник до вывоза" : ""}`,
    `${company}, ${name}, ${phone}`,
    legal === "too" ? `ТОО «${org}», БИН ${bin}` : "ИП",
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
        storage: !!fd.get("storage"),
        client: { company, name, phone, legalType: legal, bin, orgName: org },
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
