import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COLOR_HEX, COLOR_IDS } from "@/content/colors";
import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";

export const alt = "Guldala";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Text-only card until real photos exist; Golos covers Latin, Russian and Kazakh letters (Manrope has no ә ғ қ ң ұ)
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const t = (await params).lang === "kz" ? kz : ru;
  // one family name per subset: satori keeps only the first file of a repeated name
  const subsets = ["latin", "cyrillic", "cyrillic-ext"];
  const fonts = await Promise.all(
    subsets.map(async (s) => ({ name: `Golos-${s}`, data: await readFile(join(process.cwd(), `assets/golos-800-${s}.woff`)), weight: 800 as const, style: "normal" as const })),
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#15231B", color: "#FFFFFF", fontFamily: subsets.map((s) => `Golos-${s}`).join(", ") }}>
        <div style={{ display: "flex", fontSize: 44, color: "#9FD0B5" }}>Guldala</div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.1, maxWidth: 960 }}>{t.tulpan.h1}</div>
        <div style={{ display: "flex", gap: 18 }}>
          {COLOR_IDS.map((c) => (
            <div key={c} style={{ width: 56, height: 56, borderRadius: 28, background: COLOR_HEX[c] }} />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
