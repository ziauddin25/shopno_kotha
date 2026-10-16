import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localizePath } from "@/lib/i18n";
import { formatDate, formatNumber } from "@/lib/format";
import { getMessages } from "@/messages";
import type { Article, Locale } from "@/types";

export function FeaturedArticle({
  article,
  locale,
  categoryName,
}: {
  article: Article;
  locale: Locale;
  categoryName?: string;
}) {
  const m = getMessages(locale);
  const published = formatDate(article.publishedAt, locale);

  return (
    <article className="relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {m.home.featuredLabel}
        </span>
        {categoryName ? (
          <Badge variant="secondary" className="rounded-full bg-sage text-forest">
            {categoryName}
          </Badge>
        ) : null}
      </div>

      <h3 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        <Link
          href={localizePath(locale, `/articles/${article.slug}`)}
          className="outline-none after:absolute after:inset-0 focus-visible:underline"
        >
          {article.title}
        </Link>
      </h3>

      <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        {article.summary}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {published ? (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            {published}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {formatNumber(article.readingMinutes, locale)} {m.common.minRead}
        </span>
      </div>

      <div>
        <Button asChild variant="outline" size="sm">
          <Link href={localizePath(locale, `/articles/${article.slug}`)}>
            {m.common.readMore}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  );
}
