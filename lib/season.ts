import { cacheLife } from "next/cache";
import type { ColorId, TulipType } from "../content/colors";
import { mockSeasonSource } from "./mock-season";

export type PrepaymentPct = 40 | 60 | 80 | 100;
export type StockStatus = "many" | "few" | "none";

export type PriceRow = {
  periodEnd: string;
  prepaymentPct: PrepaymentPct;
  type: TulipType;
  pricePerStem: number;
};

export type StockItem = {
  productId: string;
  color: ColorId;
  type: TulipType;
  status: StockStatus;
  maxPacks?: number; // only for the calculator stepper, never shown publicly
};

// Response of GET /public/season/current from the CRM contract (site brief §9)
export type SeasonCurrent = {
  season: {
    id: string;
    name: string;
    saleOpen: boolean;
    peakDate: string;
    // not in the brief's contract yet; the CRM has them in seasons / settings
    pickupFrom: string;
    pickupTo: string;
    peakHoursFrom: string;
  };
  asOf: string;
  prices: Record<TulipType, { today: number; next: { from: string; price: number } | null }>;
  priceGrid: PriceRow[];
  stock: StockItem[];
};

export interface SeasonSource {
  current(): Promise<SeasonCurrent>;
}

// Swap for an API-backed source once the CRM serves /public/season/current
const source: SeasonSource = mockSeasonSource;

export async function getSeason(): Promise<SeasonCurrent> {
  "use cache";
  cacheLife("hours");
  return source.current();
}
