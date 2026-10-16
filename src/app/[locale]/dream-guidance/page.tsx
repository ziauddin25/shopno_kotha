import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, CircleSlash } from "lucide-react";
import { DuaCard } from "@/components/duas/dua-card";
import { NoticeBox } from "@/components/common/notice-box";
import { Button } from "@/components/ui/button";
import { isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getDuasPageData } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale, SourceReference } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.dreamGuidance.title,
    description: m.dreamGuidance.description,
    path: "/dream-guidance",
  });
}

export default async function DreamGuidancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const g = getMessages(locale).dreamGuidance;
  const m = getMessages(locale);

  const { duas, sources } = await getDuasPageData();
  const sourceMap: Record<string, SourceReference> = Object.fromEntries(
    sources.map((source) => [source.id, source]),
  );
  const badDreamDua = duas.find((dua) => dua.slug === "dua-bad-dream");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
          {m.home.heroEyebrow}
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {g.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {g.description}
        </p>
      </header>

      <NoticeBox tone="info" title={g.introTitle}>
        {g.introBody}
      </NoticeBox>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-4 rounded-2xl border border-border bg-sage/40 p-6">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {g.pleasantTitle}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {g.pleasantBody}
          </p>
          <ul className="space-y-2.5 text-sm text-foreground/85">
            {g.pleasantItems.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-border bg-gold-soft/50 p-6">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {g.disturbingTitle}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {g.disturbingBody}
          </p>
          <ol className="space-y-2.5 text-sm text-foreground/85">
            {g.disturbingItems.map((item, index) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-card text-[0.65rem] font-semibold text-forest">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </article>
      </section>

      {badDreamDua ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {m.duas.title}
          </h2>
          <div className="relative">
            <DuaCard dua={badDreamDua} locale={locale} sourceMap={sourceMap} />
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {g.limitsTitle}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {g.limitsBody}
          </p>
          <ul className="space-y-2.5 text-sm text-foreground/85">
            {g.limitsItems.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {g.notThisTitle}
          </h2>
          <ul className="space-y-2.5 text-sm text-foreground/85">
            {g.notThisItems.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CircleSlash className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href={localizePath(locale, "/duas")}>
            {g.ctaDuas}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={localizePath(locale, "/sources")}>{g.ctaSources}</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={localizePath(locale, "/search")}>{g.ctaSearch}</Link>
        </Button>
      </div>
    </div>
  );
}
