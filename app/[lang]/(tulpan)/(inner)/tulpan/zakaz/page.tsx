import { cookies } from "next/headers";
import { Suspense } from "react";
import { getDict, pageMeta } from "@/lib/dict";
import { getPrefill } from "@/lib/orders";
import { getSeason } from "@/lib/season";
import { Checkout } from "./Checkout";

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

// The token of a WhatsApp link (?c=, or the cookie the catalog set from it) fills the contacts in
async function Loader({ searchParams }: { searchParams: PageProps<"/[lang]/tulpan/zakaz">["searchParams"] }) {
  const { lang, t, href } = await getDict();
  const { c: q } = await searchParams;
  const c = typeof q === "string" ? q : (await cookies()).get("guldala_c")?.value;
  const [{ season, asOf, priceGrid, stock }, prefill] = await Promise.all([getSeason(), c ? getPrefill(c).catch(() => null) : null]);
  const labels = Object.fromEntries(stock.map((s) => [s.productId, t.product(s.color, s.type)]));
  return (
    <Checkout
      lang={lang}
      data={{ season, asOf, priceGrid, stock }}
      t={t.calc}
      labels={labels}
      catalogHref={href("/tulpan/sorta")}
      client={prefill?.client}
      prefillToken={prefill ? c : undefined}
    />
  );
}
