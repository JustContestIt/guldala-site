import Link from "next/link";
import type { Dict } from "@/content/dict/ru";
import { waLink } from "@/content/site";
import { getDict } from "@/lib/dict";
import { Icon } from "./icons";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { ButtonLink } from "./ui";

export const botanicaNav = (t: Dict, href: (p: string) => string): [string, string][] => [
  [href("/rasteniya"), t.botanica.plantsTitle],
  [href("/proekty"), t.botanica.projectsTitle],
  [`${href("/")}#zayavka`, t.botanica.leadTitle],
];

// `botanica`: the Botanica landing on botanica.<domain> — its own name and menu, no tulips; paths there are short (/rasteniya)
export async function Header({ botanica = false }: { botanica?: boolean }) {
  const { lang, t, href } = await getDict();
  const nav: [string, string][] = botanica
    ? botanicaNav(t, href)
    : [
        [href("/tulpan"), t.nav.tulpan],
        [href("/tulpan/sorta"), t.nav.sorta],
        [href("/o-nas"), t.nav.about],
        [href("/kontakty"), t.nav.contacts],
      ];
  const wa = waLink(botanica ? t.wa.botanica : t.wa.hello);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="shell flex h-16 items-center gap-8">
        <Link href={href("/")} className="font-display text-xl font-extrabold tracking-tight">
          {botanica ? "Guldala Botanica" : "Guldala"}
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
