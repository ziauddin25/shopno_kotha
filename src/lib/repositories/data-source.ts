/**
 * Which implementation backs the repository layer.
 *
 *   mock     – in-memory fixtures from `src/data/mock` (development/tests)
 *   supabase – the live Postgres database
 *
 * Resolution rules:
 *   * `DATA_SOURCE` set explicitly always wins.
 *   * Left unset, the live database is used as soon as it is configured;
 *     otherwise the fixtures are used and a warning is printed once so the
 *     situation is never silent.
 *   * An explicit `DATA_SOURCE=supabase` never falls back. A missing
 *     configuration or a failed query throws instead of serving fixtures.
 */
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type DataSource = "mock" | "supabase";

let warnedMissingConfig = false;

export function resolveDataSource(): DataSource {
  const raw = (process.env.DATA_SOURCE ?? "").trim().toLowerCase();

  if (raw === "mock" || raw === "supabase") return raw;

  if (!isSupabaseConfigured()) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn(
        "[data-source] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not " +
          "set. Serving development fixtures; set DATA_SOURCE=supabase to require the live " +
          "database.",
      );
    }
    return "mock";
  }

  return "supabase";
}
