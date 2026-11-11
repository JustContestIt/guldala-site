import { Suspense, type ReactNode } from "react";
import { terms, TERMS, type Terms } from "@/lib/season";

// Text with the pack size or the minimum in it (review 09.11.2026, К9): the usual numbers in the static shell, the CRM's streamed in
export function WithTerms({ children }: { children: (x: Terms) => ReactNode }) {
  return (
    <Suspense fallback={children(TERMS)}>
      <Filled>{children}</Filled>
    </Suspense>
  );
}

async function Filled({ children }: { children: (x: Terms) => ReactNode }) {
  return children(await terms());
}
