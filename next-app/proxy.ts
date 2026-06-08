import { NextRequest, NextResponse } from "next/server";
import { VALID_LANGS, type LangCode } from "./lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;          // any path with a dot (assets)
const DEFAULT_LANG: LangCode = "fr";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public assets, API routes, Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")   ||
    pathname.startsWith("/admin") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If already under a valid lang segment, pass through
  const firstSegment = pathname.split("/")[1] as LangCode;
  if (VALID_LANGS.includes(firstSegment)) {
    return NextResponse.next();
  }

  // Detect preferred language from Accept-Language header
  const accepted = request.headers.get("accept-language") ?? "";
  const preferred = accepted
    .split(",")
    .map((s) => s.split(";")[0].trim().slice(0, 2))
    .find((code) => VALID_LANGS.includes(code as LangCode)) as LangCode | undefined;

  const lang = preferred ?? DEFAULT_LANG;
  const url  = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  return NextResponse.redirect(url, { status: 307 });
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static, _next/image, favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
