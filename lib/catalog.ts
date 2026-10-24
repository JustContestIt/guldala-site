import { SHADES, TULIP_TYPES, type Shade, type TulipType } from "../content/colors";

// Catalog filters live in the address only: the browser reads them from it and writes changes back

export type View = "grid" | "list";
export type Filters = { q: string; colors: Shade[]; type?: TulipType; stock: boolean; tall: boolean; twoTone: boolean; view: View };
// What the filters look at; `text` is the name, color and type in the page language, lower case; `color` is the main shade
export type Facets = { text: string; color: Shade; type: TulipType; inStock: boolean; tall: boolean; twoTone: boolean };

// The query is user input: only known values pass. Colors come as ?color=red&color=pink (links also use ?color=red,pink)
export function readFilters(sp: URLSearchParams): Filters {
  const colors = sp.getAll("color").flatMap((s) => s.split(","));
  return {
    q: (sp.get("q") ?? "").slice(0, 60),
    colors: SHADES.filter((c) => colors.includes(c)),
    type: TULIP_TYPES.find((x) => x === sp.get("type")),
    stock: sp.get("stock") === "1",
    tall: sp.get("tall") === "1",
    twoTone: sp.get("two") === "1",
    view: sp.get("view") === "list" ? "list" : "grid",
  };
}

// The current query with the filters swapped in; other params stay (?c= from a WhatsApp link)
export function writeFilters(f: Filters, search: string) {
  const q = new URLSearchParams(search);
  for (const k of ["q", "color", "type", "stock", "tall", "two", "view"]) q.delete(k);
  if (f.q.trim()) q.set("q", f.q.trim());
  for (const c of f.colors) q.append("color", c);
  if (f.type) q.set("type", f.type);
  if (f.stock) q.set("stock", "1");
  if (f.tall) q.set("tall", "1");
  if (f.twoTone) q.set("two", "1");
  if (f.view === "list") q.set("view", "list");
  return q.size ? `?${q}` : "";
}

export const matches = (x: Facets, f: Filters) =>
  x.text.includes(f.q.trim().toLowerCase()) &&
  (!f.colors.length || f.colors.includes(x.color)) &&
  (!f.type || x.type === f.type) &&
  (!f.stock || x.inStock) &&
  (!f.tall || x.tall) &&
  (!f.twoTone || x.twoTone);

// The number on the «Фильтры» button
export const activeFilters = (f: Filters) =>
  (f.q.trim() ? 1 : 0) + f.colors.length + (f.type ? 1 : 0) + (f.stock ? 1 : 0) + (f.tall ? 1 : 0) + (f.twoTone ? 1 : 0);
