import { Icon } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { ButtonLink, Ph } from "@/components/ui";
import { CONTACTS, instagramUrl, waLink } from "@/content/site";
import { getDict, pageMeta } from "@/lib/dict";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/kontakty", t.meta.contacts.title, t.meta.contacts.description);
}

export default async function ContactsPage() {
  const { t } = await getDict();
  const box = "rounded-2xl border border-line p-6";
  const ext = { target: "_blank", rel: "noopener noreferrer", className: "flex min-h-11 items-center gap-2 hover:text-accent" };
  return (
    <div className="shell py-10 md:py-14">
      <h1 className="text-3xl sm:text-5xl">{t.contacts.h1}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className={box}>
          <h2 className="text-xl">WhatsApp</h2>
          <p className="mt-2 font-display text-2xl font-extrabold">{CONTACTS.phone}</p>
          <p className="mt-1 text-sm text-muted">{t.contacts.waText}</p>
          <ButtonLink href={waLink(t.wa.hello)} className="mt-4">
            <Icon name="chat" /> {t.wa.button}
          </ButtonLink>
        </section>
        <section className={box}>
          <h2 className="text-xl">{t.contacts.hoursTitle}</h2>
          <p className="mt-2">{t.contacts.hours}</p>
          <h2 className="mt-6 text-xl">{t.contacts.socialTitle}</h2>
          <ul className="mt-1 text-sm">
            <li><a href={instagramUrl(CONTACTS.instagramTulpan)} {...ext}><Icon name="instagram" className="size-4 text-accent" /> @{CONTACTS.instagramTulpan}</a></li>
            <li><a href={instagramUrl(CONTACTS.instagramBotanica)} {...ext}><Icon name="instagram" className="size-4 text-accent" /> @{CONTACTS.instagramBotanica}</a></li>
            <li className="flex min-h-11 items-center gap-2"><Icon name="send" className="size-4 text-accent" /> Telegram: <Ph>{t.ph.telegram}</Ph></li>
          </ul>
        </section>
        <section className={`${box} md:col-span-2 grid gap-4 md:grid-cols-[1fr_2fr]`}>
          <div>
            <h2 className="text-xl">{t.contacts.addressTitle}</h2>
            <p className="mt-2 flex items-center gap-2"><Icon name="pin" className="size-4 text-accent" /> <Ph>{t.ph.address}</Ph></p>
          </div>
          <Photo label={t.photos.map} ratio="3/2" />
        </section>
      </div>
    </div>
  );
}
