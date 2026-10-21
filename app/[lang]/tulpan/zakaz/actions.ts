"use server";

import { redirect } from "next/navigation";
import { ru } from "@/content/dict/ru";
import { tenge } from "@/lib/format";
import { isLang, localHref } from "@/lib/i18n";
import { notifyTatiana } from "@/lib/notify";
import { parseItems, quote, serializeItems, slotsFor } from "@/lib/order";
import { almatyDay, PREPAYMENTS } from "@/lib/pricing";
import { getSeason, type PrepaymentPct } from "@/lib/season";
import { isBin, normalizePhone, text } from "@/lib/validate";

export type OrderError = "items" | "stock" | "closed" | "min" | "date" | "slot" | "company" | "name" | "phone" | "bin" | "org" | "send";
export type OrderState = { errors: OrderError[]; overStock?: string[]; waText?: string } | null;

// Everything from the form is re-checked here: prices and stock come from the season source, not the browser
export async function submitOrder(_: OrderState, fd: FormData): Promise<OrderState> {
  if (text(fd.get("website"))) return null; // honeypot: bots fill every field
  const lang = text(fd.get("lang"));
  const pct = Number(fd.get("pct")) as PrepaymentPct;
  const items = parseItems(text(fd.get("items"), 400));
  if (!PREPAYMENTS.includes(pct) || !items) return { errors: ["items"] };

  const { season, asOf, priceGrid, stock } = await getSeason();
  const q = quote({ priceGrid, stock }, items, pct, almatyDay(new Date(asOf)));
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

  // shortcut: random number, may repeat; the CRM will assign T-YYYY-NNNN from its own counter
  const orderNumber = `T-${season.id}-${String(Math.floor(Math.random() * 10_000)).padStart(4, "0")}`;
  const message = [
    `Заявка ${orderNumber} с сайта${lang === "kz" ? " (KZ)" : ""}`,
    ...q.lines.map((l) => `${ru.product(l.color, l.type)}: ${l.packs} пач. × ${l.pricePerStem} ₸ = ${tenge(l.sum)}`),
    `Итого ${tenge(q.total)}, предоплата ${pct} % = ${tenge(q.prepayment)}, остаток ${tenge(q.remainder)}`,
    `Вывоз ${date} ${slot}, ${method === "self" ? "самовывоз" : "машина клиента"}${fd.get("storage") ? ", холодильник до вывоза" : ""}`,
    `${company}, ${name}, ${phone}`,
    legal === "too" ? `ТОО «${org}», БИН ${bin}` : "ИП",
    text(fd.get("comment"), 1000),
  ]
    .filter(Boolean)
    .join("\n");

  if (!(await notifyTatiana(message))) return { errors: ["send"], waText: message };

  const params = new URLSearchParams({ n: orderNumber, p: String(pct), i: serializeItems(q.lines), d: date });
  redirect(`${localHref(isLang(lang) ? lang : "ru", "/tulpan/zakaz/gotovo")}?${params}`);
}
