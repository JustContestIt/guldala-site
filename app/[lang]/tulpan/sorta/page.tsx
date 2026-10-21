import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ColorDot, Ph } from "@/components/ui";
import { VarietyCard } from "@/components/VarietyCard";
import { COLOR_HEX, COLOR_IDS, TULIP_TYPES, type ColorId, type TulipType } from "@/content/colors";
import { VARIETIES } from "@/content/varieties";
import { getDict, pageMeta } from "@/lib/dict";
import { getSeason } from "@/lib/season";

type Filters = { color?: ColorId; type?: TulipType; stock?: "1" };

export async function generateMetadata() {
  const { t } = await getDict();
  return pageMeta("/tulpan/sorta", t.meta.sorta.title, t.meta.sorta.description);
}

export default async function SortaPage({ searchParams }: PageProps<"/[lang]/tulpan/sorta">) {
  const { t } = await getDict();
  return (
    <div className="shell py-10 md:py-14">
      <h1 className="text-3xl sm:text-4xl">{t.sorta.h1}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {t.sorta.lead} <Ph>{t.ph.varieties}</Ph>
      </p>
      <Suspense fallback={<p className="py-20 text-muted">{t.sorta.loading}</p>}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: PageProps<"/[lang]/tulpan/sorta">["searchParams"] }) {
  const { t, href: local } = await getDict();
  const sp = await searchParams;
  // Query string is user input: keep only known values
  const f: Filters = {
    color: COLOR_IDS.find((c) => c === sp.color),
    type: TULIP_TYPES.find((x) => x === sp.type),
    stock: sp.stock === "1" ? "1" : undefined,
  };
  const { stock } = await getSeason();
  const statusOf = (color: ColorId, type: TulipType) =>
    stock.find((s) => s.color === color && s.type === type)?.status ?? "none";

  const items = VARIETIES.filter(
    (v) =>
      (!f.color || v.color === f.color) &&
      (!f.type || v.type === f.type) &&
      (!f.stock || statusOf(v.color, v.type) !== "none"),
  );

  const base = local("/tulpan/sorta");
  const href = (patch: Filters) => {
    const q = new URLSearchParams(Object.entries({ ...f, ...patch }).filter(([, v]) => v) as [string, string][]);
    return q.size ? `${base}?${q}` : base;
  };

  return (
    <>
      <div className="mt-8 grid gap-4 border-y border-line py-5">
        <ChipRow label={t.sorta.color}>
          <Chip href={href({ color: undefined })} active={!f.color}>{t.sorta.all}</Chip>
          {COLOR_IDS.map((c) => (
            <Chip key={c} href={href({ color: c })} active={f.color === c}>
              <ColorDot hex={COLOR_HEX[c]} /> {t.colors[c]}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label={t.sorta.type}>
          <Chip href={href({ type: undefined })} active={!f.type}>{t.sorta.all}</Chip>
          {TULIP_TYPES.map((x) => (
            <Chip key={x} href={href({ type: x })} active={f.type === x}>{t.types[x]}</Chip>
          ))}
          <Chip href={href({ stock: f.stock ? undefined : "1" })} active={!!f.stock}>{t.sorta.inStock}</Chip>
        </ChipRow>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {t.sorta.count(items.length)}
        {(f.color || f.type || f.stock) && (
          <>
            {" · "}
            <Link href={base} scroll={false} className="text-accent underline underline-offset-2">
              {t.sorta.reset}
            </Link>
          </>
        )}
      </p>

      {items.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((v) => (
            <li key={v.slug}>
              <VarietyCard v={v} status={statusOf(v.color, v.type)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-2xl bg-surface p-8 text-center text-muted">{t.sorta.empty}</p>
      )}
    </>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-14 shrink-0 text-sm text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm ${
        active ? "border-accent bg-accent text-white" : "border-line bg-white hover:bg-mint"
      }`}
    >
      {children}
    </Link>
  );
}
