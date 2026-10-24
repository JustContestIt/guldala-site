import type { ReactNode } from "react";
import { SHADE_HEX } from "@/content/colors";
import { waLink } from "@/content/site";
import { groupOf, type Variety } from "@/content/varieties";
import { getDict } from "@/lib/dict";
import { tenge } from "@/lib/format";
import type { StockStatus } from "@/lib/season";
import { Icon } from "./icons";
import { PickStepper } from "./Picks";
import { ButtonLink, ColorDot, Ph, StockBadge } from "./ui";

// Everything under a variety's name: on its page and in the catalog's window. price: per stem today at 100 % prepayment
export async function VarietyInfo({ v, status, max, price }: { v: Variety; status: StockStatus; max: number; price: number }) {
  const { t, lang } = await getDict();
  const [shade] = v.shades;
  const rows: [string, ReactNode][] = [
    [t.variety.color, [t.colors[shade], v.shades.length > 1 && t.sorta.ui.twoTone.toLocaleLowerCase(t.locale)].filter(Boolean).join(", ")],
    [t.variety.type, t.types[v.type]],
    [t.variety.stem, v.height ? t.variety.stemValue(v.height) : <Ph>{t.ph.stem}</Ph>],
    [t.variety.vase, v.vaseLife ? t.variety.vaseValue(v.vaseLife) : <Ph>{t.ph.vase}</Ph>],
  ];
  return (
    <>
      <p className="mt-2 flex items-center gap-2 text-muted">
        <ColorDot hex={SHADE_HEX[shade]} className="size-4" /> {t.colors[shade]} · {t.types[v.type].toLocaleLowerCase(t.locale)}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StockBadge status={status} t={t.stock} />
        <span className="text-sm">{t.variety.priceToday(tenge(price))}</span>
      </div>

      <p className="mt-4">{v.description[lang]}</p>

      {status !== "none" && (
        <div className="mt-6 max-w-xs">
          <PickStepper slug={v.slug} group={groupOf(v)} max={max} label={v.name} t={t.calc} />
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
        <ButtonLink href={waLink(t.wa.variety(t.product(v.color, v.type)))} variant="secondary">
          <Icon name="chat" /> {t.variety.ask}
        </ButtonLink>
      </div>
    </>
  );
}
