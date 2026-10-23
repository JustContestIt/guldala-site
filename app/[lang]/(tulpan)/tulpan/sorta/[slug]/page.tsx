import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { OrderBar, PickStepper } from "@/components/Picks";
import { ButtonLink, ColorDot, Ph, StockBadge } from "@/components/ui";
import { VarietyCard } from "@/components/VarietyCard";
import { COLOR_HEX } from "@/content/colors";
import { waLink } from "@/content/site";
import { groupOf, VARIETIES, type Variety } from "@/content/varieties";
import { getDict, pageMeta } from "@/lib/dict";
import { tenge } from "@/lib/format";
import { getSeason } from "@/lib/season";

export function generateStaticParams() {
  return VARIETIES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tulpan/sorta/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = VARIETIES.find((x) => x.slug === slug);
  if (!v) return {};
  const { t } = await getDict();
  return pageMeta(`/tulpan/sorta/${slug}`, t.meta.variety(v.name, t.product(v.color, v.type)));
}

export default async function VarietyPage({ params }: PageProps<"/[lang]/tulpan/sorta/[slug]">) {
  const { slug } = await params;
  const v = VARIETIES.find((x) => x.slug === slug);
  if (!v) notFound();
  return (
    <Suspense fallback={null}>
      <VarietyBody v={v} />
    </Suspense>
  );
}

async function VarietyBody({ v }: { v: Variety }) {
  const { t, href, lang } = await getDict();
  const { asOf, priceGrid, stock, prices } = await getSeason();
  const line = (x: Variety) => stock.find((s) => s.color === x.color && s.type === x.type);
  const statusOf = (x: Variety) => line(x)?.status ?? "none";
  const status = statusOf(v);
  const label = t.product(v.color, v.type);
  const similar = VARIETIES.filter((x) => x.slug !== v.slug && x.color === v.color)
    .concat(VARIETIES.filter((x) => x.slug !== v.slug && x.color !== v.color && x.type === v.type))
    .slice(0, 4);
  const rows: [string, ReactNode][] = [
    [t.variety.color, t.colors[v.color]],
    [t.variety.type, t.types[v.type]],
    [t.variety.stem, v.height ? t.variety.stemValue(v.height) : <Ph>{t.ph.stem}</Ph>],
    [t.variety.vase, v.vaseLife ? t.variety.vaseValue(v.vaseLife) : <Ph>{t.ph.vase}</Ph>],
  ];

  return (
    <div className="shell pt-8 pb-28 md:pt-12">
      <nav aria-label={t.nav.crumbs} className="text-sm text-muted">
        <Link href={href("/tulpan/sorta")} className="hover:text-accent">{t.variety.crumbs}</Link>
        {" / "}
        <Link href={href(`/tulpan/sorta?color=${v.color}`)} className="hover:text-accent">{t.colors[v.color]}</Link>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Photo label={t.photos.bud} ratio="4/5" swatch={COLOR_HEX[v.color]} className="self-start max-sm:aspect-[4/3]!" />

        <div className="self-start lg:sticky lg:top-24">
          <h1 className="text-3xl sm:text-4xl">{v.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted">
            <ColorDot hex={COLOR_HEX[v.color]} className="size-4" /> {t.colors[v.color]} · {t.types[v.type].toLocaleLowerCase(t.locale)}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StockBadge status={status} t={t.stock} />
            <span className="text-sm">{t.variety.priceToday(tenge(prices[v.type].today))}</span>
          </div>

          <p className="mt-4">{v.description[lang]}</p>

          {status !== "none" && (
            <div className="mt-6 max-w-xs">
              <PickStepper slug={v.slug} group={groupOf(v)} max={line(v)?.maxPacks ?? 0} label={v.name} t={t.calc} />
            </div>
          )}

          <dl className="mt-6 grid gap-2 text-sm">
            {rows.map(([k, val]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-2">
                <dt className="text-muted">{k}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 rounded-xl bg-surface p-4 text-sm text-muted">{t.variety.note}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={waLink(t.wa.variety(label))} variant="secondary">
              <Icon name="chat" /> {t.variety.ask}
            </ButtonLink>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">{t.variety.similar}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {similar.map((x) => (
              <li key={x.slug}>
                <VarietyCard v={x} status={statusOf(x)} max={line(x)?.maxPacks ?? 0} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <OrderBar data={{ asOf, priceGrid, stock }} href={href("/tulpan/zakaz")} t={t.calc.bar} />
    </div>
  );
}
