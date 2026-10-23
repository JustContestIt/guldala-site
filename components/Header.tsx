import Link from "next/link";
import { waLink } from "@/content/site";
import { getDict } from "@/lib/dict";
import { Icon } from "./icons";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { ButtonLink } from "./ui";

export async function Header() {
  const { lang, t, href } = await getDict();
  const nav: [string, string][] = [
    [href("/tulpan"), t.nav.tulpan],
    [href("/tulpan/sorta"), t.nav.sorta],
    [href("/o-nas"), t.nav.about],
    [href("/kontakty"), t.nav.contacts],
  ];
  const wa = waLink(t.wa.hello);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="shell flex h-16 items-center gap-8">
        <Link href={href("/")} className="font-display text-xl font-extrabold tracking-tight">
          Guldala
        </Link>
        <nav aria-label={t.nav.main} className="hidden md:block">
          <ul className="flex gap-6 text-sm">
            {nav.map(([to, label]) => (
              <li key={to}>
                <Link href={to} className="hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <LangSwitch lang={lang} label={t.nav.lang} className="hidden md:flex" />
          <ButtonLink href={wa} className="hidden sm:inline-flex">
            <Icon name="chat" /> {t.wa.short}
          </ButtonLink>
          <MobileMenu
            nav={nav}
            waHref={wa}
            lang={lang}
            labels={{ menu: t.nav.menu, open: t.nav.open, close: t.nav.close, lang: t.nav.lang, wa: t.wa.button }}
          />
        </div>
      </div>
    </header>
  );
}
