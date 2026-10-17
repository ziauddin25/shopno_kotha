import { notFound } from "next/navigation";
import { LockKeyhole, Mail, RefreshCw, UsersRound } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const privacy = getMessages(locale).privacy;

  return pageMetadata({
    locale,
    title: privacy.title,
    description: privacy.description,
    path: "/privacy",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const privacy = getMessages(locale).privacy;

  const sections = [
    { icon: LockKeyhole, title: privacy.introTitle, body: privacy.introBody },
    { icon: Mail, title: privacy.contactTitle, body: privacy.contactBody },
    { icon: UsersRound, title: privacy.staffTitle, body: privacy.staffBody },
    { icon: RefreshCw, title: privacy.changesTitle, body: privacy.changesBody },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#806b3e] uppercase">
          Shopno Kotha
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {privacy.title}
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {privacy.description}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(({ icon: Icon, title, body }) => (
          <section
            key={title}
            className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-7"
          >
            <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-sage text-forest">
              <Icon className="size-5" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
