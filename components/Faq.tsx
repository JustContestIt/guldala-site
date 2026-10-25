import { getDict } from "@/lib/dict";
import { Icon } from "./icons";

// The questions and answers: on the home page, under prices and the catalog, and as the menu's own page
export async function Faq({ className = "" }: { className?: string }) {
  const { t } = await getDict();
  return (
    <div className={`max-w-3xl divide-y divide-line border-y border-line ${className}`}>
      {t.faq.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <Icon name="chevron" className="size-5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-4 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
