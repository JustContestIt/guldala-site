"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { Field, inputCls } from "@/components/ui";
import type { Dict } from "@/content/dict/ru";
import { submitLead } from "./actions";

export function LeadForm({
  kind,
  t,
  segments,
}: {
  kind: "lead" | "designer";
  t: Dict["forms"];
  segments: Dict["botanica"]["objectTypes"];
}) {
  const [state, action, pending] = useActionState(submitLead, null);
  // Submit by hand so a validation error doesn't wipe what the visitor typed
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };

  if (state?.ok)
    return (
      <p role="status" className="rounded-2xl bg-night-soft p-5 font-semibold text-white">
        {kind === "designer" ? t.okDesigner : t.okLead}
      </p>
    );

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input type="hidden" name="kind" value={kind} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {kind === "lead" && (
        <Field label={t.segment}>
          <select name="segment" className={inputCls}>
            {Object.entries(segments).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
      )}
      <Field label={kind === "designer" ? t.company : t.companyOptional}>
        <input name="company" required={kind === "designer"} maxLength={200} autoComplete="organization" className={inputCls} />
      </Field>
      <Field label={t.phone}>
        <PhoneInput />
      </Field>
      {kind === "lead" && (
        <Field label={t.message}>
          <textarea name="message" required rows={4} maxLength={1000} placeholder={t.messagePh} className={`${inputCls} py-2`} />
        </Field>
      )}
      {state?.errors.length ? (
        <ul role="alert" className="grid gap-1 rounded-xl bg-up-bg p-3 text-sm text-up">
          {state.errors.map((e) => (
            <li key={e}>{t.errors[e]}</li>
          ))}
        </ul>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-night-accent px-5 font-semibold text-night hover:bg-white disabled:opacity-50"
      >
        {pending ? t.sending : kind === "designer" ? t.getPrice : t.send}
      </button>
    </form>
  );
}
