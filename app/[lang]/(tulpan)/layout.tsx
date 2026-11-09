import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getDict } from "@/lib/dict";

// Tulip site chrome; Botanica (app/[lang]/botanica) has its own and lives on botanica.<domain>
export default async function TulpanLayout({ children }: LayoutProps<"/[lang]">) {
  const { t, href } = await getDict();
  return (
    <>
      <Header />
      <main>
        {/* every page but home: a way back besides the menu (review 09.11.2026, С3); CSS, since the proxy rewrite makes the path differ on the client */}
        <div className="shell pt-4 [main:has([data-home])_&]:hidden">
          <Link href={href("/")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:bg-surface">
            ← {t.nav.home}
          </Link>
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}
