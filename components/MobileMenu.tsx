"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { Icon } from "./icons";
import { LangSwitch } from "./LangSwitch";

type Labels = { menu: string; open: string; close: string; lang: string; wa: string };

export function MobileMenu({
  nav,
  waHref,
  lang,
  labels,
}: {
  nav: [string, string][];
  waHref: string;
  lang: Lang;
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen(!open)}
        className="grid size-11 place-items-center rounded-xl bg-accent text-white shadow-sm hover:bg-accent-dark"
      >
        <Icon name={open ? "close" : "menu"} className="size-6" strokeWidth={2.4} />
      </button>
      {open && (
        <nav id="mobile-menu" aria-label={labels.menu} className="absolute inset-x-0 top-16 border-b border-line bg-white">
          <ul className="shell">
            {nav.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-line text-base"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="shell flex items-center justify-between gap-3 py-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white"
            >
              <Icon name="chat" /> {labels.wa}
            </a>
            <LangSwitch lang={lang} label={labels.lang} />
          </div>
        </nav>
      )}
    </div>
  );
}
