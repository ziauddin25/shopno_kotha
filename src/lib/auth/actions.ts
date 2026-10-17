"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { defaultLocale } from "@/types";

export type SignInErrorKey =
  | "missingFields"
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "notConfigured"
  | "unknown";

export type SignInState = { error: SignInErrorKey } | undefined;

const signInSchema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
});

function resolveLocale(value: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value : "";
  return isLocale(raw) ? raw : defaultLocale;
}

/**
 * Email/password sign-in. Re-validates on the server and never reveals whether
 * an account exists: all credential failures collapse to one message.
 */
export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const locale = resolveLocale(formData.get("locale"));

  if (!isSupabaseConfigured()) {
    return { error: "notConfigured" };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "missingFields" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "emailNotConfirmed" };
    }
    return { error: "invalidCredentials" };
  }

  redirect(`/${locale}/admin`);
}

/** Clears the session and returns to the login screen. */
export async function signOutAction(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect(`/${locale}/admin/login`);
}
