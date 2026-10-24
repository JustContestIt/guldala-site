"use client";

import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { PickStepper, usePicks } from "@/components/Picks";
import { ColorDot, Field, inputCls } from "@/components/ui";
import { COLOR_HEX } from "@/content/colors";
import type { Dict } from "@/content/dict/ru";
import { waLink } from "@/content/site";
import { groupOf, VARIETIES } from "@/content/varieties";
import { tenge } from "@/lib/format";
import { fmt, type Lang } from "@/lib/i18n";
import { linesFromPicks, PACK_SIZE, quote, serializePicks, slotsFor, storageDays } from "@/lib/order";
import { almatyDay, PREPAYMENTS, pricePerStem } from "@/lib/pricing";
import type { PrepaymentPct, SeasonCurrent } from "@/lib/season";
import { submitOrder } from "./actions";

type Props = {
  lang: Lang;
  data: Pick<SeasonCurrent, "season" | "asOf" | "priceGrid" | "stock">;
  t: Dict["calc"];
  labels: Record<string, string>; // productId → "Красные махровые"
  catalogHref: string;
  // from ?c=TOKEN (a WhatsApp link): contacts the CRM already knows
  client?: { company: string; name: string; phone: string };
  prefillToken?: string;
};

// The order comes from the catalog (variety picks); here it is checked, priced and sent
export function Checkout({ lang, data, t, labels, catalogHref, client, prefillToken }: Props) {
  const picks = usePicks();
  const [pct, setPct] = useState<PrepaymentPct>(100);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [legal, setLegal] = useState<"ip" | "too" | "person">("ip");
  const [storage, setStorage] = useState(false);
  const [state, action, pending] = useActionState(submitOrder, null);
  // Submit by hand: <form action> would reset every field even when the server only returns validation errors
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };

  const day = almatyDay(new Date(data.asOf));
  const lineOf = (v: (typeof VARIETIES)[number]) => data.stock.find((s) => s.color === v.color && s.type === v.type);
  const chosen = VARIETIES.filter((v) => picks[v.slug] && lineOf(v));
  // the fridge: every day from today to pickup, at the season's rate (the CRM counts the same on save)
  const perDay = data.season.storageFeePerDay;
  const days = storage ? storageDays(day, date) : 0;
  const q = quote(data, linesFromPicks(picks, chosen, data.stock).lines, pct, day, days * perDay);
  const slots = slotsFor(data.season, date);
  const price = (type: "classic" | "double") => pricePerStem(data.priceGrid, type, pct, day);
  const blocked = pending || !q.lines.length || q.missingStems > 0 || q.closed || q.overStock.length > 0;
  const classic = price("classic");
  const double = price("double");

  return (
    <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="pct" value={pct} />
      <input type="hidden" name="picks" value={serializePicks(Object.fromEntries(chosen.map((v) => [v.slug, picks[v.slug]])))} />
      {prefillToken && <input type="hidden" name="c" value={prefillToken} />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid gap-8">

        <section className="rounded-2xl border border-line p-5" aria-labelledby="items-title">
          <h2 id="items-title" className="text-lg">{t.itemsTitle}</h2>
          {chosen.length ? (
            <>
              <ul className="mt-2 divide-y divide-line">
                {chosen.map((v) => {
                  const s = lineOf(v)!;
                  const stems = picks[v.slug] * PACK_SIZE;
                  const p = price(v.type);
                  return (
                    <li key={v.slug} className="grid grid-cols-[1fr_8.5rem] items-center gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{v.name}</p>
                        <p className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                          <ColorDot hex={COLOR_HEX[v.color]} /> {labels[s.productId]}
                        </p>
                        {p !== null && (
                          <p className="mt-0.5 text-sm tabular-nums">
                            {fmt(t.stems, { n: stems })} × {tenge(p)} = {tenge(stems * p)}
                          </p>
                        )}
                      </div>
                      <PickStepper slug={v.slug} group={groupOf(v)} max={s.maxPacks ?? 0} label={v.name} t={t} />
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-muted">{t.packHint}</p>
              <Link href={catalogHref} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent">
                + {t.addMore}
              </Link>
            </>
          ) : (
            <div className="mt-3 rounded-xl bg-surface p-5 text-center">
              <p className="text-muted">{t.empty}</p>
              <Link href={catalogHref} className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-dark">
                {t.toCatalog}
              </Link>
            </div>
          )}
        </section>

        <fieldset className="rounded-2xl border border-line p-5">
          <legend className="px-1 text-lg font-semibold">{t.prepayTitle}</legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PREPAYMENTS.map((p) => (
              <label
                key={p}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40 ${
                  p === pct ? "border-accent bg-accent text-white" : "border-line hover:bg-mint"
                }`}
              >
                <input type="radio" name="pctChoice" value={p} checked={p === pct} onChange={() => setPct(p)} className="sr-only" />
                {p}&nbsp;%
              </label>
            ))}
          </div>
          {classic !== null && double !== null && (
            <p className="mt-3 text-sm text-muted">{fmt(t.prepayHint, { pct, classic: tenge(classic), double: tenge(double) })}</p>
          )}
        </fieldset>

        <fieldset className="grid gap-4 rounded-2xl border border-line p-5 sm:grid-cols-2">
          <legend className="px-1 text-lg font-semibold">{t.pickupTitle}</legend>
          <Field label={t.date} hint={t.dateHint}>
            <input type="date" name="date" required min={data.season.pickupFrom} max={data.season.pickupTo} value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label={t.slot}>
            <select name="slot" required disabled={!slots.length} className={inputCls} value={slots.includes(slot) ? slot : ""} onChange={(e) => setSlot(e.target.value)}>
              <option value="" disabled>{slots.length ? "—" : t.slotFirst}</option>
              {slots.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <fieldset className="grid gap-2 text-sm sm:col-span-2">
            <legend className="mb-1.5 font-medium">{t.method}</legend>
            {(["self", "client_truck"] as const).map((m) => (
              <label key={m} className="flex min-h-11 items-center gap-3">
                <input type="radio" name="method" value={m} defaultChecked={m === "self"} className="size-5 accent-accent" />
                {m === "self" ? t.self : t.truck}
              </label>
            ))}
          </fieldset>
          <div className="sm:col-span-2">
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input type="checkbox" name="storage" checked={storage} onChange={(e) => setStorage(e.target.checked)} className="size-5 accent-accent" />
              {fmt(t.storage, { fee: tenge(perDay) })}
            </label>
            {storage && (
              <p className="mt-1 pl-8 text-xs text-muted" aria-live="polite">
                {date ? fmt(t.storageLine, { days, fee: tenge(perDay) }) + ` = ${tenge(q.fee)}` : t.storageDate}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="grid gap-4 rounded-2xl border border-line p-5 sm:grid-cols-2">
          <legend className="px-1 text-lg font-semibold">{t.contactsTitle}</legend>
          <Field label={legal === "person" ? t.companyOptional : t.company}>
            <input name="company" required={legal !== "person"} maxLength={200} autoComplete="organization" defaultValue={client?.company} className={inputCls} />
          </Field>
          <Field label={t.name}>
            <input name="name" required maxLength={200} autoComplete="name" defaultValue={client?.name} className={inputCls} />
          </Field>
          <Field label={t.phone}>
            <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="+7 7__ ___ __ __" defaultValue={client?.phone} className={inputCls} />
          </Field>
          <fieldset className="grid gap-1.5 text-sm">
            <legend className="mb-1.5 font-medium">{t.legal}</legend>
            <div className="flex flex-wrap gap-x-4">
              {(["ip", "too", "person"] as const).map((l) => (
                <label key={l} className="flex min-h-11 items-center gap-2">
                  <input type="radio" name="legal" value={l} checked={legal === l} onChange={() => setLegal(l)} className="size-5 accent-accent" />
                  {t[l]}
                </label>
              ))}
            </div>
          </fieldset>
          {legal === "too" && (
            <>
              <Field label={t.bin}>
                <input name="bin" required inputMode="numeric" pattern="\d{12}" maxLength={12} className={inputCls} />
              </Field>
              <Field label={t.org}>
                <input name="org" required maxLength={200} className={inputCls} />
              </Field>
            </>
          )}
          <div className="sm:col-span-2">
            <Field label={t.comment}>
              <textarea name="comment" rows={3} maxLength={1000} className={`${inputCls} py-2`} />
            </Field>
          </div>
        </fieldset>
      </div>

      <aside className="rounded-2xl bg-surface p-5 lg:sticky lg:top-24" aria-labelledby="summary-title">
        <h2 id="summary-title" className="text-lg">{t.summaryTitle}</h2>
        <dl className="mt-4 grid gap-3">
          <div>
            <dt className="text-sm text-muted">{t.total}</dt>
            <dd className="font-display text-3xl font-extrabold tabular-nums">{tenge(q.total)}</dd>
          </div>
          {q.fee > 0 && (
            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
              <dt className="text-sm">{fmt(t.storageLine, { days, fee: tenge(perDay) })}</dt>
              <dd className="font-semibold tabular-nums">{tenge(q.fee)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
            <dt className="text-sm">{fmt(t.prepay, { pct })}</dt>
            <dd className="font-semibold tabular-nums">{tenge(q.prepayment)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
            <dt className="text-sm">{t.rest}</dt>
            <dd className="font-semibold tabular-nums">{tenge(q.remainder)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm" aria-live="polite">
          {!q.lines.length ? (
            <span className="text-muted">{t.empty}</span>
          ) : q.missingStems > 0 ? (
            <span className="text-warn">{fmt(t.toMin, { n: q.missingStems })}</span>
          ) : null}
        </p>

        {state?.errors.length || state?.message ? (
          <div role="alert" className="mt-4 rounded-xl bg-up-bg p-3 text-sm text-up">
            <ul className="grid gap-1">
              {state.message && <li>{state.message}</li>}
              {state.errors.map((e) => (
                <li key={e}>
                  {e === "stock"
                    ? fmt(t.errors.stock, { labels: (state.overStock ?? []).map((id) => labels[id]).join(", ") })
                    : t.errors[e]}
                </li>
              ))}
            </ul>
            {state.waText && (
              <a href={waLink(state.waText)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold underline">
                <Icon name="chat" /> {t.sendWa}
              </a>
            )}
          </div>
        ) : null}

        <button type="submit" disabled={blocked} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-5 font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40">
          {pending ? t.sending : t.submit}
        </button>
        <p className="mt-3 text-xs text-muted">{t.noPay}</p>
      </aside>
    </form>
  );
}
