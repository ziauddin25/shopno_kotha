import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/common/verification-badge";
import { localizePath } from "@/lib/i18n";
import { formatDate, formatNumber } from "@/lib/format";
import { getMessages } from "@/messages";
import type { Article, Locale } from "@/types";
import { cn } from "@/lib/utils";

export function ArticleCard({
  article,
  locale,
  categoryName,
  className,
}: {
  article: Article;
  locale: Locale;
  categoryName?: string;
  className?: string;
}) {
  const m = getMessages(locale);
  const published = formatDate(article.publishedAt, locale);
  const isForeign = article.locale !== locale;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {categoryName ? (
          <Badge variant="secondary" className="rounded-full bg-sage text-forest">
            {categoryName}
          </Badge>
        ) : null}
        {isForeign ? (
          <Badge variant="outline" className="rounded-full text-[0.7rem] text-muted-foreground">
            {article.locale === "bn" ? m.common.languageBn : m.common.languageEn}
          </Badge>
        ) : null}
        {article.isDemo ? (
          <VerificationBadge status="demo" labels={{
            checked: m.common.verificationChecked,
            pending: m.common.verificationPending,
            demo: m.common.demoBadge,
          }} />
        ) : null}
      </div>

      <h3 className="text-pretty text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
        <Link
          href={localizePath(locale, `/articles/${article.slug}`)}
          className="outline-none after:absolute after:inset-0 focus-visible:underline"
        >
          {article.title}
        </Link>
      </h3>

      <p className="line-clamp-3 text-pretty text-base leading-relaxed text-muted-foreground">
        {article.summary}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
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
    </article>
  );
}
