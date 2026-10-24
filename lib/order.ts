import type { ColorId, TulipType } from "../content/colors";
import { pricePerStem } from "./pricing";
import type { PrepaymentPct, SeasonCurrent, StockItem } from "./season";

export const PACK_SIZE = 30;
export const MIN_STEMS = 120; // in total across colors (CRM assumption min_order_scope = total)

export type OrderLine = { productId: string; packs: number };
export type QuoteLine = OrderLine & { color: ColorId; type: TulipType; stems: number; pricePerStem: number; sum: number };

export type Quote = {
  lines: QuoteLine[];
  stems: number;
  fee: number; // the fridge, in total
  total: number;
  prepayment: number;
  remainder: number;
  missingStems: number;
  overStock: string[];
  unknown: string[];
  closed: boolean;
};

export const prepaymentAmount = (total: number, pct: number) => Math.ceil((total * pct) / 100);

// The fridge until pickup is paid by the day from the order day, as the CRM counts it (crm/lib/calc.ts)
export const storageDays = (day: string, pickupDate: string) =>
  pickupDate ? Math.max(0, Math.round((Date.parse(pickupDate) - Date.parse(day)) / 86_400_000)) : 0;

export function quote(
  season: Pick<SeasonCurrent, "priceGrid" | "stock">,
  order: OrderLine[],
  pct: PrepaymentPct,
  day: string,
  fee = 0,
): Quote {
  const lines: QuoteLine[] = [];
  const overStock: string[] = [];
  const unknown: string[] = [];
  let closed = false;

  for (const { productId, packs } of order) {
    if (packs <= 0) continue;
    const s = season.stock.find((x) => x.productId === productId);
    if (!s) {
      unknown.push(productId);
      continue;
    }
    if (s.status === "none" || (s.maxPacks !== undefined && packs > s.maxPacks)) overStock.push(productId);
    const price = pricePerStem(season.priceGrid, s.type, pct, day);
    if (price === null) {
      closed = true;
      continue;
    }
    const stems = packs * PACK_SIZE;
    lines.push({ productId, packs, color: s.color, type: s.type, stems, pricePerStem: price, sum: stems * price });
  }

  const stems = lines.reduce((a, l) => a + l.stems, 0);
  const total = lines.reduce((a, l) => a + l.sum, 0) + fee;
  const prepayment = prepaymentAmount(total, pct);
  return {
    lines,
    stems,
    fee,
    total,
    prepayment,
    remainder: total - prepayment,
    missingStems: Math.max(0, MIN_STEMS - stems),
    overStock,
    unknown,
    closed,
  };
}

// The catalog order: variety slug → packs. The CRM sells color × type, so varieties of one color add up to one line;
// the variety names reach Tatiana in the order comment as wishes (spec §14).
export type Picks = Record<string, number>;
type VarietyRef = { slug: string; name: string; color: ColorId; type: TulipType };

export function linesFromPicks(picks: Picks, varieties: VarietyRef[], stock: Pick<StockItem, "productId" | "color" | "type">[]) {
  const packs = new Map<string, number>();
  const sorts: { name: string; packs: number }[] = [];
  for (const v of varieties) {
    const n = picks[v.slug];
    const s = n ? stock.find((x) => x.color === v.color && x.type === v.type) : undefined;
    if (!s) continue;
    packs.set(s.productId, (packs.get(s.productId) ?? 0) + n);
    sorts.push({ name: v.name, packs: n });
  }
  return { lines: [...packs].map(([productId, n]): OrderLine => ({ productId, packs: n })), sorts };
}

// "slug:3,slug:1" — picks as they travel in a form field; null if malformed
export function parsePicks(s: string): Picks | null {
  const out: Picks = {};
  if (!s) return out;
  for (const part of s.split(",")) {
    const m = /^([a-z0-9-]{1,60}):(\d{1,3})$/.exec(part);
    if (!m) return null;
    out[m[1]] = Number(m[2]);
  }
  return out;
}

export const serializePicks = (p: Picks) =>
  Object.entries(p)
    .filter(([, n]) => n > 0)
    .map(([slug, n]) => `${slug}:${n}`)
    .join(",");

const SLOTS = ["08:00–12:00", "12:00–15:00", "15:00–18:00"];
const PEAK_SLOTS = [...SLOTS, "18:00–21:00", "21:00–23:00"];

// Pickup hours: 8:00–18:00, from peakHoursFrom until 8 March — till 23:00
export function slotsFor(season: SeasonCurrent["season"], date: string): string[] {
  if (!date || date < season.pickupFrom || date > season.pickupTo) return [];
  return season.peakHoursFrom && date >= season.peakHoursFrom ? PEAK_SLOTS : SLOTS;
}
