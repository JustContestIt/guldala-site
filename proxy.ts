import { NextResponse, type NextRequest } from "next/server";
import { BOTANICA_URL } from "./content/site";

const LANG = /^\/kz(?=\/|$)/;
const BOTANICA = /^\/botanica(?=\/|$)/;

// Where a request goes. Main host: Russian keeps clean URLs (/tulpan, served from /ru/tulpan), Kazakh lives under /kz,
// /botanica moves to the subdomain. botanica.<host>: a separate landing — /rasteniya is served from /ru/botanica/rasteniya.
export function route(host: string, path: string, botanicaUrl: string): { rewrite: string } | { redirect: string } | null {
  const kz = LANG.test(path);
  const rest = kz ? path.slice(3) || "/" : path;
  // internal paths (the share card URL Next builds: /ru/botanica/opengraph-image) pass as they are
  if (host.startsWith("botanica.") && /^\/(ru|kz)\/botanica(?=\/|$)/.test(path)) return null;
  if (host.startsWith("botanica.")) return { rewrite: `/${kz ? "kz" : "ru"}/botanica${rest.replace(BOTANICA, "").replace(/^\/$/, "")}` };
  if (BOTANICA.test(rest)) return { redirect: `${botanicaUrl}${kz ? "/kz" : ""}${rest.replace(BOTANICA, "") || (kz ? "" : "/")}` };
  if (kz || /^\/ru(?=\/|$)/.test(path)) return null;
  return { rewrite: `/ru${path === "/" ? "" : path}` };
}

// shortcut: after visiting /kz pages the client router may guess /o-nas is lang "o-nas" — that prefetch 404s,
// the click still opens the right page; if it starts to matter, move Russian under /ru as well
export function proxy(request: NextRequest) {
  const r = route(request.headers.get("host") ?? "", request.nextUrl.pathname, BOTANICA_URL);
  if (!r) return NextResponse.next();
  if ("redirect" in r) return NextResponse.redirect(r.redirect + request.nextUrl.search, 308);
  const url = request.nextUrl.clone();
  url.pathname = r.rewrite;
  return NextResponse.rewrite(url);
}

export const config = {
  // skip Next internals and files with an extension (robots.txt, sitemap.xml)
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
