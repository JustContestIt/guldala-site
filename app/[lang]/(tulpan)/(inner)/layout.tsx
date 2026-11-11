import Link from "next/link";
import { getDict } from "@/lib/dict";

// Every tulip page but home: a way back besides the menu (review 09.11.2026, С3). A layout of its own, not CSS on the shared one:
// the router keeps visited pages hidden in the page, so «is the home page here?» was true on subpages too.
export default async function InnerLayout({ children }: { children: React.ReactNode }) {
  const { t, href } = await getDict();
  return (
    <>
      <div className="shell pt-4">
        <Link href={href("/")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:bg-surface">
          ← {t.nav.home}
        </Link>
      </div>
      {children}
    </>
  );
}
