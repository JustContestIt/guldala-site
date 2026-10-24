"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

// Bottom right on every page once the visitor has scrolled down; above the order bar when the catalog shows one
export function ScrollTop({ label }: { label: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-12 place-items-center rounded-full bg-accent text-white shadow-lg ring-2 ring-white transition-opacity hover:bg-accent-dark [body:has([data-order-bar])_&]:bottom-24 ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      tabIndex={shown ? 0 : -1}
    >
      <Icon name="up" className="size-6" strokeWidth={2.2} />
    </button>
  );
}
