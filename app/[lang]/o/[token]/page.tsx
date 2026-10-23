import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { ClearPicks } from "@/components/Picks";
import { ButtonLink, Ph } from "@/components/ui";
import { waLink } from "@/content/site";
import { getDict } from "@/lib/dict";
import { tenge, time } from "@/lib/format";
import { getOrder, type OrderStatus } from "@/lib/orders";
import { ShareButton } from "./ShareButton";

export async function generateMetadata({ params }: PageProps<"/[lang]/o/[token]">): Promise<Metadata> {
  const { token } = await params;
  const order = await getOrder(token);
  const { t } = await getDict();
  return { title: order ? t.meta.order(order.orderNumber) : t.meta.notFound, robots: { index: false } };
}

// The order lives in the CRM and changes there: read on every visit, never at build time
export default function OrderPage({ params, searchParams }: PageProps<"/[lang]/o/[token]">) {
  return (
    <div className="shell max-w-3xl py-10 md:py-14">
      <Suspense fallback={<div className="h-96 rounded-3xl bg-surface" />}>
        <Order params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// ?new=1: the site has just sent this order — empty the basket and say how payment works
async function Order({ params, searchParams }: Pick<PageProps<"/[lang]/o/[token]">, "params" | "searchParams">) {
  const { token } = await params;
  const isNew = (await searchParams).new === "1";
  const order = await getOrder(token);
  if (!order) notFound();
  const { t } = await getDict();
  const status = t.statuses[order.status];
  const daysLeft = order.holdUntil ? Math.max(0, Math.ceil((Date.parse(order.holdUntil) - Date.parse(order.asOf)) / 86_400_000)) : 0;
  const when = (iso: string) => `${t.dayMonth(iso)}, ${time(iso)}`;
  // an event is a step the site names, or an order status the CRM moved to
  const eventLabel = (type: string) => t.order.events[type as keyof typeof t.order.events] ?? t.statuses[type as OrderStatus]?.title ?? type;
  const box = "rounded-2xl border border-line p-5";

  return (
    <>
      <section className="rounded-3xl bg-surface p-6 sm:p-8">
        <p className="text-sm text-muted">{t.meta.order(order.orderNumber)}</p>
        <h1 className="mt-1 text-3xl sm:text-4xl">{status.title}</h1>
        <p className="mt-2">{status.next}</p>
        {order.holdUntil && <p className="mt-4 font-semibold text-accent">{t.order.hold(order.holdUntil, daysLeft)}</p>}
      </section>

      {isNew && (
        <section className={`mt-6 ${box}`}>
          <ClearPicks />
          <h2 className="text-lg">{t.order.kaspiTitle}</h2>
          <ol className="mt-2 grid list-decimal gap-1 pl-5 text-sm">
            {t.order.kaspiSteps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </section>
      )}

      {order.invoice && (
        <section className={`mt-6 ${box}`}>
          <h2 className="text-lg">{t.order.payNow}</h2>
          <p className="mt-1 font-display text-3xl font-extrabold tabular-nums">{tenge(order.invoice.amount)}</p>
          <p className="mt-2 text-sm">{t.order.invoice}</p>
          <p className="mt-1 text-sm text-muted">{t.order.kaspiNote}</p>
        </section>
      )}

      <section className={`mt-6 ${box}`}>
        <h2 className="text-lg">{t.order.items}</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {order.items.map((l) => (
            <li key={l.productId} className="flex justify-between gap-4 py-2">
              <span>{t.product(l.color, l.type)} · {l.stems} × {tenge(l.pricePerStem)}</span>
              <span className="font-semibold tabular-nums">{tenge(l.sum)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">{t.order.priceNote}</p>
        <dl className="mt-3 grid gap-2 border-t border-line pt-3 text-sm">
          <div className="flex justify-between gap-4"><dt>{t.order.total}</dt><dd className="font-semibold tabular-nums">{tenge(order.total)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.order.paid}</dt><dd className="tabular-nums">{tenge(order.paid)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.order.prepay(order.prepaymentPct)}</dt><dd className="tabular-nums">{tenge(order.prepaymentDue)}</dd></div>
          <div className="flex justify-between gap-4"><dt>{t.order.rest}</dt><dd className="tabular-nums">{tenge(order.total - order.prepaymentDue)}</dd></div>
        </dl>
      </section>

      <section className={`mt-6 grid gap-4 sm:grid-cols-2 ${box}`}>
        <div>
          <h2 className="text-lg">{t.order.pickupTitle}</h2>
          <p className="mt-2 text-sm">{t.dayMonth(order.pickup.date)}, {order.pickup.slot}</p>
          <p className="mt-1 text-sm">{order.pickup.method === "self" ? t.calc.self : t.calc.truck}</p>
          {order.pickup.storage && <p className="mt-1 text-sm">{t.order.storage}</p>}
          <p className="mt-1 text-sm"><Ph>{t.ph.address}</Ph></p>
        </div>
        <Photo label={t.photos.map} ratio="3/2" />
      </section>

      <section className={`mt-6 ${box}`}>
        <h2 className="text-lg">{t.order.docsTitle}</h2>
        <ul className="mt-2 grid gap-1 text-sm">
          <li>{t.order.docInvoice}</li>
          <li>{t.order.docContract}: <Ph>{t.ph.contract}</Ph></li>
        </ul>
      </section>

      <section className={`mt-6 ${box}`}>
        <h2 className="text-lg">{t.order.historyTitle}</h2>
        <ol className="mt-2 grid gap-2 text-sm">
          {order.events.map((e) => (
            <li key={e.at + e.type} className="flex justify-between gap-4">
              <span>{eventLabel(e.type)}</span>
              <time dateTime={e.at} className="text-muted">{when(e.at)}</time>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={waLink(t.wa.order(order.orderNumber))}>
          <Icon name="chat" /> {t.order.write}
        </ButtonLink>
        <ShareButton label={t.order.share} copied={t.order.copied} title={t.meta.order(order.orderNumber)} />
      </div>
    </>
  );
}
