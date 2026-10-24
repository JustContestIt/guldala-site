"use client";

import type { FormEvent } from "react";
import { formatPhone } from "@/lib/validate";
import { inputCls } from "./ui";

const PREFIX = "+7 ";

// The phone field of the order and lead forms: +7 is there once it's focused, the digits fall into +7 777 100 66 67
// as they're typed or pasted, and a number short of 10 digits stays invalid (pattern). Uncontrolled: the caret is set by hand
export function PhoneInput({ defaultValue = "" }: { defaultValue?: string }) {
  const onInput = (e: FormEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    // keep the caret after the same local digit (after +7) it was after; the text before the caret is read the same way
    const before = Math.max(0, formatPhone(el.value.slice(0, el.selectionStart ?? el.value.length)).replace(/\D/g, "").length - 1);
    el.value = formatPhone(el.value) || PREFIX;
    let i = PREFIX.length;
    for (let d = 0; i < el.value.length && d < before; i++) if (/\d/.test(el.value[i])) d++;
    el.setSelectionRange(i, i);
  };
  return (
    <input
      name="phone"
      type="tel"
      required
      inputMode="tel"
      autoComplete="tel"
      placeholder="+7 7__ ___ __ __"
      pattern="\+7 ?\d{3} ?\d{3} ?\d{2} ?\d{2}"
      defaultValue={formatPhone(defaultValue)}
      onFocus={(e) => {
        if (!e.currentTarget.value) e.currentTarget.value = PREFIX;
      }}
      onBlur={(e) => {
        if (e.currentTarget.value === PREFIX) e.currentTarget.value = "";
      }}
      onInput={onInput}
      className={inputCls}
    />
  );
}
