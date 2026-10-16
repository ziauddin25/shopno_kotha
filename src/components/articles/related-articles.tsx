import { ArticleList } from "./article-list";
import { getMessages } from "@/messages";
import type { Article, Locale } from "@/types";

export function RelatedArticles({
  articles,
  locale,
  categoryNames,
}: {
  articles: Article[];
  locale: Locale;
  categoryNames?: Record<string, string>;
}) {
  if (articles.length === 0) return null;
  const m = getMessages(locale);

  return (
    <section className="space-y-5" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
      >
        {m.article.relatedHeading}
      </h2>
      <ArticleList articles={articles} locale={locale} categoryNames={categoryNames} />
    </section>
  );
}
