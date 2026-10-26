// canonical, sitemap and OG links; set at build time (Docker build arg), the default is the future domain
export const SITE_URL = process.env.SITE_URL || "https://guldala.kz";
// Botanica is a separate landing on its own subdomain of the same site
export const BOTANICA_URL = SITE_URL.replace("://", "://botanica.");

export const CONTACTS = {
  // shortcut: Nikita's WhatsApp (the bot's number) for the project presentation, 26.10.2026; Tatiana's +7 777 100 66 67 / 77771006667 goes back for real clients
  phone: "+7 775 111 44 47",
  waPhone: "77751114447",
  instagramTulpan: "guldala.tulpan.kz",
  instagramBotanica: "guldala.botanica",
};

// The greenhouse, ул. Мамыр, 1, с. Бесагаш: its point from 2GIS (Nikita, 25.10.2026), longitude first as Yandex wants
const ll = "77.078248,43.353729";
export const MAP = {
  gis: "https://go.2gis.com/OhBXy",
  yandex: `https://yandex.kz/maps/?ll=${ll}&z=16&pt=${ll}`,
  embed: `https://yandex.kz/map-widget/v1/?ll=${ll}&z=15&pt=${ll},pm2rdm`,
};

export const waLink = (text: string) =>
  `https://wa.me/${CONTACTS.waPhone}?text=${encodeURIComponent(text)}`;

export const instagramUrl = (handle: string) => `https://instagram.com/${handle}`;
