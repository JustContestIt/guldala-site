import type { TulipType } from "../content/colors";
import type { PrepayDiscount, PrepaymentPct, PriceRow } from "./season";

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

// The CRM's rule (crm lib/calc.ts prepayDiscountPct): only 100 %, only at least minDays from the order day to pickup,
// and the same rounding per stem, so the site's total is the CRM's (review 12.11.2026, Ц2)
export function prepayDiscount(d: PrepayDiscount | undefined, pct: number, day: string, pickupDate: string | null): number {
  if (!d || d.pct <= 0 || pct !== 100 || !pickupDate) return 0;
  return Math.round((Date.parse(pickupDate) - Date.parse(day)) / 86_400_000) >= d.minDays ? d.pct : 0;
}
export const discounted = (price: number, offPct: number) => Math.round((price * (100 - offPct)) / 100);
