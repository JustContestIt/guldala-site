import { NextResponse, type NextRequest } from "next/server";

// Russian keeps clean URLs (/tulpan) while every page lives under app/[lang]: serve them from /ru/… without a redirect.
// shortcut: after visiting /kz pages the client router may guess /o-nas is lang "o-nas" — that prefetch 404s,
// the click still opens the right page; if it starts to matter, move Russian under /ru as well
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/ru${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // skip Next internals, files with an extension (robots.txt, sitemap.xml) and paths already carrying a language
  matcher: ["/((?!_next/|api/|kz(?:/|$)|ru(?:/|$)|.*\\..*).*)"],
};
