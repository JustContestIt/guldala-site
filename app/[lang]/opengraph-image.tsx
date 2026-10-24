import { COLOR_HEX, COLOR_IDS } from "@/content/colors";
import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Guldala";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  return ogCard("Guldala", t.home.h1, COLOR_IDS.map((c) => COLOR_HEX[c]));
}
