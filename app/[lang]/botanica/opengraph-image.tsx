import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Guldala Botanica";
export const size = ogSize;
export const contentType = "image/png";

// The Botanica share card: no tulips
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  return ogCard("Guldala Botanica", t.botanica.h1);
}
