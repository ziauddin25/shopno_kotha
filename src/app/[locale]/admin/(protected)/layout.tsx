import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/guards";
import { isLocale } from "@/lib/i18n";

// Authorization happens here, on the server, for every protected admin page.
export const instant = false;

export default async function ProtectedAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  await requireStaff(locale);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{children}</div>
  );
}
