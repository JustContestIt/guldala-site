"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";

// Right after the checkout (?new=1): the letter about the request has gone to the client's e-mail (13.11.2026).
// ?new=1 leaves the address, so a reload or a shared link neither shows this again nor empties a basket
export function SentNotice({ title, text, ok }: { title: string; text: string; ok: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
    const url = new URL(location.href);
    url.searchParams.delete("new");
    history.replaceState(history.state, "", url);
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="sent-title"
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="m-auto w-[calc(100%-1.5rem)] max-w-md rounded-3xl bg-white p-6 text-ink shadow-xl backdrop:bg-[#15231b80] sm:p-8"
    >
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-mint text-accent">
        <Icon name="check" className="size-6" strokeWidth={2.2} />
      </span>
      <h2 id="sent-title" className="mt-4 text-2xl">{title}</h2>
      <p className="mt-2">{text}</p>
      <form method="dialog" className="mt-6">
        <button className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-dark">
          {ok}
        </button>
      </form>
    </dialog>
  );
}
