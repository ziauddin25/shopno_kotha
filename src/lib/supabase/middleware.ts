import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Refreshes the Supabase auth session for a request and returns the response
 * that carries any updated cookies.
 *
 * Called only for admin routes from `proxy.ts`. Proxy is an optimistic check
 * only (see the Next.js Proxy docs) — it refreshes the session so Server
 * Components and Server Actions can rely on a current token, but it makes no
 * authorization decisions. Real checks live in the data access layer.
 *
 * If Supabase is not configured (e.g. before `.env.local` is filled in) the
 * request passes through untouched instead of crashing every admin request.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return response;
  }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        // Auth responses must never be cached by a CDN or reverse proxy.
        Object.entries(headers).forEach(([headerName, headerValue]) => {
          response.headers.set(headerName, headerValue);
        });
      },
    },
  });

  // Touching the session writes a refreshed token back through `setAll`.
  await supabase.auth.getUser();

  return response;
}
