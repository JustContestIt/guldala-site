"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type ReactNode } from "react";

// A variety's photos, like Haakman's catalog: one big photo with thumbnails under it. The big ones come rendered from the
// server (Photo, with its watermark); a swipe or a tap on a thumbnail shows the next one
export function Gallery({ slides, thumbs, label }: { slides: ReactNode[]; thumbs: StaticImageData[]; label: string }) {
  const [shown, setShown] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const go = (n: number) => strip.current?.scrollTo({ left: n * strip.current.clientWidth, behavior: "smooth" });
  return (
    <>
      <div
        ref={strip}
        onScroll={(e) => setShown(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [scrollbar-width:none]"
      >
        {slides.map((s, n) => (
          <div key={n} className="w-full shrink-0 snap-center">
            {s}
          </div>
        ))}
      </div>
      {thumbs.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {thumbs.map((p, n) => (
            <li key={p.src}>
              <button
                type="button"
                aria-pressed={n === shown}
                aria-label={`${label}, ${n + 1}`}
                onClick={() => go(n)}
                className="block size-18 overflow-hidden rounded-xl opacity-70 ring-accent ring-offset-2 hover:opacity-100 aria-pressed:opacity-100 aria-pressed:ring-2 sm:size-20"
              >
                {/* the tap and a long-press go to the button, not the image: no casual "save image" */}
                <Image src={p} alt="" sizes="80px" placeholder="blur" className="pointer-events-none size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
