// The CRM's /public/* (docs/crm-contract.md). Server-side only: the shared secret never reaches the browser.
const url = (path: string) => `${process.env.CRM_URL ?? "http://localhost:3001"}/public${path}`;
const headers = (ip?: string | null) => ({
  "X-Public-Secret": process.env.CRM_PUBLIC_SECRET ?? "",
  "Content-Type": "application/json",
  ...(ip && { "X-Forwarded-For": ip }), // the visitor's address for the CRM's rate limit
});

// GET: null on 404 (no season, unknown token), throws on anything else
export async function crmGet<T>(path: string): Promise<T | null> {
  const res = await fetch(url(path), { headers: headers() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`CRM ${res.status}`);
  return res.json();
}

// POST: a refusal (4xx) comes back as the CRM's human text in `error`; network trouble and 5xx throw
export async function crmPost<T>(path: string, body: unknown, ip?: string | null): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const res = await fetch(url(path), { method: "POST", headers: headers(ip), body: JSON.stringify(body) });
  if (res.ok) return { ok: true, data: await res.json() };
  if (res.status >= 500) throw new Error(`CRM ${res.status}`);
  const { error } = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: false, error: error ?? `CRM ${res.status}` };
}
