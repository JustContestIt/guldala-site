import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { OrderBar } from "@/components/Picks";
import { VarietyCard } from "@/components/VarietyCard";
import { VarietyInfo } from "@/components/VarietyInfo";
import { COLOR_HEX } from "@/content/colors";
import { VARIETIES, type Variety } from "@/content/varieties";
import { getDict, pageMeta } from "@/lib/dict";
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
  const { t, href } = await getDict();
  const { asOf, priceGrid, stock, prices } = await getSeason();
  const line = (x: Variety) => stock.find((s) => s.color === x.color && s.type === x.type);
  const statusOf = (x: Variety) => line(x)?.status ?? "none";
  const similar = VARIETIES.filter((x) => x.slug !== v.slug && x.color === v.color)
    .concat(VARIETIES.filter((x) => x.slug !== v.slug && x.color !== v.color && x.type === v.type))
    .slice(0, 4);

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
          <VarietyInfo v={v} status={statusOf(v)} max={line(v)?.maxPacks ?? 0} price={prices[v.type].today} />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">{t.variety.similar}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
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
