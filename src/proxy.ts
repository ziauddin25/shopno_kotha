import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Locale-aware routing: any request without a `/bn` or `/en` prefix is
 * redirected to the default locale so every URL stays consistent.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skips `_next/*`, sitemap.xml, robots.txt, favicons and any path with an extension.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
