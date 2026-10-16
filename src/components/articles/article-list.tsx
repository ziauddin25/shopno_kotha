import { ArticleCard } from "./article-card";
import { EmptyState } from "@/components/common/empty-state";
import { getMessages } from "@/messages";
import type { Article, Locale } from "@/types";

export function ArticleList({
  articles,
  locale,
  categoryNames = {},
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
}: {
  articles: Article[];
  locale: Locale;
  categoryNames?: Record<string, string>;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
}) {
  const m = getMessages(locale);

  if (articles.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? m.common.emptyTitle}
        description={emptyDescription ?? m.common.emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <ul className={className ?? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
      {articles.map((article) => (
        <li key={article.id} className="relative">
          <ArticleCard
            article={article}
            locale={locale}
            categoryName={categoryNames[article.categoryId]}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}
