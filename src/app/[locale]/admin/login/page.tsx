import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSessionProfile } from "@/lib/auth/guards";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/messages";

// Reads the session cookie, so this route blocks on the server instead of
// trying to prerender. See the authentication-with-cache-components guide.
export const instant = false;

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const profile = await getSessionProfile();
  if (profile) {
    redirect(`/${locale}/admin`);
  }

  const m = getMessages(locale);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-24">
        <Alert>
          <AlertTitle>{m.auth.loginTitle}</AlertTitle>
          <AlertDescription>{m.auth.notConfigured}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-24">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {m.auth.loginTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{m.auth.loginSubtitle}</p>
      </div>
      <LoginForm locale={locale} labels={m.auth} />
    </div>
  );
}
