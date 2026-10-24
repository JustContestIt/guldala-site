// Kazakhstan numbers only: +7 / 8 / 7 followed by 10 digits → "+77771006667"; null otherwise
export function normalizePhone(s: string): string | null {
  const m = /^(?:\+?7|8)(\d{10})$/.exec(s.replace(/[\s()-]/g, ""));
  return m ? `+7${m[1]}` : null;
}

// What the phone field shows while it's typed or pasted: "+7 777 100 66 67" as far as the digits go.
// The 10 local digits follow +7, or 8 / 7 in an 11-digit paste, or come alone
export function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+7") || (d.length > 10 && /^[78]/.test(d))) d = d.slice(1);
  d = d.slice(0, 10);
  return d ? ["+7", d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(" ") : "";
}

export const isBin = (s: string) => /^\d{12}$/.test(s);

// Free text from forms: trimmed and capped so a bot can't post a novel into Telegram
export const text = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);
