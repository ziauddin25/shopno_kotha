import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabasePublicConfig } from "./env";

/**
 * Server-side Supabase client for Server Components, Server Actions and Route
 * Handlers. A fresh client must be created for every request — never cache or
 * share one across requests.
 *
 * `setAll` is wrapped in a try/catch because cookies are read-only while
 * rendering a Server Component; token refreshes there are discarded and
 * replayed by the session-refresh helper in `proxy.ts`.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabasePublicConfig();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component render: cookies are immutable. The proxy handles
          // session refresh, so this can be safely ignored.
        }
      },
    },
  });
}
