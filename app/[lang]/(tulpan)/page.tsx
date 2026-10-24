import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/icons";
import { OrderSteps } from "@/components/OrderSteps";
import { Photo } from "@/components/Photo";
import { ButtonLink, Ph, SectionTitle } from "@/components/ui";
import { COLOR_HEX, COLOR_IDS } from "@/content/colors";
import { CONTACTS, instagramUrl, waLink } from "@/content/site";
import { getDict, pageMeta } from "@/lib/dict";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/", t.meta.site, t.meta.siteDesc);
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeBody />
    </Suspense>
  );
}

async function HomeBody() {
  const { t, href } = await getDict();
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
          </ul>
        </div>
      </section>
    </>
  );
}
