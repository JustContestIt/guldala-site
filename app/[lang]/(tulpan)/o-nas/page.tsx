import { Photo } from "@/components/Photo";
import { ButtonLink, Ph, SectionTitle } from "@/components/ui";
import { getDict, pageMeta } from "@/lib/dict";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/o-nas", t.meta.about.title, t.meta.about.description);
}

export default async function AboutPage() {
  const { t, href } = await getDict();
  return (
    <div className="shell py-10 md:py-14">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl sm:text-5xl">{t.about.h1}</h1>
          <p className="mt-3 text-lg text-muted">{t.about.lead}</p>
          {t.about.text.map((p) => (
            <p key={p} className="mt-4">
              {p}
            </p>
          ))}
          <ButtonLink href={href("/tulpan/sorta")} className="mt-6">
            {t.home.ctaSorts}
          </ButtonLink>
        </div>
        <Photo label={t.photos.aboutHero} ratio="4/5" />
      </div>

      <section className="mt-16">
        <SectionTitle title={t.about.galleryTitle} />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {t.photos.gallery.map((g) => (
            <li key={g}><Photo label={g} ratio="1/1" /></li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionTitle title={t.about.calendarTitle} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.calendar.map((c) => (
            <li key={c.when} className="rounded-2xl bg-surface p-5">
              <p className="font-display text-xl font-extrabold">{c.when}</p>
              <p className="mt-1 text-muted">{c.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-2xl border border-line p-6">
        <h2 className="text-xl">{t.about.reqTitle}</h2>
        <p className="mt-3 text-sm">{t.tulpan.ip} <Ph>{t.ph.ip}</Ph> · {t.tulpan.bin} <Ph>{t.ph.bin}</Ph></p>
        <p className="mt-1 text-sm">{t.contacts.address}</p>
        <ButtonLink href={href("/kontakty")} variant="secondary" className="mt-5">{t.nav.contacts}</ButtonLink>
      </section>
    </div>
  );
}
