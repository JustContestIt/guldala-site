import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { waLink } from "@/content/site";
import { getDict } from "@/lib/dict";
import { tenge } from "@/lib/format";
import { parseItems, quote } from "@/lib/order";
import { almatyDay, PREPAYMENTS } from "@/lib/pricing";
import { getSeason, type PrepaymentPct } from "@/lib/season";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: t.meta.gotovo, robots: { index: false } };
}

export default function GotovoPage({ searchParams }: PageProps<"/[lang]/tulpan/zakaz/gotovo">) {
  return (
    <div className="shell max-w-3xl py-10 md:py-14">
      <Suspense fallback={<div className="h-96 rounded-2xl bg-surface" />}>
        <Receipt searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// The URL carries what was sent (number, items, %, date); totals are recomputed, never read from the URL
async function Receipt({ searchParams }: { searchParams: PageProps<"/[lang]/tulpan/zakaz/gotovo">["searchParams"] }) {
  const { t, href } = await getDict();
  const sp = await searchParams;
  const n = String(sp.n ?? "");
  const pct = Number(sp.p) as PrepaymentPct;
  const items = parseItems(String(sp.i ?? ""));
  const date = String(sp.d ?? "");
  if (!/^T-\d{4}-\d{4}$/.test(n) || !PREPAYMENTS.includes(pct) || !items?.length || !/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const { asOf, priceGrid, stock } = await getSeason();
  const q = quote({ priceGrid, stock }, items, pct, almatyDay(new Date(asOf)));

  return (
    <>
      <p className="grid size-14 place-items-center rounded-full bg-mint text-accent">
        <Icon name="check" className="size-8" />
      </p>
      <h1 className="mt-4 text-3xl sm:text-4xl">{t.gotovo.h1(n)}</h1>
      <p className="mt-2 text-muted">{t.gotovo.lead}</p>

      <section className="mt-8 rounded-2xl border border-line p-5">
        <h2 className="text-lg">{t.gotovo.items}</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {q.lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-4 py-2">
              <span>
                {t.product(l.color, l.type)} · {l.stems} × {tenge(l.pricePerStem)}
              </span>
              <span className="font-semibold tabular-nums">{tenge(l.sum)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 grid gap-2 border-t border-line pt-3 text-sm">
          <div className="flex justify-between gap-4"><dt>{t.calc.total}</dt><dd className="font-semibold tabular-nums">{tenge(q.total)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.order.prepay(pct)}</dt><dd className="font-semibold tabular-nums">{tenge(q.prepayment)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.calc.rest}</dt><dd className="font-semibold tabular-nums">{tenge(q.remainder)}</dd></div>
        </dl>
        <p className="mt-3 text-sm text-muted">{t.gotovo.pickup(t.dayMonth(date))}</p>
      </section>

      <p className="mt-6 rounded-xl bg-warn-bg p-4 text-sm text-warn">{t.gotovo.hold}</p>

      <section className="mt-6">
        <h2 className="text-lg">{t.gotovo.kaspiTitle}</h2>
        <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm">
          {t.gotovo.kaspiSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={waLink(t.wa.order(n))}>
          <Icon name="chat" /> {t.gotovo.write}
        </ButtonLink>
        <ButtonLink href={href("/tulpan")} variant="secondary">{t.gotovo.back}</ButtonLink>
      </div>
    </>
  );
}
