import Link from "next/link";
import { CONTACTS, instagramUrl, waLink } from "@/content/site";
import { getDict } from "@/lib/dict";
import { botanicaNav } from "./Header";
import { Icon } from "./icons";
import { Ph } from "./ui";

export async function Footer({ botanica = false }: { botanica?: boolean }) {
  const { t, href } = await getDict();
  const nav: [string, string][] = botanica
    ? botanicaNav(t, href)
    : [
        [href("/tulpan"), t.footer.tulpan],
        [href("/tulpan/sorta"), t.nav.sorta],
        [href("/o-nas"), t.nav.about],
        [href("/kontakty"), t.nav.contacts],
      ];
  const instagram = botanica ? CONTACTS.instagramBotanica : CONTACTS.instagramTulpan;
  const ext = { target: "_blank", rel: "noopener noreferrer", className: "flex min-h-8 items-center gap-2 hover:text-white" };
  return (
    <footer className={`bg-night text-night-text ${botanica ? "border-t border-white/10" : ""}`}>
      <div className="shell grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold text-white">{botanica ? "Guldala Botanica" : "Guldala"}</p>
          <p className="mt-3 text-sm">{botanica ? t.botanica.lead : t.footer.about}</p>
        </div>
        <nav aria-label={t.nav.sections}>
          <ul className="grid gap-2 text-sm">
            {nav.map(([to, label]) => (
              <li key={to}><Link href={to} className="hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-2 text-sm">
          <a href={waLink(botanica ? t.wa.botanica : t.wa.hello)} {...ext}>
            <Icon name="chat" className="size-4" /> WhatsApp {CONTACTS.phone}
          </a>
          <a href={instagramUrl(instagram)} {...ext}>
            <Icon name="instagram" className="size-4" /> @{instagram}
          </a>
          <p className="flex items-center gap-2">
            <Icon name="send" className="size-4" /> Telegram: <Ph>{t.ph.telegram}</Ph>
          </p>
          <p className="flex items-center gap-2">
            <Icon name="pin" className="size-4" /> <Ph>{t.ph.address}</Ph>
          </p>
          {!botanica && <p>{t.footer.pickup(t.contacts.hours)}</p>}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="shell py-5 text-xs">
          {t.tulpan.ip} <Ph>{t.ph.ip}</Ph> · {t.tulpan.bin} <Ph>{t.ph.bin}</Ph> · © 2026 Guldala
        </p>
      </div>
    </footer>
  );
}
