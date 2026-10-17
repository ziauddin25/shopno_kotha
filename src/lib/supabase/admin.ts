import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Privileged Supabase client using the service-role key.
 *
 * BYPASSES ROW LEVEL SECURITY. It must only ever be imported by server-side
 * code (scripts, Route Handlers, Server Actions) that has already authorized
 * the caller. The runtime guard below fails fast if it is ever loaded in a
 * browser context.
 *
 * Prefer the RLS-scoped clients (`createClient` in `client.ts` / `server.ts`)
 * for anything that can be expressed as a normal policy-checked query.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() must only be called on the server.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. The " +
        "service-role key must be set as a server-only environment variable.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
