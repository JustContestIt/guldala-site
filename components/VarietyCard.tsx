import Link from "next/link";
import { COLOR_HEX } from "@/content/colors";
import type { Variety } from "@/content/varieties";
import { getDict } from "@/lib/dict";
import type { StockStatus } from "@/lib/season";
import { Photo } from "./Photo";
import { ColorDot, StockBadge } from "./ui";

export async function VarietyCard({ v, status }: { v: Variety; status: StockStatus }) {
  const { t, href } = await getDict();
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
      <div className="mt-2">
        <StockBadge status={status} t={t.stock} />
      </div>
      {status !== "none" && (
        <Link
          href={href(`/tulpan/zakaz?product=${v.color}-${v.type}`)}
          className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-3 text-center text-sm font-semibold hover:bg-mint"
        >
          {t.variety.order(t.product(v.color, v.type))}
        </Link>
      )}
    </article>
  );
}
