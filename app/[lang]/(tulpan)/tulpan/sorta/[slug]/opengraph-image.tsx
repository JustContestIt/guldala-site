import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { VARIETY_PHOTOS } from "@/content/variety-photos";
import { VARIETIES } from "@/content/varieties";
import { ogCard, ogSize, ogType, varietyPhoto } from "@/lib/og";

export const alt = "Guldala";
export const size = ogSize;
export const contentType = ogType;

// A variety: its own close-up; without photos (Cheers) our packs
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const t = lang === "kz" ? kz : ru;
  const v = VARIETIES.find((x) => x.slug === slug);
  if (!v) return ogCard(t.home.eyebrow, t.home.h1, ["assets/packs.jpg"]);
  return ogCard(t.product(v.color, v.type), v.name, [VARIETY_PHOTOS[v.slug] ? varietyPhoto(v.slug) : "assets/packs.jpg"]);
}
