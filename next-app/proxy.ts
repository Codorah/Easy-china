import { NextRequest, NextResponse } from "next/server";
import { VALID_LANGS, type LangCode } from "./lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const DEFAULT_LANG: LangCode = "fr";
const SESSION_COOKIE = "ec_admin";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth guard ──────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // Login page is always accessible
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }
    // All other /admin/* paths require a valid session cookie
    const session = request.cookies.get(SESSION_COOKIE);
    if (!session?.value) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl, { status: 307 });
    }
    return NextResponse.next();
  }

  // ── Skip public assets & Next.js internals ────────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")   ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── i18n lang prefix injection ────────────────────────────────────────────
  const firstSegment = pathname.split("/")[1] as LangCode;
  if (VALID_LANGS.includes(firstSegment)) {
    return NextResponse.next();
  }

  const accepted  = request.headers.get("accept-language") ?? "";
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
