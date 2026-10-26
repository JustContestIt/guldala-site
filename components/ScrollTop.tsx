"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const R = 20;
const RING = 2 * Math.PI * R;

// Bottom right on every page once the visitor has scrolled down; above the order bar when the catalog shows one.
// The ring fills as the page scrolls; it is set on the element directly, not through state, so scrolling doesn't re-render
export function ScrollTop({ label }: { label: string }) {
  const [shown, setShown] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShown(window.scrollY > 600);
      ring.current?.style.setProperty("stroke-dashoffset", String(RING * (1 - (max > 0 ? Math.min(1, window.scrollY / max) : 0))));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-11 place-items-center rounded-full bg-white/80 text-accent shadow-md ring-1 ring-black/5 backdrop-blur transition-[opacity,translate,background-color] duration-300 hover:bg-white motion-reduce:transition-none [body:has([data-order-bar])_&]:bottom-24 ${
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      tabIndex={shown ? 0 : -1}
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={3} />
        <circle ref={ring} cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING} />
      </svg>
      <Icon name="up" className="size-5" strokeWidth={2.2} />
    </button>
  );
}
