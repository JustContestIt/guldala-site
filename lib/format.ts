// ru-RU groups digits with a no-break space; the ₸ sign is glued with one too: "28 800 ₸". Same output for kk.
export const tenge = (n: number) => `${new Intl.NumberFormat("ru-RU").format(n)} ₸`;

// "1 декабря" / "1 желтоқсан" — no year inside the season
export const dayMonth = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "Asia/Almaty" }).format(new Date(iso));

export const time = (iso: string) =>
  new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty" }).format(new Date(iso));
