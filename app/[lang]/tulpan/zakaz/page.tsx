import { Suspense } from "react";
import { getDict, pageMeta } from "@/lib/dict";
import { getSeason } from "@/lib/season";
import { Calculator } from "./Calculator";

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/tulpan/zakaz", t.meta.zakaz.title, t.meta.zakaz.description);
}

export default async function ZakazPage({ searchParams }: PageProps<"/[lang]/tulpan/zakaz">) {
  const { t } = await getDict();
  return (
    <div className="shell py-10 md:py-14">
      <h1 className="text-3xl sm:text-4xl">{t.calc.h1}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t.calc.lead}</p>
      <Suspense fallback={<div className="mt-8 h-96 rounded-2xl bg-surface" />}>
        <Loader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// ?product=red-classic preselects a color coming from the catalog
async function Loader({ searchParams }: { searchParams: PageProps<"/[lang]/tulpan/zakaz">["searchParams"] }) {
  const { lang, t } = await getDict();
  const { product } = await searchParams;
  const { season, asOf, priceGrid, stock } = await getSeason();
  const initial = stock.find((s) => s.productId === product && s.status !== "none")?.productId;
  const labels = Object.fromEntries(stock.map((s) => [s.productId, t.product(s.color, s.type)]));
  return (
    <Calculator
      lang={lang}
      data={{ season, asOf, priceGrid, stock }}
      t={t.calc}
      stockT={t.stock}
      labels={labels}
      initial={initial}
    />
  );
}
