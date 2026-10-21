import type { TulipType } from "../content/colors";
import config from "./mock-season.json";
import { almatyDay, PREPAYMENTS } from "./pricing";
import type { PriceRow, SeasonCurrent, SeasonSource, StockItem } from "./season";

// Mock of the CRM: price = period base + prepayment surcharge. Real grid replaces mock-season.json, not the UI.
const TYPES: TulipType[] = ["classic", "double"];
const { periods, surcharge } = config;

const dayAfter = (iso: string) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

export function buildMockSeason(now: Date): SeasonCurrent {
  const day = almatyDay(now);
  const priceGrid: PriceRow[] = periods.flatMap((p) =>
    TYPES.flatMap((type) =>
      PREPAYMENTS.map((pct) => ({
        periodEnd: p.end,
        prepaymentPct: pct,
        type,
        pricePerStem: p[type] + surcharge[`${pct}`],
      })),
    ),
  );

  const open = periods.findIndex((p) => day <= p.end);
  const cur = open === -1 ? periods.length - 1 : open;
  const next = open === -1 ? undefined : periods[cur + 1];
  const price = (type: TulipType) => ({
    today: periods[cur][type] + surcharge["100"],
    next: next ? { from: dayAfter(periods[cur].end), price: next[type] + surcharge["100"] } : null,
  });

  return {
    season: { ...config.season, saleOpen: open !== -1 },
    asOf: now.toISOString(),
    prices: { classic: price("classic"), double: price("double") },
    priceGrid,
    stock: config.stock as StockItem[],
  };
}

export const mockSeasonSource: SeasonSource = {
  current: async () => buildMockSeason(new Date()),
};
