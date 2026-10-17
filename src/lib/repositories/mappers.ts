/**
 * Row → domain mappers.
 *
 * Database rows are never handed to the UI: they are converted here once so
 * that every consumer sees the stable application types from `@/types`.
 *
 * Notable conversions:
 *   * `published_at` is a timestamptz, the app expects `yyyy-mm-dd`.
 *   * `article_status` has an `in_review` value the app calls `review`.
 *   * `title_bn`/`title_en` pairs collapse into the existing `LocalizedText`.
 */
import type { Article, ArticleBlock, ArticleStatus, Category, Dua, SourceReference, Tag } from "@/types";
import type { Enums, Tables } from "@/types/database";

/** `2026-10-17T09:00:00+00:00` → `2026-10-17`; null in, null out. */
export function toIsoDate(value: string | null): string | null {
  if (!value) return null;
  const [date] = value.split("T");
  return date.slice(0, 10);
}

function toArticleBlocks(body: Tables<"articles">["body"]): ArticleBlock[] {
  if (!Array.isArray(body)) return [];
  return body as unknown as ArticleBlock[];
}

export function mapArticleStatus(status: Enums<"article_status">): ArticleStatus {
  switch (status) {
    case "published":
      return "published";
    case "in_review":
      return "review";
    case "archived":
      // The application has no archived state; archived rows are excluded from
      // every public query, so this mapping is only reachable for staff-owned
      // data that the public layer never returns.
      return "draft";
    case "draft":
    default:
      return "draft";
  }
}

export function mapArticle(
  row: Tables<"articles">,
  relations: { sourceIds?: string[]; relatedArticleIds?: string[] } = {},
): Article {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    summary: row.summary,
    body: toArticleBlocks(row.body),
    categoryId: row.category_id ?? "",
    keywords: row.keywords ?? [],
    status: mapArticleStatus(row.status),
    featured: row.featured,
    publishedAt: toIsoDate(row.published_at),
    readingMinutes: row.reading_minutes,
    sourceIds: relations.sourceIds ?? [],
    relatedArticleIds: relations.relatedArticleIds ?? [],
    isDemo: row.is_demo,
    reviewedBy: row.reviewed_by,
  };
}

export function mapCategory(row: Tables<"categories">): Category {
  return {
    id: row.id,
    slug: row.slug,
    icon: row.icon,
    title: { bn: row.title_bn, en: row.title_en },
    description: { bn: row.description_bn, en: row.description_en },
    order: row.sort_order,
  };
}

export function mapSource(row: Tables<"sources">): SourceReference {
  return {
    id: row.id,
    title: { bn: row.title_bn, en: row.title_en },
    type: row.type,
    citation: row.citation,
    url: row.url,
    note: { bn: row.note_bn, en: row.note_en },
    verification: row.verification,
  };
}

export function mapDua(row: Tables<"duas">, sourceIds: string[]): Dua {
  return {
    id: row.id,
    slug: row.slug,
    title: { bn: row.title_bn, en: row.title_en },
    occasion: { bn: row.occasion_bn, en: row.occasion_en },
    arabic: row.arabic,
    transliteration: row.transliteration,
    translation: { bn: row.translation_bn, en: row.translation_en },
    sourceIds,
    verification: row.verification,
    translationIsEditorial: row.translation_is_editorial,
    isDemo: row.is_demo,
  };
}

export function mapTag(row: Tables<"tags">): Tag {
  return {
    id: row.id,
    slug: row.slug,
    name: { bn: row.name_bn, en: row.name_en },
  };
}
