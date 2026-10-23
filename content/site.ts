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

export const waLink = (text: string) =>
  `https://wa.me/${CONTACTS.waPhone}?text=${encodeURIComponent(text)}`;

export const instagramUrl = (handle: string) => `https://instagram.com/${handle}`;
