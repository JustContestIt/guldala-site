import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { ogCard, ogSize, ogType } from "@/lib/og";

export const alt = "Guldala Botanica";
export const size = ogSize;
export const contentType = ogType;

// The Botanica share card: no tulips, and no photos of its own yet
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  return ogCard("Алматы", t.botanica.h1, [], "Guldala Botanica"); // the same word in both languages
}
