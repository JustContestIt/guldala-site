// Kazakhstan numbers only: +7 / 8 / 7 followed by 10 digits → "+77771006667"; null otherwise
export function normalizePhone(s: string): string | null {
  const m = /^(?:\+?7|8)(\d{10})$/.exec(s.replace(/[\s()-]/g, ""));
  return m ? `+7${m[1]}` : null;
}

export const isBin = (s: string) => /^\d{12}$/.test(s);

// Free text from forms: trimmed and capped so a bot can't post a novel into Telegram
export const text = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);
