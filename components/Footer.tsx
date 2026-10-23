import Link from "next/link";
import { CONTACTS, instagramUrl, waLink } from "@/content/site";
import { getDict } from "@/lib/dict";
import { Icon } from "./icons";
import { Ph } from "./ui";

export async function Footer() {
  const { t, href } = await getDict();
  const ext = { target: "_blank", rel: "noopener noreferrer", className: "flex min-h-8 items-center gap-2 hover:text-white" };
  return (
    <footer className="bg-night text-night-text">
      <div className="shell grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold text-white">Guldala</p>
          <p className="mt-3 text-sm">{t.footer.about}</p>
        </div>
        <nav aria-label={t.nav.sections}>
          <ul className="grid gap-2 text-sm">
            <li><Link href={href("/tulpan")} className="hover:text-white">{t.footer.tulpan}</Link></li>
            <li><Link href={href("/tulpan/sorta")} className="hover:text-white">{t.nav.sorta}</Link></li>
            <li><Link href={href("/o-nas")} className="hover:text-white">{t.nav.about}</Link></li>
            <li><Link href={href("/kontakty")} className="hover:text-white">{t.nav.contacts}</Link></li>
          </ul>
        </nav>
        <div className="grid content-start gap-2 text-sm">
          <a href={waLink(t.wa.hello)} {...ext}>
            <Icon name="chat" className="size-4" /> WhatsApp {CONTACTS.phone}
          </a>
          <a href={instagramUrl(CONTACTS.instagramTulpan)} {...ext}>
            <Icon name="instagram" className="size-4" /> @{CONTACTS.instagramTulpan}
          </a>
          <p className="flex items-center gap-2">
            <Icon name="send" className="size-4" /> Telegram: <Ph>{t.ph.telegram}</Ph>
          </p>
          <p className="flex items-center gap-2">
            <Icon name="pin" className="size-4" /> <Ph>{t.ph.address}</Ph>
          </p>
          <p>{t.footer.pickup(t.contacts.hours)}</p>
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
