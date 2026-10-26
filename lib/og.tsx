import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const ogSize = { width: 1200, height: 630 };
export const ogType = "image/jpeg";

// The first photo of a variety on disk (assets/varieties/<slug>_N.jpg, see content/variety-photos.ts)
export const varietyPhoto = (slug: string) => `assets/varieties/${slug}_1.jpg`;

const PHOTO_W = 600;
// not traced: a dynamic path would pull the whole project into the standalone build; the Dockerfile copies assets/ itself
const fromRoot = (path: string) => join(/* turbopackIgnore: true */ process.cwd(), path);

// Link preview: the text on the brand green at left, our photos at right (four make a 2×2 grid), no photos = text only.
// Sent as JPEG: WhatsApp drops previews heavier than ~300 KB and a PNG with a photo is ~1 MB.
// Golos covers Latin, Russian and Kazakh letters (Manrope has no ә ғ қ ң ұ)
export async function ogCard(eyebrow: string, title: string, photos: string[] = [], brand = "Guldala") {
  // one family name per subset: satori keeps only the first file of a repeated name
  const subsets = ["latin", "cyrillic", "cyrillic-ext"];
  const fonts = await Promise.all(
    subsets.map(async (s) => ({ name: `Golos-${s}`, data: await readFile(fromRoot(`assets/golos-800-${s}.woff`)), weight: 800 as const, style: "normal" as const })),
  );
  const [w, h] = photos.length > 1 ? [PHOTO_W / 2, ogSize.height / 2] : [PHOTO_W, ogSize.height];
  const images = await Promise.all(
    photos.map(async (p) => `data:image/jpeg;base64,${(await sharp(fromRoot(p)).resize(w, h).jpeg({ quality: 90 }).toBuffer()).toString("base64")}`),
  );
  const png = await new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#15231B", color: "#FFFFFF", fontFamily: subsets.map((s) => `Golos-${s}`).join(", ") }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "64px 56px 72px 64px" }}>
          <div style={{ display: "flex", fontSize: 36, letterSpacing: -0.5 }}>{brand}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 28, color: "#9FD0B5" }}>{eyebrow}</div>
            <div style={{ display: "flex", marginTop: 18, fontSize: images.length ? 58 : 72, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
          </div>
        </div>
        {images.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", width: PHOTO_W, height: ogSize.height }}>
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- satori draws plain <img>
              <img key={i} src={src} width={w} height={h} alt="" />
            ))}
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts },
  ).arrayBuffer();
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": ogType } });
}
