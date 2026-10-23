import Link from "next/link";
import { COLOR_HEX } from "@/content/colors";
import { groupOf, type Variety } from "@/content/varieties";
import { getDict } from "@/lib/dict";
import type { StockStatus } from "@/lib/season";
import { Photo } from "./Photo";
import { PickStepper } from "./Picks";
import { ColorDot, StockBadge } from "./ui";

// max: packs left for this variety's color × type (shared by every variety of that color)
export async function VarietyCard({ v, status, max }: { v: Variety; status: StockStatus; max: number }) {
  const { t, href, lang } = await getDict();
  const page = href(`/tulpan/sorta/${v.slug}`);
  return (
    <article className="flex flex-col">
      <Link href={page} tabIndex={-1} aria-hidden="true">
        <Photo label={t.photos.varietyCard} ratio="4/5" swatch={COLOR_HEX[v.color]} />
      </Link>
      <h3 className="mt-3 text-base">
        <Link href={page} className="hover:text-accent">
          {v.name}
        </Link>
      </h3>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted">
        <ColorDot hex={COLOR_HEX[v.color]} />
        {t.colors[v.color]} · {t.types[v.type].toLocaleLowerCase(t.locale)}
      </p>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{v.description[lang]}</p>
      <div className="mt-2">
        <StockBadge status={status} t={t.stock} />
      </div>
      {status !== "none" && (
        <div className="mt-3">
          <PickStepper slug={v.slug} group={groupOf(v)} max={max} label={v.name} t={t.calc} />
        </div>
      )}
    </article>
  );
}
