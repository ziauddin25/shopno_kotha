import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, CircleSlash } from "lucide-react";
import { DuaCard } from "@/components/duas/dua-card";
import { NoticeBox } from "@/components/common/notice-box";
import { DreamSearchBox } from "@/components/dreams/dream-search-box";
import { DreamSearchResults, DreamTopicBrowser } from "@/components/dreams/dream-search-results";
import { Button } from "@/components/ui/button";
import { isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getDuasPageData } from "@/lib/services/article-service";
import { getDreamTopicCatalog } from "@/lib/services/dream-search-service";
import { getMessages } from "@/messages";
import type { Locale, SourceReference } from "@/types";

// Reads uncached repository data (the mock data source is intentionally not
// cache-wrapped), so this route blocks on the server instead of prerendering a
// static shell. See the cache-components migration guide.
export const instant = false;

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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const g = getMessages(locale).dreamGuidance;
  const m = getMessages(locale);

  const query = await searchParams;
  const dreamQuery = typeof query.dream === "string" ? query.dream : undefined;
  const dreamCatalog = dreamQuery?.trim() ? null : await getDreamTopicCatalog();

  const { duas, sources } = await getDuasPageData();
  const sourceMap: Record<string, SourceReference> = Object.fromEntries(
    sources.map((source) => [source.id, source]),
  );
  const badDreamDua = duas.find((dua) => dua.slug === "dua-bad-dream");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
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

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {m.dreamSearch.eyebrow}
          </p>
          <h2 className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {m.dreamSearch.title}
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {m.dreamSearch.description}
          </p>
        </div>
        <DreamSearchBox
          action={localizePath(locale, "/dream-guidance")}
          param="dream"
          fieldLabel={m.dreamSearch.fieldLabel}
          placeholder={m.dreamSearch.placeholder}
          submitLabel={m.dreamSearch.submit}
          defaultValue={dreamQuery}
        />
        <DreamSearchResults query={dreamQuery} locale={locale} />
        {dreamCatalog ? (
          <DreamTopicBrowser
            topics={dreamCatalog}
            locale={locale}
            heading={m.dreamSearch.browseHeading}
          />
        ) : null}
      </section>

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
        <Button asChild size="lg" className="h-11 px-5">
          <Link href={localizePath(locale, "/duas")}>
            {g.ctaDuas}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 px-5">
          <Link href={localizePath(locale, "/sources")}>{g.ctaSources}</Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="h-11 px-5">
          <Link href={localizePath(locale, "/search")}>{g.ctaSearch}</Link>
        </Button>
      </div>
    </div>
  );
}
