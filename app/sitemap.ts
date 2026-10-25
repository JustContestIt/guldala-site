import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { VARIETIES } from "@/content/varieties";
import { LANGS, localHref } from "@/lib/i18n";

const PATHS = [
  "/",
  "/tulpan",
  "/tulpan/sorta",
  ...VARIETIES.map((v) => `/tulpan/sorta/${v.slug}`),
  "/tulpan/zakaz",
  "/o-nas",
  "/voprosy",
  "/kontakty",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    LANGS.map((lang) => ({
      url: SITE_URL + localHref(lang, path),
      alternates: { languages: { ru: SITE_URL + path, kk: SITE_URL + localHref("kz", path) } },
    })),
  );
}
