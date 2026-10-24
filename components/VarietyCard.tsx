import Image from "next/image";
import Link from "next/link";
import { SHADE_HEX } from "@/content/colors";
import { VARIETY_PHOTOS } from "@/content/variety-photos";
import { groupOf, type Variety } from "@/content/varieties";
import { getDict } from "@/lib/dict";
import type { StockStatus } from "@/lib/season";
import { Photo } from "./Photo";
import { PickStepper } from "./Picks";
import { ColorDot, StockBadge } from "./ui";

// max: packs left for this variety's color × type (shared by every variety of that color).
// Links go to the variety's page; the catalog catches a plain click and opens the variety in a window instead
type Props = { v: Variety; status: StockStatus; max: number };

export async function VarietyCard({ v, status, max }: Props) {
  const { t, href } = await getDict();
  const page = href(`/tulpan/sorta/${v.slug}`);
  const [photo] = VARIETY_PHOTOS[v.slug] ?? [];
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <Link href={page} tabIndex={-1} aria-hidden="true">
        <Photo
          label={photo ? v.name : t.photos.varietyCard}
          src={photo}
          ratio="1/1"
          swatch={SHADE_HEX[v.shades[0]]}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="rounded-none!"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg leading-snug">
          <Link href={page} className="hover:text-accent">
            {v.name}
          </Link>
        </h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {[t.colors[v.shades[0]], v.shades.length > 1 ? t.sorta.ui.twoTone : undefined, t.types[v.type], v.height && t.variety.stemValue(v.height)].filter(Boolean).map((tag) => (
            <li key={tag} className="rounded-md bg-surface px-2 py-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <StockBadge status={status} t={t.stock} />
        </div>
        {status !== "none" && (
          <div className="mt-auto pt-4">
            <PickStepper slug={v.slug} group={groupOf(v)} max={max} label={v.name} t={t.calc} />
          </div>
        )}
      </div>
    </article>
  );
}

// One line of the catalog's list view; on a phone the stock and the stepper wrap to a second line
export async function VarietyRow({ v, status, max }: Props) {
  const { t, href } = await getDict();
  const page = href(`/tulpan/sorta/${v.slug}`);
  const [photo] = VARIETY_PHOTOS[v.slug] ?? [];
  return (
    <article className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
      <Link href={page} tabIndex={-1} aria-hidden="true" className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-mint">
        {photo ? <Image src={photo} alt="" fill sizes="56px" className="object-cover" /> : <ColorDot hex={SHADE_HEX[v.shades[0]]} className="size-6" />}
      </Link>
      <div className="min-w-0 flex-1 basis-40">
        <h3 className="text-base leading-snug">
          <Link href={page} className="hover:text-accent">
            {v.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          {t.colors[v.shades[0]]} · {t.types[v.type].toLocaleLowerCase(t.locale)}
          {v.height && (
            <>
              {" · "}
              <span className="whitespace-nowrap">{t.variety.stemValue(v.height)}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
        <StockBadge status={status} t={t.stock} />
        {status !== "none" && (
          <div className="w-34">
            <PickStepper slug={v.slug} group={groupOf(v)} max={max} label={v.name} t={t.calc} />
          </div>
        )}
      </div>
    </article>
  );
}
