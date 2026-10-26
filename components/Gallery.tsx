"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";

const arrow =
  "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-md backdrop-blur transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0";

// A variety's photos, like Haakman's catalog: one big photo with thumbnails under it. The big ones come rendered from the
// server (Photo, with its watermark); a swipe, an arrow or a tap on a thumbnail shows the next one
export function Gallery({ slides, thumbs, label, t }: { slides: ReactNode[]; thumbs: StaticImageData[]; label: string; t: { prev: string; next: string } }) {
  const [shown, setShown] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const go = (n: number) => strip.current?.scrollTo({ left: n * strip.current.clientWidth, behavior: "smooth" });
  const many = slides.length > 1;
  return (
    <>
      <div className="relative">
        {/* The strip sticks out 8px on each side and every slide pads its photo by as much: a gap between photos while
            swiping, yet one slide is still exactly the strip's width, so the slide's number is scrollLeft / width */}
        <div
          ref={strip}
          onScroll={(e) => setShown(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="-mx-2 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
        >
          {slides.map((s, n) => (
            <div key={n} className="w-full shrink-0 snap-center px-2">
              {s}
            </div>
          ))}
        </div>
        {many && (
          <>
            <button type="button" aria-label={t.prev} disabled={shown === 0} onClick={() => go(shown - 1)} className={`${arrow} left-2`}>
              <Icon name="chevron" className="size-5 rotate-90" strokeWidth={2.2} />
            </button>
            <button type="button" aria-label={t.next} disabled={shown === slides.length - 1} onClick={() => go(shown + 1)} className={`${arrow} right-2`}>
              <Icon name="chevron" className="size-5 -rotate-90" strokeWidth={2.2} />
            </button>
            {/* the thumbnails below are the way to pick a photo; the dots and the counter only show where you are */}
            <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-black/45 px-2 py-0.5 text-xs font-semibold text-white tabular-nums">
              {shown + 1} / {slides.length}
            </span>
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
              {slides.map((_, n) => (
                <span key={n} className={`h-1.5 rounded-full bg-white shadow transition-all duration-300 ${n === shown ? "w-5" : "w-1.5 opacity-60"}`} />
              ))}
            </span>
          </>
        )}
      </div>
      {thumbs.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {/* up to 72 / 80px each, narrower when five don't fit a phone */}
          {thumbs.map((p, n) => (
            <li key={p.src} className="max-w-18 min-w-0 flex-1 sm:max-w-20">
              <button
                type="button"
                aria-pressed={n === shown}
                aria-label={`${label}, ${n + 1}`}
                onClick={() => go(n)}
                className="block aspect-square w-full overflow-hidden rounded-xl opacity-70 ring-accent ring-offset-2 hover:opacity-100 aria-pressed:opacity-100 aria-pressed:ring-2"
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
