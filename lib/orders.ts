import { cacheLife } from "next/cache";
import { quote, type QuoteLine } from "./order";
import { almatyDay } from "./pricing";
import { getSeason, type PrepaymentPct } from "./season";

export type OrderStatus = "new" | "confirmed" | "prepaid" | "ready" | "issued" | "expired" | "cancelled";

// Response of GET /public/orders/{token} (site brief §9), with prepaymentPct added for display
export type PublicOrder = {
  orderNumber: string;
  status: OrderStatus;
  holdUntil: string | null;
  prepaymentPct: PrepaymentPct;
  items: QuoteLine[];
  total: number;
  paid: number;
  prepaymentDue: number;
  invoice: { provider: "kaspi"; amount: number; expiresAt: string } | null;
  pickup: { date: string; slot: string; method: "self" | "client_truck"; storage: boolean };
  events: { at: string; type: "created" | "confirmed" | "invoice" }[];
  asOf: string;
};

const iso = (ms: number) => new Date(ms).toISOString();
const HOUR = 3_600_000;

export async function getOrder(token: string): Promise<PublicOrder | null> {
  "use cache";
  cacheLife("hours");
  // shortcut: a single demo order placed around "now"; the CRM will serve real orders by token
  if (token !== "demo") return null;
  const season = await getSeason();
  const now = Date.now();
  const q = quote(season, [{ productId: "red-classic", packs: 4 }, { productId: "white-double", packs: 2 }], 60, almatyDay(new Date(now)));
  return {
    orderNumber: "T-2027-0042",
    status: "confirmed",
    holdUntil: iso(now + 47 * HOUR),
    prepaymentPct: 60,
    items: q.lines,
    total: q.total,
    paid: 0,
    prepaymentDue: q.prepayment,
    invoice: { provider: "kaspi", amount: q.prepayment, expiresAt: iso(now + 23 * HOUR) },
    pickup: { date: "2027-03-07", slot: "08:00–12:00", method: "self", storage: true },
    events: [
      { at: iso(now - 26 * HOUR), type: "created" },
      { at: iso(now - 25 * HOUR), type: "confirmed" },
      { at: iso(now - HOUR), type: "invoice" },
    ],
    asOf: iso(now),
  };
}
