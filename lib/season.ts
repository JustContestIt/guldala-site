import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import type { ColorId, TulipType } from "../content/colors";
import { crmGet } from "./crm";

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

// Response of GET /public/season/current (docs/crm-contract.md)
export type SeasonCurrent = {
  season: {
    id: string;
    name: string;
    saleOpen: boolean;
    peakDate: string;
    pickupFrom: string;
    pickupTo: string;
    peakHoursFrom: string; // "" = no evening hours in this season
    storageFeePerDay: number; // ₸ per order for each day in the fridge, from the order day to pickup
  };
  asOf: string;
  prices: Record<TulipType, { today: number; next: { from: string; price: number } | null }>;
  priceGrid: PriceRow[];
  stock: StockItem[];
};

// The CRM's answer, at most 60 s old (spec §14); submitOrder drops it with updateTag("season")
export async function cachedSeason(): Promise<SeasonCurrent> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30, expire: 60 });
  cacheTag("season");
  const s = await crmGet<SeasonCurrent>("/season/current");
  if (!s) throw new Error("CRM has no season");
  return s;
}

// For pages: never at build time (the CRM isn't reachable there), so callers sit inside <Suspense>
export async function getSeason(): Promise<SeasonCurrent> {
  await connection();
  return cachedSeason();
}
