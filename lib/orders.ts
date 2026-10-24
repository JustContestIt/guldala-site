import { crmGet } from "./crm";
import type { QuoteLine } from "./order";
import type { PrepaymentPct } from "./season";

export type OrderStatus = "new" | "confirmed" | "prepaid" | "ready" | "issued" | "expired" | "cancelled";

// Response of GET /public/orders/{token} (docs/crm-contract.md)
export type PublicOrder = {
  orderNumber: string;
  status: OrderStatus;
  holdUntil: string | null;
  prepaymentPct: PrepaymentPct;
  items: QuoteLine[];
  storageFee: number; // the fridge until pickup, already in total
  storageDays: number;
  total: number;
  paid: number;
  prepaymentDue: number;
  invoice: { provider: "kaspi"; amount: number; expiresAt: string | null } | null;
  pickup: { date: string; slot: string; method: "self" | "client_truck"; storage: boolean };
  events: { at: string; type: string }[]; // created / confirmed / invoice / paid / an order status
  asOf: string;
};

const TOKEN = /^[0-9a-f-]{36}$/i;
export const isToken = (s: string) => TOKEN.test(s);

// Always fresh: the client opens this page to see what changed
export const getOrder = (token: string) => (TOKEN.test(token) ? crmGet<PublicOrder>(`/orders/${token}`) : Promise.resolve(null));

// ?c=TOKEN from a WhatsApp link: the client's contacts for the order form; null = unknown or older than 30 days
export const getPrefill = (token: string) =>
  TOKEN.test(token) ? crmGet<{ client: { name: string; company: string; phone: string } }>(`/prefill/${token}`) : Promise.resolve(null);
