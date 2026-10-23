"use server";

import { headers } from "next/headers";
import type { Segment } from "@/content/botanica";
import { crmPost } from "@/lib/crm";
import { normalizePhone, text } from "@/lib/validate";

export type LeadError = "phone" | "company" | "message" | "send";
export type LeadState = { ok: boolean; errors: LeadError[] } | null;

const SEGMENTS: Exclude<Segment, "designer">[] = ["private", "office", "horeca"];

// POST /public/leads and /public/designer-price (docs/crm-contract.md): the CRM keeps the lead as a client with a note
export async function submitLead(_: LeadState, fd: FormData): Promise<LeadState> {
  if (text(fd.get("website"))) return { ok: true, errors: [] }; // honeypot: let the bot think it worked
  const designer = fd.get("kind") === "designer";
  const phone = normalizePhone(text(fd.get("phone"), 30));
  const company = text(fd.get("company"));
  const message = text(fd.get("message"), 1000);
  const segment = SEGMENTS.find((s) => s === fd.get("segment")) ?? "private";

  const errors: LeadError[] = [];
  if (!phone) errors.push("phone");
  if (designer && !company) errors.push("company");
  if (!designer && !message) errors.push("message");
  if (errors.length) return { ok: false, errors };

  const ip = (await headers()).get("x-forwarded-for");
  const r = await (designer ? crmPost("/designer-price", { company, phone }, ip) : crmPost("/leads", { segment, phone, company, message }, ip)).catch(
    (e) => (console.error(`[guldala] CRM недоступна: ${e}`), null),
  );
  return r?.ok ? { ok: true, errors: [] } : { ok: false, errors: ["send"] };
}
