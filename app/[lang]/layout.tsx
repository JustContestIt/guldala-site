import type { Metadata } from "next";
import { Golos_Text, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE_URL } from "@/content/site";
import { getDict } from "@/lib/dict";
import { LANGS } from "@/lib/i18n";
import "../globals.css";

// subsets = what gets preloaded; cyrillic-ext (Kazakh letters) still loads on demand via unicode-range
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });
// Variable weight: Kazakh headings use Golos at 800, since Manrope has no ә ғ қ ң ұ
const golos = Golos_Text({ subsets: ["latin", "cyrillic"], variable: "--font-golos" });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.site, template: "%s · Guldala" },
    description: t.meta.siteDesc,
    openGraph: { siteName: "Guldala", locale: t.ogLocale, type: "website" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { t } = await getDict();
  return (
    <html lang={t.htmlLang} className={`${manrope.variable} ${golos.variable}`}>
      <body className="bg-white font-sans text-ink antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
