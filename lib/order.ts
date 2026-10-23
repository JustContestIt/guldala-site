import type { ColorId, TulipType } from "../content/colors";
import { pricePerStem } from "./pricing";
import type { PrepaymentPct, SeasonCurrent } from "./season";

export const PACK_SIZE = 30;
export const MIN_STEMS = 120; // in total across colors (CRM assumption min_order_scope = total)

export type OrderLine = { productId: string; packs: number };
export type QuoteLine = OrderLine & { color: ColorId; type: TulipType; stems: number; pricePerStem: number; sum: number };

export type Quote = {
  lines: QuoteLine[];
  stems: number;
  total: number;
  prepayment: number;
  remainder: number;
  missingStems: number;
  overStock: string[];
  unknown: string[];
  closed: boolean;
};

export const prepaymentAmount = (total: number, pct: number) => Math.ceil((total * pct) / 100);

export function quote(
  season: Pick<SeasonCurrent, "priceGrid" | "stock">,
  order: OrderLine[],
  pct: PrepaymentPct,
  day: string,
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
  const total = lines.reduce((a, l) => a + l.sum, 0);
  const prepayment = prepaymentAmount(total, pct);
  return {
    lines,
    stems,
    total,
    prepayment,
    remainder: total - prepayment,
    missingStems: Math.max(0, MIN_STEMS - stems),
    overStock,
    unknown,
    closed,
  };
}

// "<productId>:4,<productId>:2" — the order as it travels in a form field or URL; null if malformed
export function parseItems(s: string): OrderLine[] | null {
  if (!s) return [];
  const out: OrderLine[] = [];
  for (const part of s.split(",")) {
    const m = /^([0-9a-f-]{36}):(\d{1,3})$/i.exec(part);
    if (!m) return null;
    out.push({ productId: m[1], packs: Number(m[2]) });
  }
  return out;
}

export const serializeItems = (lines: OrderLine[]) => lines.map((l) => `${l.productId}:${l.packs}`).join(",");

const SLOTS = ["08:00–12:00", "12:00–15:00", "15:00–18:00"];
const PEAK_SLOTS = [...SLOTS, "18:00–21:00", "21:00–23:00"];

// Pickup hours: 8:00–18:00, from peakHoursFrom until 8 March — till 23:00
export function slotsFor(season: SeasonCurrent["season"], date: string): string[] {
  if (!date || date < season.pickupFrom || date > season.pickupTo) return [];
  return season.peakHoursFrom && date >= season.peakHoursFrom ? PEAK_SLOTS : SLOTS;
}
