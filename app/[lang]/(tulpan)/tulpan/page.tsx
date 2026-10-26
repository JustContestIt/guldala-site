import Link from "next/link";
import rows from "@/assets/greenhouse-rows.jpg";
import packs from "@/assets/packs.jpg";
import { Suspense } from "react";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/icons";
import { OrderSteps } from "@/components/OrderSteps";
import { Photo } from "@/components/Photo";
import { ButtonLink, SectionTitle, StockBadge } from "@/components/ui";
import { COLOR_HEX, TULIP_TYPES } from "@/content/colors";
import { waLink } from "@/content/site";
import { groupPhoto } from "@/content/variety-photos";
import { shadesOf } from "@/content/varieties";
import { getDict, pageMeta } from "@/lib/dict";
import { tenge } from "@/lib/format";
import { almatyDay, PREPAYMENTS, pricePerStem } from "@/lib/pricing";
import { getSeason } from "@/lib/season";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/tulpan", t.meta.tulpan.title, t.meta.tulpan.description);
}

export default function TulpanPage() {
  return (
    <Suspense fallback={null}>
      <TulpanBody />
    </Suspense>
  );
}

// Prices and stock; the conditions, the greenhouse and the questions live on the home page
async function TulpanBody() {
  const { t, href } = await getDict();
  const { season, asOf, prices, priceGrid, stock } = await getSeason();
  const today = almatyDay(new Date(asOf));
  const periods = [...new Set(priceGrid.map((r) => r.periodEnd))].sort();
  const currentPeriod = periods.find((end) => today <= end);

  return (
    <>
      <section className="relative">
        <Photo
          label={t.photos.tulpanHero}
          src={rows}
          priority
          sizes="(max-width: 639px) 200vw, 100vw"
          className="h-[56svh] min-h-[420px] max-h-[600px] rounded-none [&_img]:object-[50%_60%] max-sm:[&_img]:origin-[50%_87%] max-sm:[&_img]:scale-200"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell pb-8">
            <div className="max-w-xl rounded-3xl bg-white p-6 sm:p-8">
              <p className="text-sm font-medium text-accent">
                {t.tulpan.season(season.peakDate.slice(0, 4))} · {season.saleOpen ? t.tulpan.open : t.tulpan.closed}
              </p>
              <h1 className="mt-2 text-3xl leading-tight sm:text-5xl">{t.tulpan.h1}</h1>
              <p className="mt-3 text-muted">{t.tulpan.lead}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={href("/tulpan/sorta")}>{t.tulpan.calcCta}</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12 md:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="self-start rounded-3xl bg-white p-6 sm:p-8">
            <h2 className="text-2xl">{t.tulpan.priceTitle(t.dayMonth(asOf))}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {TULIP_TYPES.map((type) => (
                <div key={type}>
                  <p className="text-sm text-muted">{t.types[type]}</p>
                  <p className="mt-1 font-display text-3xl font-extrabold whitespace-nowrap sm:text-5xl">{t.from(tenge(prices[type].today))}</p>
                  <p className="text-sm text-muted">{t.tulpan.perStem}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">{t.tulpan.priceNote}</p>
            {prices.classic.next && prices.double.next && (
              <p className="mt-4 rounded-xl bg-up-bg px-4 py-3 text-sm text-up">
                {t.tulpan.nextPrice(prices.classic.next.from, tenge(prices.classic.next.price), tenge(prices.double.next.price))}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={href("/tulpan/sorta")}>{t.tulpan.calcCta}</ButtonLink>
              <ButtonLink href={waLink(t.wa.tulips)} variant="secondary">
                <Icon name="chat" /> {t.wa.button}
              </ButtonLink>
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-line bg-white p-5 sm:p-8">
            <h2 className="text-xl">{t.tulpan.gridTitle}</h2>
            {TULIP_TYPES.map((type) => (
              <div key={type} className="mt-6 overflow-x-auto">
                <table className="w-full text-right text-sm tabular-nums">
                  <caption className="mb-2 text-left font-semibold">{t.tulpan.gridCaption(t.types[type])}</caption>
                  <thead className="text-muted">
                    <tr>
                      <th scope="col" className="py-2 text-left font-normal">{t.tulpan.gridOrder}</th>
                      {PREPAYMENTS.map((p) => (
                        <th key={p} scope="col" className="py-2 pr-2 font-normal">{p}&nbsp;%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((end) => (
                      <tr key={end} className={`border-t border-line ${end === currentPeriod ? "bg-mint font-semibold" : ""}`}>
                        <th scope="row" className="py-2 pl-2 text-left font-normal">{t.tulpan.gridUntil(end)}</th>
                        {PREPAYMENTS.map((p) => (
                          <td key={p} className="py-2 pr-2">{pricePerStem(priceGrid, type, p, end)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <SectionTitle title={t.tulpan.colorsTitle} lead={t.tulpan.colorsLead} />
        <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3">
          {stock.map((s) => (
            <li key={s.productId} className="w-[62%] shrink-0 snap-start sm:w-[34%] lg:w-[23%]">
              <Link href={href(`/tulpan/sorta?color=${shadesOf(s).join(",") || s.color}&type=${s.type}`)} className="group block">
                {/* our own pack photo for red classics; other lines show a variety's field shot (its second photo) */}
                <Photo
                  label={t.photos.pack(t.product(s.color, s.type))}
                  src={s.color === "red" && s.type === "classic" ? packs : groupPhoto((v) => v.color === s.color && v.type === s.type, 1)}
                  ratio="4/5"
                  swatch={COLOR_HEX[s.color]}
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 34vw, 62vw"
                />
                <span className="mt-3 block font-semibold group-hover:text-accent">{t.product(s.color, s.type)}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <StockBadge status={s.status} t={t.stock} /> {t.fromPerStem(tenge(prices[s.type].today))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-12 md:pb-16">
        <SectionTitle title={t.tulpan.stepsTitle} />
        <OrderSteps />
      </section>

      <section className="shell pb-12 md:pb-16">
        <SectionTitle title={t.home.faqTitle} />
        <Faq />
      </section>
    </>
  );
}
