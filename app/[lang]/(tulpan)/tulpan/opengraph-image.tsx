import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { ogCard, ogSize, ogType } from "@/lib/og";

export const alt = "Guldala";
export const size = ogSize;
export const contentType = ogType;

// Prices (and the checkout under it)
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  return ogCard(t.home.eyebrow, t.tulpan.h1, ["assets/greenhouse-rows.jpg"]);
}
