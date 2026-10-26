import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { VARIETY_PHOTOS } from "@/content/variety-photos";
import { VARIETIES } from "@/content/varieties";
import { ogCard, ogSize, ogType, varietyPhoto } from "@/lib/og";

export const alt = "Guldala";
export const size = ogSize;
export const contentType = ogType;

// The catalog: one variety per color, the same picks as the home color tiles
const COLLAGE = (["red", "pink", "yellow", "purple"] as const).map((c) => VARIETIES.find((v) => v.shades[0] === c && VARIETY_PHOTOS[v.slug])!.slug);

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  return ogCard(t.sorta.count(VARIETIES.length), t.sorta.h1, COLLAGE.map(varietyPhoto));
}
