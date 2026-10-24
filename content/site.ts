// canonical, sitemap and OG links; set at build time (Docker build arg), the default is the future domain
export const SITE_URL = process.env.SITE_URL || "https://guldala.kz";
// Botanica is a separate landing on its own subdomain of the same site
export const BOTANICA_URL = SITE_URL.replace("://", "://botanica.");

export const CONTACTS = {
  phone: "+7 777 100 66 67",
  waPhone: "77771006667",
  instagramTulpan: "guldala.tulpan.kz",
  instagramBotanica: "guldala.botanica",
};

// The greenhouse, ул. Мамыр, 1, с. Бесагаш: 2GIS has the exact point
// shortcut: the Yandex map is centred on Besagash village (OpenStreetMap), without a pin — Yandex doesn't know the street;
// put the greenhouse's own coordinates in `ll` (2GIS → «Поделиться») and add `&pt=${ll},pm2rdm` to drop one
const ll = "77.0407,43.2990";
export const MAP = {
  gis: "https://2gis.kz/almaty/geo/70030077154741280",
  yandex: `https://yandex.kz/maps/?ll=${ll}&z=15`,
  embed: `https://yandex.kz/map-widget/v1/?ll=${ll}&z=14`,
};

export const waLink = (text: string) =>
  `https://wa.me/${CONTACTS.waPhone}?text=${encodeURIComponent(text)}`;

export const instagramUrl = (handle: string) => `https://instagram.com/${handle}`;
