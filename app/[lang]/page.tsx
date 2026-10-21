import Link from "next/link";
import { Icon } from "@/components/icons";
import { OrderSteps } from "@/components/OrderSteps";
import { Photo } from "@/components/Photo";
import { ButtonLink, Ph, SectionTitle } from "@/components/ui";
import { COLOR_HEX, COLOR_IDS } from "@/content/colors";
import { CONTACTS, instagramUrl, waLink } from "@/content/site";
import { getDict, pageMeta } from "@/lib/dict";
import { tenge } from "@/lib/format";
import { getSeason } from "@/lib/season";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/", t.meta.site, t.meta.siteDesc);
}

export default async function Home() {
  const { t, href } = await getDict();
  const { season, prices } = await getSeason();
  const ext = { target: "_blank", rel: "noopener noreferrer", className: "flex min-h-8 items-center gap-2 hover:text-accent" };

  return (
    <>
      <section className="relative">
        <Photo label={t.photos.homeHero} className="h-[80svh] min-h-[520px] max-h-[760px] rounded-none" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell pb-8 sm:pb-12">
            <div className="max-w-xl rounded-3xl bg-white p-6 sm:p-8">
              <p className="text-sm text-muted">{t.home.place}</p>
              <h1 className="mt-2 text-3xl leading-tight sm:text-5xl">{t.home.h1}</h1>
              <p className="mt-3 text-muted">{t.home.lead}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-6 py-12 md:grid-cols-2 md:py-16">
        <Link href={href("/tulpan")} className="group block">
          <div className="relative">
            <Photo label={t.photos.homeTulpan} ratio="4/5" />
            <span className="absolute bottom-3 left-3 right-3 rounded-xl bg-white px-3 py-2 text-sm font-medium">
              {season.saleOpen ? t.home.badgeOpen(tenge(prices.classic.today)) : t.home.badgeClosed}
            </span>
          </div>
          <h2 className="mt-4 text-2xl group-hover:text-accent">Guldala Tulpan</h2>
          <p className="mt-1 text-muted">{t.home.tulpanText}</p>
          <span className="mt-3 inline-flex items-center gap-2 font-semibold text-accent">
            {t.home.tulpanCta} <Icon name="arrow" className="size-4" />
          </span>
        </Link>
        <Link href={href("/botanica")} className="group block">
          <Photo label={t.photos.homeBotanica} ratio="4/5" dark />
          <h2 className="mt-4 text-2xl group-hover:text-accent">Guldala Botanica</h2>
          <p className="mt-1 text-muted">{t.home.botanicaText}</p>
          <span className="mt-3 inline-flex items-center gap-2 font-semibold text-accent">
            {t.home.botanicaCta} <Icon name="arrow" className="size-4" />
          </span>
        </Link>
      </section>

      <section className="bg-surface py-12 md:py-16">
        <div className="shell">
          <SectionTitle title={t.home.colorsTitle} lead={t.home.colorsLead} />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {COLOR_IDS.map((c) => (
              <li key={c}>
                <Link href={href(`/tulpan/sorta?color=${c}`)} className="group block">
                  <Photo label={t.photos.colorCloseup(t.colors[c])} ratio="1/1" swatch={COLOR_HEX[c]} />
                  <span className="mt-2 block font-semibold group-hover:text-accent">{t.colors[c]}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={href("/tulpan/sorta?type=double")} className="group block">
                <Photo label={t.photos.doublesCloseup} ratio="1/1" />
                <span className="mt-2 block font-semibold group-hover:text-accent">{t.home.doubles}</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {(
            [
              ["46", t.home.facts.varieties],
              [t.home.facts.own, t.home.facts.ownLabel],
              [<Ph key="a">{t.ph.area}</Ph>, t.home.facts.area],
              [<Ph key="s">{t.ph.seasons}</Ph>, t.home.facts.seasons],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="flex flex-col">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="order-first font-display text-4xl font-extrabold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell pb-12 md:pb-16">
        <SectionTitle title={t.home.howTitle} lead={t.home.howLead} />
        <OrderSteps />
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={href("/tulpan")}>{t.home.priceCta}</ButtonLink>
          <ButtonLink href={waLink(t.wa.tulips)} variant="secondary">
            <Icon name="chat" /> {t.wa.button}
          </ButtonLink>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell grid gap-6 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl">{t.home.contactTitle}</h2>
            <p className="mt-2 text-muted">{t.home.contactText(CONTACTS.phone)}</p>
          </div>
          <ul className="grid gap-2 text-sm">
            <li className="flex items-center gap-2">
              <Icon name="pin" className="size-4 text-accent" /> <Ph>{t.ph.address}</Ph>
            </li>
            <li>
              <a href={instagramUrl(CONTACTS.instagramTulpan)} {...ext}>
                <Icon name="instagram" className="size-4 text-accent" /> @{CONTACTS.instagramTulpan}
              </a>
            </li>
            <li>
              <a href={instagramUrl(CONTACTS.instagramBotanica)} {...ext}>
                <Icon name="instagram" className="size-4 text-accent" /> @{CONTACTS.instagramBotanica}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
