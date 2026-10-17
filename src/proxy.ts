import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Locale-aware routing plus admin session refresh.
 *
 * 1. Any request without a `/bn` or `/en` prefix is redirected to the default
 *    locale so every public URL stays consistent. The `/auth/*` callback is
 *    excluded from the matcher below and is never rewritten.
 * 2. Admin requests additionally refresh the Supabase session cookie. This is
 *    an optimistic convenience only; authorization is enforced in the data
 *    access layer (`src/lib/auth/guards.ts`) and in the database.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (!isLocale(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(`/${firstSegment}/admin`)) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  // Skips `_next/*`, the non-localized `/auth/*` callback, sitemap.xml,
  // robots.txt, favicons and any path with an extension.
  matcher: ["/((?!_next|auth|.*\\..*).*)"],
};
