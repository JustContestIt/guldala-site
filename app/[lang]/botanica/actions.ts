"use server";

import type { Segment } from "@/content/botanica";
import { ru } from "@/content/dict/ru";
import { notifyTatiana } from "@/lib/notify";
import { normalizePhone, text } from "@/lib/validate";

export type LeadError = "phone" | "company" | "message" | "send";
export type LeadState = { ok: boolean; errors: LeadError[] } | null;

const SEGMENTS: Exclude<Segment, "designer">[] = ["private", "office", "horeca"];

// POST /public/leads and /public/designer-price in the CRM contract; until then — a Telegram message
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

  const msg = designer
    ? `Botanica: запрос прайса для дизайнера\n${company}, ${phone}`
    : `Botanica: заявка — ${ru.botanica.objectTypes[segment]}\n${[company, phone].filter(Boolean).join(", ")}\n${message}`;
  if (!(await notifyTatiana(msg))) return { ok: false, errors: ["send"] };
  return { ok: true, errors: [] };
}
