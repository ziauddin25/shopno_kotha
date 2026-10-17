"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabasePublicConfig } from "./env";

/**
 * Browser Supabase client.
 *
 * Safe to call from Client Components. Uses the public anon key only; every
 * query is subject to Row Level Security. The session is persisted in cookies
 * so the server can read it during SSR.
 */
export function createClient() {
  const { url, key } = getSupabasePublicConfig();
  return createBrowserClient<Database>(url, key);
}
