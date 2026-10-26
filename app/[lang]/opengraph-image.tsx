import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { ogCard, ogSize, ogType } from "@/lib/og";

export const alt = "Guldala";
export const size = ogSize;
export const contentType = ogType;

// Home, and every page without its own card
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  return ogCard(t.home.eyebrow, t.home.h1, ["assets/packs.jpg"]);
}
