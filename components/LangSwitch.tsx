"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { localHref, type Lang } from "@/lib/i18n";

// Reads the URL on click, not during render: the proxy rewrite makes usePathname differ between server and client
export function LangSwitch({ lang, label, className = "" }: { lang: Lang; label: string; className?: string }) {
  const router = useRouter();
  const go = (to: Lang) => (e: MouseEvent) => {
    e.preventDefault();
    if (to === lang) return;
    const path = location.pathname.replace(/^\/(kz|ru)(?=\/|$)/, "") || "/";
    router.push(localHref(to, path) + location.search);
  };
  const cls = (l: Lang) =>
    `inline-flex min-h-11 items-center px-1 ${l === lang ? "font-semibold text-ink" : "text-muted hover:text-accent"}`;
  return (
    <nav aria-label={label} className={`flex items-center gap-1 text-sm ${className}`}>
      <Link href="/" hrefLang="ru" lang="ru" onClick={go("ru")} aria-current={lang === "ru" ? "true" : undefined} className={cls("ru")}>
        RU
      </Link>
      <span aria-hidden="true" className="text-muted">·</span>
      <Link href="/kz" hrefLang="kk" lang="kk" onClick={go("kz")} aria-current={lang === "kz" ? "true" : undefined} className={cls("kz")}>
        KZ
      </Link>
    </nav>
  );
}
