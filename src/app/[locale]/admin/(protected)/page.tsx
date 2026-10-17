import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import { requireStaff } from "@/lib/auth/guards";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/messages";

export const instant = false;

export const metadata: Metadata = {
  title: "Publishing workspace",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const profile = await requireStaff(locale);
  const m = getMessages(locale);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {m.auth.dashboardTitle}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {m.auth.dashboardSubtitle}
          </p>
        </div>
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" variant="outline" size="sm">
            {m.auth.signOut}
          </Button>
        </form>
      </header>

      <dl className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {m.auth.signedInAs}
          </dt>
          <dd className="text-sm text-foreground">
            {profile.email ?? profile.displayName ?? profile.id}
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {m.auth.roleLabel}
          </dt>
          <dd className="text-sm text-foreground">{m.auth.roles[profile.role]}</dd>
        </div>
      </dl>
    </div>
  );
}
