"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Dict } from "@/content/dict/ru";
import { VARIETIES } from "@/content/varieties";
import { tenge } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import { linesFromPicks, PACK_SIZE, quote, type Picks } from "@/lib/order";
import { almatyDay } from "@/lib/pricing";
import type { SeasonCurrent } from "@/lib/season";

// The order a visitor assembles in the catalog (variety slug → packs), kept in localStorage across pages and visits
const KEY = "guldala:picks";
const EMPTY: Picks = {};
const subs = new Set<() => void>();
let cache: Picks | undefined;

function read(): Picks {
  if (cache) return cache;
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    // stored data is user-editable: keep whole positive pack counts only
    cache = Object.fromEntries(Object.entries(raw ?? {}).filter(([, n]) => Number.isInteger(n) && n > 0 && n < 1000));
  } catch {
    cache = {};
  }
  return cache;
}

function save(next: Picks) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode or full storage: the order still lives until the tab closes
  }
  subs.forEach((f) => f());
}

function subscribe(f: () => void) {
  subs.add(f);
  const other = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = undefined; // another tab changed the order
    f();
  };
  window.addEventListener("storage", other);
  return () => {
    subs.delete(f);
    window.removeEventListener("storage", other);
  };
}

export const usePicks = () => useSyncExternalStore(subscribe, read, () => EMPTY);

function setPick(slug: string, packs: number) {
  const next = { ...read() };
  if (packs > 0) next[slug] = packs;
  else delete next[slug];
  save(next);
}

// ± one pack from the stored value, not the rendered one: fast double taps must all count; a color's stock caps its varieties
function bump(slug: string, delta: number, group: string[], max: number) {
  const p = read();
  if (delta > 0 && group.reduce((a, s) => a + (p[s] ?? 0), 0) >= max) return;
  setPick(slug, (p[slug] ?? 0) + delta);
}

// A typed pack count, cut to what the color has left after its other varieties (and to what read() keeps)
function setPacks(slug: string, packs: number, group: string[], max: number) {
  const p = read();
  const others = group.reduce((a, s) => a + (s === slug ? 0 : (p[s] ?? 0)), 0);
  setPick(slug, Math.min(packs, max - others, 999));
}

// On the order page right after sending: the basket is now an order
export function ClearPicks() {
  useEffect(() => save({}), []);
  return null;
}

type StepperT = Pick<Dict["calc"], "add" | "less" | "more" | "unit" | "count" | "max">;

// "В заказ" until the first pack, then − N + with N typeable (50 packs shouldn't take 50 taps); varieties of one color share that color's stock
export function PickStepper({ slug, group, max, label, t }: { slug: string; group: string[]; max: number; label: string; t: StepperT }) {
  const picks = usePicks();
  const n = picks[slug] ?? 0;
  // only an empty or zero field lives here while typing: a positive number goes straight to the order
  const [draft, setDraft] = useState<string | null>(null);
  const full = group.reduce((a, s) => a + (picks[s] ?? 0), 0) >= max;
  if (!n)
    return (
      <button
        type="button"
        onClick={() => bump(slug, 1, group, max)}
        disabled={full}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-40"
      >
        + {t.add}
      </button>
    );
  return (
    <div>
      <div className="flex items-center justify-between rounded-xl border border-accent">
        <button type="button" onClick={() => bump(slug, -1, group, max)} aria-label={fmt(t.less, { label })} className="grid h-11 w-10 shrink-0 place-items-center text-lg">
          −
        </button>
        {/* 16px text: iOS zooms the page into smaller inputs */}
        <label className="flex items-center gap-1 text-sm font-semibold">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            enterKeyHint="done"
            aria-label={fmt(t.count, { label })}
            value={draft ?? String(n)}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 3);
              if (Number(v) > 0) setPacks(slug, Number(v), group, max);
              setDraft(Number(v) > 0 ? null : v);
            }}
            onBlur={() => {
              if (draft === "0") setPick(slug, 0); // an empty field just goes back to the count
              setDraft(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="h-9 w-11 rounded-lg bg-mint text-center text-base tabular-nums outline-accent focus:bg-white focus:outline-2"
          />
          {t.unit}
        </label>
        <button type="button" onClick={() => bump(slug, 1, group, max)} disabled={full} aria-label={fmt(t.more, { label })} className="grid h-11 w-10 shrink-0 place-items-center text-lg disabled:opacity-30">
          +
        </button>
      </div>
      {full && <p className="mt-1 text-xs text-warn">{t.max}</p>}
    </div>
  );
}

// Fixed at the bottom while the order has something in it. `token` comes from a WhatsApp link (?c=): remembered
// in a cookie so the checkout can fill the contacts in, whichever page the client opens it from
export function OrderBar({ data, href, token, t }: { data: Pick<SeasonCurrent, "asOf" | "priceGrid" | "stock">; href: string; token?: string; t: Dict["calc"]["bar"] }) {
  const picks = usePicks();
  useEffect(() => {
    if (token) document.cookie = `guldala_c=${token}; path=/; max-age=2592000; samesite=lax`;
  }, [token]);
  const { lines } = linesFromPicks(picks, VARIETIES, data.stock);
  if (!lines.length) return null;
  const q = quote(data, lines, 100, almatyDay(new Date(data.asOf)));
  return (
    <div data-order-bar className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="shell flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">{fmt(t.packs, { n: q.stems / PACK_SIZE, stems: q.stems })}</p>
          <p className={q.missingStems ? "text-warn" : "text-muted"}>{q.missingStems ? fmt(t.toMin, { n: q.missingStems }) : fmt(t.from, { sum: tenge(q.total) })}</p>
        </div>
        <Link href={href} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-dark">
          {t.checkout}
        </Link>
      </div>
    </div>
  );
}
