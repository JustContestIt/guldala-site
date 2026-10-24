import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import greenhouse from "@/assets/greenhouse-wide.jpg";
import { GreenhouseMap } from "@/components/GreenhouseMap";
import { Icon, type IconName } from "@/components/icons";
import { OrderSteps } from "@/components/OrderSteps";
import { Photo } from "@/components/Photo";
import { ButtonLink, Ph, SectionTitle } from "@/components/ui";
import { COLOR_HEX, COLOR_IDS, TULIP_TYPES } from "@/content/colors";
import { CONTACTS, instagramUrl, waLink } from "@/content/site";
import { VARIETIES } from "@/content/varieties";
import { getDict, pageMeta } from "@/lib/dict";
import { tenge } from "@/lib/format";
import { cachedSeason } from "@/lib/season";

const WHY_ICONS: IconName[] = ["leaf", "pin", "tag", "box", "card", "calendar"];
const chip = "rounded-full border border-line px-4 py-2 text-sm";

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

// The CRM's numbers on the page that sells: without the CRM the page still stands, only they are left out
async function seasonOrNull() {
  await connection(); // never at build time, like getSeason()
  try {
    return await cachedSeason();
  } catch {
    return null;
  }
}

async function HomeBody() {
  const { t, href } = await getDict();
  const ext = { target: "_blank", rel: "noopener noreferrer", className: "flex min-h-11 items-center gap-2 hover:text-accent" };

  return (
    <>
      <section className="relative">
        {/* on a phone the card covers the lower half, so the photo is zoomed 1.5× towards the tulip rows: drawn ~4.5 screens wide */}
        <Photo
          label={t.photos.homeHero}
          src={greenhouse}
          sizes="(max-width: 639px) 450vw, 100vw"
          className="h-[88svh] min-h-[600px] max-h-[800px] rounded-none [&_img]:object-[30%_50%] max-sm:[&_img]:origin-[30%_100%] max-sm:[&_img]:scale-150"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell pb-6 sm:pb-12">
            <div className="max-w-xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-accent">{t.home.eyebrow}</p>
              <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{t.home.h1}</h1>
              <p className="mt-3 text-muted">{t.home.lead(VARIETIES.length)}</p>
              <Suspense fallback={null}>
                <TodayPrice />
              </Suspense>
              {/* one row on a phone too: a second row made the card cover more of the photo; under 380 px WhatsApp is the icon only */}
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={href("/tulpan/sorta")} className="flex-1 whitespace-nowrap sm:flex-none">
                  {t.home.ctaSorts}
                </ButtonLink>
                <ButtonLink href={waLink(t.wa.tulips)} variant="soft">
                  <Icon name="chat" /> <span className="max-[379px]:sr-only">{t.wa.short}</span>
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <SectionTitle title={t.home.whyTitle} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.why.map((w, i) => (
            <li key={w.title} className="flex gap-4 rounded-2xl border border-line p-5 sm:block">
              <Icon name={WHY_ICONS[i]} className="size-7 text-accent" />
              <div>
                <h3 className="text-lg sm:mt-3">{w.title}</h3>
                <p className="mt-1 text-sm text-muted">{w.text}</p>
              </div>
            </li>
          ))}
        </ul>
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
          <ButtonLink href={href("/tulpan/sorta")}>{t.home.ctaSorts}</ButtonLink>
          <ButtonLink href={href("/tulpan")} variant="secondary">
            {t.home.ctaPrices}
          </ButtonLink>
        </div>
      </section>

      <section className="shell pb-12 md:pb-16">
        <SectionTitle title={t.home.conditionsTitle} />
        <ul className="flex flex-wrap gap-2">
          {t.conditions.map((c) => (
            <li key={c} className={chip}>
              {c}
            </li>
          ))}
          <Suspense fallback={<li className={chip}>{t.storageChip(null)}</li>}>
            <StorageChip />
          </Suspense>
        </ul>
      </section>

      <section className="bg-surface py-12 md:py-16">
        <div className="shell">
          <SectionTitle title={t.home.whereTitle} lead={t.home.whereLead} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Photo label={t.photos.greenhouse} ratio="3/2" />
            <Photo label={t.photos.fridge} ratio="3/2" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6">
              <h3 className="text-lg">{t.home.qualityTitle}</h3>
              <dl className="mt-3 grid gap-2 text-sm">
                {(
                  [
                    [t.home.stem, t.ph.stem],
                    [t.home.glass, t.ph.glass],
                    [t.home.bulb, t.ph.bulb],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                    <dt className="text-muted">{k}</dt>
                    <dd>
                      <Ph>{v}</Ph>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <h3 className="text-lg">{t.home.payTitle}</h3>
              <p className="mt-3 text-sm text-muted">{t.home.payText}</p>
              <p className="mt-3 text-sm">
                {t.tulpan.ip} <Ph>{t.ph.ip}</Ph> · {t.tulpan.bin} <Ph>{t.ph.bin}</Ph>
              </p>
              <p className="mt-1 text-sm">{t.contacts.address}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <SectionTitle title={t.home.faqTitle} />
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {t.faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="chevron" className="size-5 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell grid gap-8 py-12 md:grid-cols-[1fr_1.4fr] md:py-16">
          <div>
            <h2 className="text-2xl sm:text-3xl">{t.home.contactTitle}</h2>
            <p className="mt-2 text-muted">{t.home.contactText(CONTACTS.phone.replace(/ /g, "\u00a0"))}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={waLink(t.wa.tulips)}>
                <Icon name="chat" /> {t.wa.button}
              </ButtonLink>
            </div>
            <ul className="mt-4 grid gap-1 text-sm">
              <li>
                <a href={instagramUrl(CONTACTS.instagramTulpan)} {...ext}>
                  <Icon name="instagram" className="size-4 text-accent" /> @{CONTACTS.instagramTulpan}
                </a>
              </li>
              <li className="text-muted">{t.footer.pickup(t.contacts.hours)}</li>
            </ul>
          </div>
          <GreenhouseMap />
        </div>
      </section>
    </>
  );
}

async function TodayPrice() {
  const { t } = await getDict();
  const s = await seasonOrNull();
  const prices = s ? TULIP_TYPES.map((x) => s.prices[x].today).filter((p) => p > 0) : [];
  if (!prices.length) return null;
  return (
    <p className="mt-4 rounded-xl bg-mint px-4 py-3 text-sm">
      <b className="font-display text-lg text-accent-dark">{t.home.priceToday(tenge(Math.min(...prices)))}</b> {t.home.priceHint}
    </p>
  );
}

async function StorageChip() {
  const { t } = await getDict();
  const s = await seasonOrNull();
  return <li className={chip}>{t.storageChip(s ? tenge(s.season.storageFeePerDay) : null)}</li>;
}
