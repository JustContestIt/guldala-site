import { Suspense } from "react";
import { Catalog, type CatalogItem } from "@/components/Catalog";
import { OrderBar } from "@/components/Picks";
import { Ph } from "@/components/ui";
import { VarietyCard, VarietyRow } from "@/components/VarietyCard";
import { VarietyInfo, VarietyPhotos } from "@/components/VarietyInfo";
import { isTall, VARIETIES } from "@/content/varieties";
import { getDict, pageMeta } from "@/lib/dict";
import { isToken } from "@/lib/orders";
import { getSeason } from "@/lib/season";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/tulpan/sorta", t.meta.sorta.title, t.meta.sorta.description);
}

export default async function SortaPage({ searchParams }: PageProps<"/[lang]/tulpan/sorta">) {
  const { t } = await getDict();
  return (
    <div className="bg-surface pb-28">
      <div className="shell pt-10 pb-2 md:pt-14">
        <h1 className="text-3xl sm:text-4xl">{t.sorta.h1}</h1>
        <p className="mt-2 max-w-2xl text-muted">
          {t.sorta.lead(VARIETIES.length)} <Ph>{t.ph.varieties}</Ph>
        </p>
      </div>
      <Suspense fallback={<p className="shell py-20 text-muted">{t.sorta.loading}</p>}>
        <Varieties searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Every variety is rendered here as a card, a list row and a window; the browser filters them without asking the server
async function Varieties({ searchParams }: { searchParams: PageProps<"/[lang]/tulpan/sorta">["searchParams"] }) {
  const { t, href } = await getDict();
  const sp = await searchParams;
  const token = typeof sp.c === "string" && isToken(sp.c) ? sp.c : undefined;
  const { asOf, priceGrid, stock, prices } = await getSeason();
  const items: CatalogItem[] = VARIETIES.map((v) => {
    const line = stock.find((s) => s.color === v.color && s.type === v.type);
    const p = { v, status: line?.status ?? "none", max: line?.maxPacks ?? 0 };
    const [shade] = v.shades;
    const twoTone = v.shades.length > 1;
    return {
      slug: v.slug,
      name: v.name,
      text: `${v.name} ${t.colors[shade]} ${t.types[v.type]} ${twoTone ? t.sorta.ui.twoTone : ""}`.toLowerCase(),
      color: shade,
      type: v.type,
      inStock: p.status !== "none",
      tall: isTall(v),
      twoTone,
      card: <VarietyCard {...p} />,
      row: <VarietyRow {...p} />,
      detail: (
        <>
          <VarietyPhotos v={v} ratio="1/1" sizes="(min-width: 640px) 512px, 100vw" />
          <h2 className="mt-5 text-2xl">{v.name}</h2>
          <VarietyInfo {...p} price={prices[v.type].today} />
        </>
      ),
    };
  });
  const n = Array.from({ length: items.length + 1 }, (_, i) => i);
  return (
    <>
      <Catalog
        items={items}
        counts={n.map(t.sorta.count)}
        shows={n.map(t.sorta.show)}
        t={t.sorta.ui}
        colors={t.colors}
        types={t.types}
      />
      <OrderBar data={{ asOf, priceGrid, stock }} href={href("/tulpan/zakaz")} token={token} t={t.calc.bar} />
    </>
  );
}
