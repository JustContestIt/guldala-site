import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Tulip site chrome; Botanica (app/[lang]/botanica) has its own and lives on botanica.<domain>
// «← На главную» lives in (inner)/layout.tsx: every page but home
export default function TulpanLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
