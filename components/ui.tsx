import Link from "next/link";
import type { ReactNode } from "react";
import type { Dict } from "@/content/dict/ru";
import type { StockStatus } from "@/lib/season";

// Client-safe building blocks: no dictionary lookups here, texts come in as props

const STOCK: Record<StockStatus, string> = {
  many: "bg-mint text-accent-dark",
  few: "bg-warn-bg text-warn",
  none: "bg-surface text-muted",
};

export function StockBadge({ status, t }: { status: StockStatus; t: Dict["stock"] }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STOCK[status]}`}>
      {t.label}: {t[status]}
    </span>
  );
}

export function ColorDot({ hex, className = "size-3" }: { hex: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full border border-black/15 ${className}`}
      style={{ background: hex }}
    />
  );
}

// Visible marker for a fact we still need from Tatiana
export function Ph({ children }: { children: ReactNode }) {
  return <span className="rounded bg-warn-bg px-1 text-warn">[{children}]</span>;
}

const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  secondary: "border border-line bg-white text-ink hover:bg-surface",
  light: "bg-white text-ink hover:bg-mint",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors ${VARIANTS[variant]} ${className}`;
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function SectionTitle({ title, lead, dark }: { title: string; lead?: ReactNode; dark?: boolean }) {
  return (
    <div className="mb-6 max-w-2xl">
      <h2 className={`text-2xl sm:text-3xl ${dark ? "text-white" : ""}`}>{title}</h2>
      {lead && <p className={`mt-2 ${dark ? "" : "text-muted"}`}>{lead}</p>}
    </div>
  );
}

// Label + control stacked; used by the calculator and Botanica forms
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "min-h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25";
