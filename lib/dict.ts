import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { kz } from "@/content/dict/kz";
import { ru } from "@/content/dict/ru";
import { isLang, localHref, type Lang } from "./i18n";

const DICTS = { ru, kz };

export async function getLang(): Promise<Lang> {
  const l = await rootLang();
  if (!isLang(l)) notFound();
  return l;
}

export async function getDict() {
  const lang = await getLang();
  return { lang, t: DICTS[lang], href: (path: string) => localHref(lang, path) };
}

export async function pageMeta(path: string, title: string, description?: string): Promise<Metadata> {
  const lang = await getLang();
  return {
    title,
    description,
    alternates: { canonical: localHref(lang, path), languages: { ru: path, kk: localHref("kz", path) } },
  };
}
