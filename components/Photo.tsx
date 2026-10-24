import Image, { type StaticImageData } from "next/image";
import { getDict } from "@/lib/dict";

// Photo slot: a real photo when `src` is given, otherwise a placeholder; every label is listed in content/PHOTO-BRIEF.md.
// With a photo the label is its alt text
export async function Photo({
  label,
  src,
  sizes = "100vw",
  priority,
  ratio,
  swatch,
  dark,
  className = "",
}: {
  label: string;
  src?: StaticImageData;
  sizes?: string; // how wide the photo is drawn, so the browser picks a sharp enough file
  priority?: boolean; // the first screen's photo: loaded at once
  ratio?: "4/5" | "3/2" | "1/1";
  swatch?: string;
  dark?: boolean;
  className?: string;
}) {
  const { t } = await getDict();
  const style = ratio ? { aspectRatio: ratio } : undefined;
  if (src)
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-mint ${className}`} style={style}>
        <Image src={src} alt={label} fill priority={priority} sizes={sizes} placeholder="blur" className="object-cover" />
        {/* watermark over the whole photo: a right-click or long-press hits it, not the image, so no casual "save image"; top-right since hero cards cover the bottom */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-start justify-end p-3 text-sm font-semibold text-white/75 select-none [text-shadow:0_1px_4px_rgb(0_0_0/0.6)] sm:p-4"
        >
          guldala.tulpan
        </span>
      </div>
    );
  return (
    <div
      role="img"
      aria-label={`${t.photo.aria}: ${label}`}
      className={`relative overflow-hidden rounded-2xl ${dark ? "bg-night-soft" : "bg-mint"} ${className}`}
      style={style}
    >
      {swatch && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10"
          style={{ background: swatch }}
        />
      )}
      <span
        aria-hidden="true"
        className={`absolute left-3 top-3 max-w-[85%] rounded-lg px-2 py-1 text-xs ${dark ? "bg-night/80 text-night-text" : "bg-white/85 text-muted"}`}
      >
        [{t.photo.tag}: {label}]
      </span>
    </div>
  );
}
