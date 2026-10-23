import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BOTANICA_URL } from "@/content/site";
import { getDict } from "@/lib/dict";

// Served on botanica.<domain> (proxy.ts): canonical links and the share card point there, not to the tulip site
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    metadataBase: new URL(BOTANICA_URL),
    title: { default: t.meta.botanica.title, template: "%s · Guldala Botanica" },
    description: t.meta.botanica.description,
    openGraph: { siteName: "Guldala Botanica", locale: t.ogLocale, type: "website" },
  };
}

// Botanica: same system, inverted — dark ground, light text (brief §6); no tulip menu
export default function BotanicaLayout({ children }: LayoutProps<"/[lang]/botanica">) {
  return (
    <>
      <Header botanica />
      <main className="bg-night text-night-text">{children}</main>
      <Footer botanica />
    </>
  );
}
