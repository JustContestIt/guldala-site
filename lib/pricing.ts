import type { TulipType } from "../content/colors";
import type { PrepaymentPct, PriceRow } from "./season";

export const PREPAYMENTS: PrepaymentPct[] = [40, 60, 80, 100];

// Calendar day in Almaty as YYYY-MM-DD, so price periods switch at local midnight
export function almatyDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Almaty" }).format(d);
}

// Price per stem for an order placed on `day`; null once the last price period is over
export function pricePerStem(
  grid: PriceRow[],
  type: TulipType,
  pct: PrepaymentPct,
  day: string,
): number | null {
  const rows = grid.filter((r) => r.type === type && r.prepaymentPct === pct && day <= r.periodEnd);
  if (!rows.length) return null;
  return rows.reduce((a, b) => (a.periodEnd < b.periodEnd ? a : b)).pricePerStem;
}
