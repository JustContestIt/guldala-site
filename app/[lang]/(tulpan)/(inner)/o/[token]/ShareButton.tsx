"use client";

import { useState } from "react";

export function ShareButton({ label, copied, title }: { label: string; copied: string; title: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    const url = location.href;
    if (navigator.share) return navigator.share({ title, url }).catch(() => {});
    await navigator.clipboard.writeText(url);
    setDone(true);
  };
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-semibold hover:bg-surface"
    >
      <span aria-live="polite">{done ? copied : label}</span>
    </button>
  );
}
