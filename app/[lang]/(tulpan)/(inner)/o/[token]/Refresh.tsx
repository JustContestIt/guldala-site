"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// The page reads the CRM on every render, so a refresh is how the waiting client sees the payment arrive (С9)
export function Refresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
