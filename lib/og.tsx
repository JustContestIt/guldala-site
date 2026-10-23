import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Text-only share card until real photos exist; Golos covers Latin, Russian and Kazakh letters (Manrope has no ә ғ қ ң ұ)
export async function ogCard(eyebrow: string, title: string, dots: string[] = []) {
  // one family name per subset: satori keeps only the first file of a repeated name
  const subsets = ["latin", "cyrillic", "cyrillic-ext"];
  const fonts = await Promise.all(
    subsets.map(async (s) => ({ name: `Golos-${s}`, data: await readFile(join(process.cwd(), `assets/golos-800-${s}.woff`)), weight: 800 as const, style: "normal" as const })),
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#15231B", color: "#FFFFFF", fontFamily: subsets.map((s) => `Golos-${s}`).join(", ") }}>
        <div style={{ display: "flex", fontSize: 44, color: "#9FD0B5" }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.1, maxWidth: 960 }}>{title}</div>
        <div style={{ display: "flex", gap: 18 }}>
          {dots.map((c) => (
            <div key={c} style={{ width: 56, height: 56, borderRadius: 28, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
