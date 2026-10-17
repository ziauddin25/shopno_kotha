/**
 * Public Supabase configuration.
 *
 * The `process.env.NEXT_PUBLIC_*` references are intentionally written as
 * static, module-level lookups so Next.js can inline them into the browser
 * bundle at build time. Do not refactor them behind dynamic access.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabasePublicConfig(): { url: string; key: string } {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase configuration. Copy .env.example to .env.local and set " +
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url: supabaseUrl, key: supabaseAnonKey };
}
