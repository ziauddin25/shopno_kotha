import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleList } from "@/components/articles/article-list";
import { FilterRowSkeleton, ArticleGridSkeleton } from "@/components/common/skeletons";
import { isLocale, localizePath } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { getArticleIndexData } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.articles.title,
    description: m.articles.description,
    path: "/islamic-dreams",
  });
}

async function ArticleIndex({
  searchParams,
  locale,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  locale: Locale;
}) {
  const params = await searchParams;
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category;

  const { articles, categories, activeCategory } = await getArticleIndexData(rawCategory);
  const m = getMessages(locale);

  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.id, category.title[locale]]),
  );

  const filterHref = (slug?: string) =>
    localizePath(locale, slug ? `/islamic-dreams?category=${slug}` : "/islamic-dreams");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" role="navigation" aria-label={m.articles.filterLabel}>
        <Link
          href={filterHref()}
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
        {categories.map((category) => {
          const isActive = activeCategory?.id === category.id;
          return (
            <Link
              key={category.id}
              href={filterHref(category.slug)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-forest/30 bg-sage text-forest"
                  : "border-border bg-card text-foreground/75 hover:border-forest/25",
              )}
            >
              {category.title[locale]}
            </Link>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        {formatNumber(articles.length, locale)} {m.articles.resultsLabel}
      </p>

      <ArticleList
        articles={articles}
        locale={locale}
        categoryNames={categoryNames}
        emptyTitle={m.articles.emptyTitle}
        emptyDescription={m.articles.emptyDescription}
      />
    </div>
  );
}

export default async function IslamicDreamsPage({
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
          {m.articles.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {m.articles.description}
        </p>
      </header>

      <Suspense
        fallback={
          <div className="space-y-8">
            <FilterRowSkeleton />
            <ArticleGridSkeleton />
          </div>
        }
      >
        <ArticleIndex searchParams={searchParams} locale={locale} />
      </Suspense>
    </div>
  );
}
