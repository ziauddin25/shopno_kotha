import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Locale } from "@/types";

export type StaffRole = "admin" | "editor" | "reviewer";

export interface SessionProfile {
  id: string;
  email: string | null;
  role: StaffRole;
  displayName: string | null;
}

/**
 * Data Access Layer for the current staff session.
 *
 * Returns the authenticated user together with their authoritative role from
 * `public.profiles` (never from client-supplied data). Memoized per request.
 * `getUser()` validates the token with Supabase, so a forged cookie cannot
 * impersonate a user.
 */
export const getSessionProfile = cache(async (): Promise<SessionProfile | null> => {
  // Backend not configured yet: behave like an anonymous visitor instead of
  // throwing during render.
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile.role as StaffRole,
    displayName: profile.display_name,
  };
});

/** Requires any signed-in staff member; otherwise redirects to the login page. */
export async function requireStaff(locale: Locale): Promise<SessionProfile> {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect(`/${locale}/admin/login`);
  }
  return profile;
}

/**
 * Requires one of the given roles. Use inside Server Actions and page
 * components immediately before sensitive work — never trust a client-side
 * check on its own.
 */
export async function requireRole(
  locale: Locale,
  roles: readonly StaffRole[],
): Promise<SessionProfile> {
  const profile = await requireStaff(locale);
  if (!roles.includes(profile.role)) {
    redirect(`/${locale}/admin`);
  }
  return profile;
}
