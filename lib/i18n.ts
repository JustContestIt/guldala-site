// Client-safe language helpers. Russian lives at the root (/tulpan), Kazakh under /kz (/kz/tulpan).
export const LANGS = ["ru", "kz"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);

export const localHref = (lang: Lang, path: string) =>
  lang === "kz" ? `/kz${path === "/" ? "" : path}` : path;

// "{n} шт" → "120 шт"; for strings handed to client components, which can't receive functions
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
