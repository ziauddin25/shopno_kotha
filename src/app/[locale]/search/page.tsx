import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleList } from "@/components/articles/article-list";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ArticleGridSkeleton, FilterRowSkeleton } from "@/components/common/skeletons";
import { SearchBox } from "@/components/search/search-box";
import { isLocale, localizePath } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { runSearch } from "@/lib/services/search-service";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.search.searchPageTitle,
    description: m.search.searchPageDescription,
    path: "/search",
  });
}

function buildQueryString(values: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function SearchStream({
  searchParams,
  locale,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  locale: Locale;
}) {
  const params = await searchParams;
  const m = getMessages(locale);

  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const state = typeof params.state === "string" ? params.state : undefined;

  const searchHref = localizePath(locale, "/search");

  const searchBox = (
    <SearchBox
      action={searchHref}
      placeholder={m.search.placeholder}
      defaultValue={q}
      submitLabel={m.search.submit}
      clearLabel={m.search.clear}
    />
  );

  let outcome: Awaited<ReturnType<typeof runSearch>>;
  try {
    outcome = await runSearch({ query: q, categorySlug: category, state, locale });
  } catch {
    return (
      <div className="space-y-8">
        {searchBox}
        <ErrorState
          title={m.search.errorTitle}
          description={m.search.errorDescription}
          retryHref={`${searchHref}${buildQueryString({ q, category })}`}
          retryLabel={m.common.retry}
        />
      </div>
    );
  }

  const { result, categories, activeCategory } = outcome;

  const categoryNames = Object.fromEntries(
    categories.map((item) => [item.id, item.title[locale]]),
  );

  const suggestions = m.home.suggestedSearches;

  return (
    <div className="space-y-8">
      {searchBox}

      <div className="flex flex-wrap gap-2" role="navigation" aria-label={m.common.filterByCategory}>
        <Link
          href={`${searchHref}${buildQueryString({ q })}`}
          aria-current={!activeCategory ? "true" : undefined}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
            !activeCategory
              ? "border-forest/30 bg-sage text-forest"
              : "border-border bg-card text-foreground/75 hover:border-forest/25",
          )}
        >
          {m.common.allCategories}
        </Link>
        {categories.map((item) => {
          const isActive = activeCategory?.id === item.id;
          return (
            <Link
              key={item.id}
              href={`${searchHref}${buildQueryString({ q, category: item.slug })}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-forest/30 bg-sage text-forest"
                  : "border-border bg-card text-foreground/75 hover:border-forest/25",
              )}
            >
              {item.title[locale]}
            </Link>
          );
        })}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {m.search.heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          {q ? <span className="font-medium text-foreground/80">“{q}” — </span> : null}
          {formatNumber(result.total, locale)} {m.search.totalSuffix}
        </p>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title={m.search.emptyTitle}
          description={m.search.emptyDescription}
          action={
            <ul className="flex flex-wrap justify-center gap-2">
              {suggestions.map((term) => (
                <li key={term}>
                  <Link
                    href={`${searchHref}${buildQueryString({ q: term })}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/75 transition-colors hover:border-forest/30 hover:text-forest"
                  >
                    {term}
                  </Link>
                </li>
              ))}
            </ul>
          }
        />
      ) : (
        <ArticleList articles={result.items} locale={locale} categoryNames={categoryNames} />
      )}

      <p className="text-xs text-muted-foreground">
        <Link
          href={`${searchHref}${buildQueryString({ q, category, state: "error" })}`}
          className="underline decoration-dotted underline-offset-3 hover:text-forest"
        >
          {m.common.demoBadge}: {m.search.errorTitle}
        </Link>
      </p>
    </div>
  );
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const m = getMessages(locale);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {m.search.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {m.search.description}
        </p>
      </header>

      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-13 w-full rounded-xl" />
            <FilterRowSkeleton />
            <ArticleGridSkeleton count={3} />
          </div>
        }
      >
        <SearchStream searchParams={searchParams} locale={locale} />
      </Suspense>
    </div>
  );
}
