// A season in the CRM's shape for the unit tests: price = period base + prepayment surcharge
import type { SeasonCurrent } from "./season";

export const ID = {
  red: "11111111-1111-4111-8111-111111111111",
  white: "22222222-2222-4222-8222-222222222222",
  pink: "33333333-3333-4333-8333-333333333333",
  orange: "44444444-4444-4444-8444-444444444444",
  whiteDouble: "55555555-5555-4555-8555-555555555555",
};

const periods = [
  { end: "2026-11-30", classic: 90, double: 120 },
  { end: "2027-01-15", classic: 100, double: 130 },
  { end: "2027-02-15", classic: 115, double: 145 },
  { end: "2027-03-07", classic: 135, double: 165 },
];
const surcharge = { 40: 15, 60: 10, 80: 5, 100: 0 } as const;

export const season: SeasonCurrent = {
  season: { id: "2027", name: "Сезон 8 марта 2027", saleOpen: true, peakDate: "2027-03-08", pickupFrom: "2027-03-01", pickupTo: "2027-03-08", peakHoursFrom: "2027-03-05", storageFeePerDay: 1000 },
  asOf: "2026-10-21T07:00:00.000Z",
  prices: { classic: { today: 90, next: { from: "2026-12-01", price: 100 } }, double: { today: 120, next: { from: "2026-12-01", price: 130 } } },
  priceGrid: periods.flatMap((p) =>
    (["classic", "double"] as const).flatMap((type) =>
      ([40, 60, 80, 100] as const).map((pct) => ({ periodEnd: p.end, prepaymentPct: pct, type, pricePerStem: p[type] + surcharge[pct] })),
    ),
  ),
  stock: [
    { productId: ID.red, color: "red", type: "classic", status: "many", maxPacks: 100 },
    { productId: ID.white, color: "white", type: "classic", status: "many", maxPacks: 100 },
    { productId: ID.pink, color: "pink", type: "classic", status: "few", maxPacks: 8 },
    { productId: ID.orange, color: "orange", type: "classic", status: "none", maxPacks: 0 },
    { productId: ID.whiteDouble, color: "white", type: "double", status: "many", maxPacks: 30 },
  ],
};
