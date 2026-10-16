import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { NoticeBox } from "@/components/common/notice-box";
import { VerificationBadge } from "@/components/common/verification-badge";
import { SourceReferenceCard } from "@/components/sources/source-reference-card";
import { Button } from "@/components/ui/button";
import { isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getSourcesPageData } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.sources.title,
    description: m.sources.description,
    path: "/sources",
  });
}

export default async function SourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const s = getMessages(locale).sources;
  const m = getMessages(locale);

  const sources = await getSourcesPageData();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {s.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {s.description}
        </p>
      </header>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{s.howTitle}</h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {s.howSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3.5 rounded-xl border border-border bg-card p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-semibold text-forest">
                {index + 1}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{s.typesTitle}</h2>
          <dl className="space-y-3">
            {s.types.map((type) => (
              <div key={type.title} className="rounded-xl border border-border bg-card p-4">
                <dt className="text-sm font-medium text-foreground">{type.title}</dt>
                <dd className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {type.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {s.legendTitle}
          </h2>
          <ul className="space-y-3 text-sm">
            {(
              [
                ["checked", s.legend.checked],
                ["pending", s.legend.pending],
                ["demo", s.legend.demo],
              ] as const
            ).map(([status, description]) => (
              <li key={status} className="space-y-2 rounded-xl border border-border bg-card p-4">
                <VerificationBadge
                  status={status}
                  labels={{
                    checked: m.common.verificationChecked,
                    pending: m.common.verificationPending,
                    demo: m.common.verificationDemo,
                  }}
                />
                <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{s.listTitle}</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <li key={source.id}>
              <SourceReferenceCard source={source} locale={locale} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-sage/40 p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {s.correctionsTitle}
        </h2>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {s.correctionsBody}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={localizePath(locale, "/contact")}>
            {m.common.reportError}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </section>

      <NoticeBox tone="demo" title={m.common.demoNoticeTitle}>
        {m.common.demoNoticeBody}
      </NoticeBox>
    </div>
  );
}
