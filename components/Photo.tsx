import { getDict } from "@/lib/dict";

// Photo slot until real photos arrive; every label is listed in content/PHOTO-BRIEF.md
export async function Photo({
  label,
  ratio,
  swatch,
  dark,
  className = "",
}: {
  label: string;
  ratio?: "4/5" | "3/2" | "1/1";
  swatch?: string;
  dark?: boolean;
  className?: string;
}) {
  const { t } = await getDict();
  return (
    <div
      role="img"
      aria-label={`${t.photo.aria}: ${label}`}
      className={`relative overflow-hidden rounded-2xl ${dark ? "bg-night-soft" : "bg-mint"} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
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
