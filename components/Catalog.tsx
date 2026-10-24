"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { SHADE_HEX, SHADES, TULIP_TYPES } from "@/content/colors";
import type { Dict } from "@/content/dict/ru";
import { activeFilters, matches, readFilters, writeFilters, type Facets, type Filters } from "@/lib/catalog";
import { Icon } from "./icons";
import { ColorDot, inputCls } from "./ui";

// card, row and detail come rendered from the server; the browser only filters them and opens the window
export type CatalogItem = Facets & { slug: string; name: string; card: ReactNode; row: ReactNode; detail: ReactNode };

type Props = {
  items: CatalogItem[];
  counts: string[]; // counts[n]: «n сортов» in the page language — functions can't be handed to the browser
  shows: string[]; // shows[n]: «Показать n сортов»
  t: Dict["sorta"]["ui"];
  colors: Dict["colors"];
  types: Dict["types"];
};

const LABEL = "text-xs font-semibold tracking-wide text-muted uppercase";
const CHIP =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-white";
// a literal color: older Safari doesn't pass the theme variables to ::backdrop
const DIALOG = "bg-white p-0 text-ink shadow-xl backdrop:bg-[#15231b80]";

export function Catalog({ items, counts, shows, t, colors, types }: Props) {
  // The filters live in the address only: a link to the catalog (the header's «Сорта») shows what it says, like a reload
  const f = readFilters(useSearchParams());
  const [open, setOpen] = useState<CatalogItem>();
  const sheet = useRef<HTMLDialogElement>(null);
  const peek = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const opened = useRef(""); // the address when the filters opened
  const shown = items.filter((x) => matches(x, f));
  const active = activeFilters(f);

  useEffect(() => {
    if (open) peek.current?.showModal();
  }, [open]);

  // A change starts from the live address, not from this render: two quick taps both count.
  // Next.js picks the new address up in useSearchParams; nothing goes to the server
  const update = (change: (f: Filters) => Partial<Filters>) => {
    const cur = readFilters(new URLSearchParams(location.search));
    history.replaceState(null, "", writeFilters({ ...cur, ...change(cur) }, location.search) || location.pathname);
  };
  const reset = () => {
    update(() => ({ q: "", colors: [], type: undefined, stock: false, tall: false, twoTone: false }));
    if (search.current) search.current.value = "";
  };
  const openFilters = () => {
    // the search box isn't bound to the address while typing (the address catches up a moment later); it reads it on open
    if (search.current) search.current.value = f.q;
    opened.current = location.search;
    sheet.current?.showModal();
  };
  // New filters show the list from its start, not from where the longer list was scrolled to
  const filtersClosed = () => {
    if (location.search !== opened.current && (list.current?.getBoundingClientRect().top ?? 0) < 0) list.current?.scrollIntoView();
  };

  // A plain click on a variety's link opens the window; with Ctrl/⌘ or Shift the browser still opens its page
  const click = (x: CatalogItem) => (e: MouseEvent) => {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target as Element).closest("a")) return;
    e.preventDefault();
    setOpen(x);
  };

  return (
    <>
      {/* Plain sticky under the sticky header: same height stuck or not, so nothing jumps while scrolling */}
      <div className="sticky top-16 z-20 border-b border-line bg-surface">
        <div className="shell flex min-h-16 items-center gap-3">
          <button
            type="button"
            onClick={openFilters}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-accent/25 bg-white px-4 text-sm font-semibold text-accent shadow-sm hover:bg-mint"
          >
            <Icon name="filter" /> {t.filters}
            {active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-white">{active}</span>}
          </button>
          <p aria-live="polite" className="min-w-0 flex-1 truncate text-sm text-muted">
            {counts[shown.length]}
          </p>
          <div role="group" aria-label={t.view} className="flex shrink-0 rounded-full border border-line bg-white p-1">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={f.view === v}
                aria-label={t[v]}
                title={t[v]}
                onClick={() => update(() => ({ view: v }))}
                className="grid size-9 place-items-center rounded-full text-muted aria-pressed:bg-accent aria-pressed:text-white"
              >
                <Icon name={v === "grid" ? "grid" : "rows"} className="size-4.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={list} className="shell scroll-mt-32 pt-5">
        {shown.length ? (
          <ul className={f.view === "grid" ? "grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" : "grid gap-3 lg:grid-cols-2"}>
            {shown.map((x) => (
              <li key={x.slug} onClickCapture={click(x)}>
                {f.view === "grid" ? x.card : x.row}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center text-muted">
            <p>{t.empty}</p>
            <button type="button" onClick={reset} className="mt-3 min-h-11 text-accent underline underline-offset-2">
              {t.reset}
            </button>
          </div>
        )}
      </div>

      {/* Filters: a bottom sheet on the phone, a centred box on a wide screen; the list behind updates as you tap */}
      <dialog
        ref={sheet}
        aria-labelledby="catalog-filters"
        onClick={closeOnBackdrop}
        onClose={filtersClosed}
        className={`${DIALOG} m-0 mt-auto max-h-[92svh] w-full max-w-none rounded-t-3xl sm:m-auto sm:max-w-md sm:rounded-3xl`}
      >
        <div className="flex max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <h2 id="catalog-filters" className="text-xl">
              {t.filters}
            </h2>
            <Close label={t.close} onClick={() => sheet.current?.close()} />
          </div>
          <div className="overflow-y-auto overscroll-contain px-4 pb-4">
            <div className="grid gap-6 rounded-2xl bg-surface p-4">
              <label className="grid gap-2">
                <span className={LABEL}>{t.search}</span>
                <input
                  ref={search}
                  type="search"
                  onChange={(e) => update(() => ({ q: e.target.value }))}
                  placeholder={t.searchHint}
                  enterKeyHint="search"
                  className={inputCls}
                />
              </label>
              <div className="grid gap-1">
                {(["stock", "tall", "twoTone"] as const).map((k) => (
                  <Switch key={k} on={f[k]} onClick={() => update((c) => ({ [k]: !c[k] }))}>
                    {t[k === "stock" ? "inStock" : k]}
                  </Switch>
                ))}
              </div>
              <fieldset>
                <legend className={LABEL}>{t.color}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SHADES.map((c) => {
                    const on = f.colors.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={on}
                        onClick={() => update((cur) => ({ colors: cur.colors.includes(c) ? cur.colors.filter((x) => x !== c) : [...cur.colors, c] }))}
                        className={CHIP}
                      >
                        <ColorDot hex={SHADE_HEX[c]} /> {colors[c]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset>
                <legend className={LABEL}>{t.type}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TULIP_TYPES.map((x) => (
                    <button key={x} type="button" aria-pressed={f.type === x} onClick={() => update((c) => ({ type: c.type === x ? undefined : x }))} className={CHIP}>
                      {types[x]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <button
                type="button"
                onClick={reset}
                disabled={!active}
                className="min-h-11 rounded-xl border border-dashed border-muted/40 text-sm text-muted hover:bg-white disabled:opacity-50"
              >
                {t.reset}
              </button>
            </div>
          </div>
          <div className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => sheet.current?.close()}
              className="min-h-12 w-full rounded-2xl bg-accent text-base font-semibold text-white hover:bg-accent-dark"
            >
              {shows[shown.length]}
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={peek}
        aria-label={open?.name}
        onClose={() => setOpen(undefined)}
        onClick={closeOnBackdrop}
        className={`${DIALOG} m-auto max-h-[calc(100svh-2rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-hidden rounded-3xl`}
      >
        {/* first in the window, so opening it focuses «Закрыть» rather than the order button */}
        <Close label={t.close} onClick={() => peek.current?.close()} className="absolute top-3 right-3 z-10" />
        {open && <div className="max-h-[inherit] overflow-y-auto overscroll-contain p-4 pt-16 sm:px-6 sm:pb-6">{open.detail}</div>}
      </dialog>
    </>
  );
}

function Switch({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick} className="flex min-h-11 items-center justify-between gap-4 text-left font-medium">
      {children}
      <span aria-hidden="true" className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}>
        <span className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

// A tap on the backdrop lands on the <dialog> itself, a tap on its content lands inside
const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => e.target === e.currentTarget && e.currentTarget.close();

function Close({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-10 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-sm hover:bg-mint ${className}`}
    >
      <Icon name="close" strokeWidth={2.2} />
    </button>
  );
}
