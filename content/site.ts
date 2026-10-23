// canonical, sitemap and OG links; set at build time (Docker build arg), the default is the future domain
export const SITE_URL = process.env.SITE_URL || "https://guldala.kz";

export const CONTACTS = {
  phone: "+7 777 100 66 67",
  waPhone: "77771006667",
  instagramTulpan: "guldala.tulpan.kz",
};

export const waLink = (text: string) =>
  `https://wa.me/${CONTACTS.waPhone}?text=${encodeURIComponent(text)}`;

export const instagramUrl = (handle: string) => `https://instagram.com/${handle}`;
