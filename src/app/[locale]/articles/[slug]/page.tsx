import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Info } from "lucide-react";
import { ArticleBody, ArticleToc } from "@/components/articles/article-body";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ShareButton } from "@/components/articles/share-button";
import { NoticeBox } from "@/components/common/notice-box";
import { SourceReferenceCard } from "@/components/sources/source-reference-card";
import { VerificationBadge } from "@/components/common/verification-badge";
import { Badge } from "@/components/ui/badge";
import { localizePath } from "@/lib/i18n";
import { formatDate, formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { getAllArticles } from "@/lib/repositories/article-repository";
import { getArticleDetailData } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale, SourceReference } from "@/types";

// Reads uncached repository data (the mock data source is intentionally not
// cache-wrapped), so this route blocks on the server instead of prerendering a
// static shell. See the cache-components migration guide.
export const instant = false;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles
    .filter((article) => article.status === "published")
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== "bn" && locale !== "en") return {};

  const data = await getArticleDetailData(slug);
  if (!data) return {};

  return pageMetadata({
    locale,
    title: data.article.title,
    description: data.article.summary,
    path: `/articles/${slug}`,
    type: "article",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (rawLocale !== "bn" && rawLocale !== "en") notFound();
  const locale = rawLocale as Locale;

  const data = await getArticleDetailData(slug);
  if (!data) notFound();

  const m = getMessages(locale);
  const { article, category, sources, related } = data;

  const sourceMap: Record<string, SourceReference> = Object.fromEntries(
    sources.map((source) => [source.id, source]),
  );

  const published = formatDate(article.publishedAt, locale);
  const isForeignLanguage = article.locale !== locale;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
        <article className="min-w-0 lg:max-w-3xl">
          <Link
            href={localizePath(locale, "/islamic-dreams")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-forest"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {m.common.backToArticles}
          </Link>

          <header className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {category ? (
                <Link href={localizePath(locale, `/categories/${category.slug}`)}>
                  <Badge variant="secondary" className="rounded-full bg-sage text-forest">
                    {category.title[locale]}
                  </Badge>
                </Link>
              ) : null}
              {isForeignLanguage ? (
                <Badge variant="outline" className="rounded-full text-[0.7rem] text-muted-foreground">
                  {article.locale === "bn" ? m.common.languageBn : m.common.languageEn}
                </Badge>
              ) : null}
              {article.isDemo ? (
                <VerificationBadge
                  status="demo"
                  labels={{
                    checked: m.common.verificationChecked,
                    pending: m.common.verificationPending,
                    demo: m.common.verificationDemo,
                  }}
                />
              ) : null}
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {published ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" aria-hidden />
                  {m.common.publishedOn}: {published}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden />
                {formatNumber(article.readingMinutes, locale)} {m.common.minRead}
              </span>
            </div>
          </header>

          {isForeignLanguage ? (
            <NoticeBox
              tone="info"
              title={article.locale === "bn" ? m.common.writtenInBengali : m.common.writtenInEnglish}
              className="mt-6"
            >
              {article.locale === "bn" ? m.article.languageNoticeBn : m.article.languageNoticeEn}
            </NoticeBox>
          ) : null}

          <div className="mt-6 space-y-8">
            <ArticleBody blocks={article.body} locale={locale} sourceMap={sourceMap} />

            <NoticeBox tone="warning" title={m.common.verificationLabel}>
              {m.article.reviewNote}
            </NoticeBox>

            {sources.length > 0 ? (
              <section className="space-y-4" aria-labelledby="sources-heading">
                <h2
                  id="sources-heading"
                  className="text-lg font-semibold tracking-tight text-foreground"
                >
                  {m.article.sourcesHeading}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {sources.map((source) => (
                    <li key={source.id}>
                      <SourceReferenceCard source={source} locale={locale} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="space-y-3 border-t border-border/70 pt-6">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                {m.article.shareHeading}
              </h2>
              <ShareButton
                title={article.title}
                shareLabel={m.common.share}
                copyLabel={m.common.copyLink}
                copiedLabel={m.common.linkCopied}
                failedLabel={m.common.copyFailed}
              />
            </section>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ArticleToc blocks={article.body} locale={locale} />
          <div className="rounded-xl border border-border bg-sage/40 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Info className="size-4 text-forest" aria-hidden />
              {m.common.reportError}
            </p>
            <p className="mt-2 text-pretty text-muted-foreground">{m.common.reportErrorHint}</p>
            <Link
              href={localizePath(locale, "/contact")}
              className="mt-3 inline-block text-forest hover:underline"
            >
              {m.common.reportError}
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-14">
        <RelatedArticles
          articles={related}
          locale={locale}
          categoryNames={
            category ? { [category.id]: category.title[locale] } : undefined
          }
        />
      </div>
    </div>
  );
}
