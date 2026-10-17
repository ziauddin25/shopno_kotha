/**
 * Shared plumbing for the staff repositories.
 *
 * Staff repositories differ from the public ones in three ways: they use the
 * cookie-scoped server client (so RLS and the workflow triggers see the real
 * user), they are never cached (drafts change on every request), and they map
 * Postgres error codes to small, translatable keys for the UI.
 */
import type { PostgrestError } from "@supabase/supabase-js";
import { RepositoryError } from "./errors";

export type AdminErrorKey =
  | "slugTaken"
  | "invalidTransition"
  | "forbidden"
  | "notFound"
  | "database";

/**
 * Translates a PostgREST/Postgres error into a stable key.
 *
 *   23505 unique_violation        -> slugTaken
 *   23514 check_violation         -> invalidTransition (status graph / publish date)
 *   42501 insufficient_privilege  -> forbidden (workflow triggers)
 *   PGRST116 no rows              -> notFound (RLS filtered the UPDATE/DELETE)
 */
export function adminErrorKey(error: PostgrestError): AdminErrorKey {
  switch (error.code) {
    case "23505":
      return "slugTaken";
    case "23514":
      return "invalidTransition";
    case "42501":
      return "forbidden";
    case "PGRST116":
      return "notFound";
    default:
      return "database";
  }
}

export class AdminRepositoryError extends RepositoryError {
  readonly adminKey: AdminErrorKey;

  constructor(scope: string, adminKey: AdminErrorKey, detail: string, cause?: unknown) {
    super(scope, adminKey === "database" ? "database" : "validation", detail, cause);
    this.name = "AdminRepositoryError";
    this.adminKey = adminKey;
  }
}

export function mapPostgrestError(scope: string, error: PostgrestError): AdminRepositoryError {
  const key = adminErrorKey(error);
  return new AdminRepositoryError(
    scope,
    key,
    `Admin data operation failed in "${scope}": ${error.message}`,
    error,
  );
}
