/**
 * Read-only Supabase client for public content.
 *
 * Anonymous key only, no session persistence and – crucially – no `cookies()`
 * access, so it may be called from cached server functions (`"use cache"`),
 * from `generateStaticParams` and from any server component.
 *
 * Every query made through this client is subject to Row Level Security: anon
 * can only read published content and non-demo sources. The service-role client
 * in `admin.ts` must never be used for public reads.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicConfig } from "./env";

let client: SupabaseClient<Database> | null = null;

export function createPublicClient(): SupabaseClient<Database> {
  if (client) return client;

  const { url, key } = getSupabasePublicConfig();

  client = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return client;
}
