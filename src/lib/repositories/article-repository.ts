import { cacheLife, cacheTag } from "next/cache";
import { articles as mockArticles } from "@/data/mock/articles";
import { createPublicClient } from "@/lib/supabase/public";
import type { Article, Locale, SearchParams, SearchResult } from "@/types";
import { resolveDataSource } from "./data-source";
import { databaseError } from "./errors";
import { mapArticle, toIsoDate } from "./mappers";
import {
  byPublishedDateDesc,
  normalizePage,
  pagedResult,
  paginate,
  sanitizeSearchTerm,
  toArrayLiteralElement,
  toRange,
  withLatency,
  type PagedResult,
} from "./shared";
import {
  articleQuerySchema,
  idListSchema,
  parseInput,
  searchInputSchema,
  slugSchema,
  type ArticleQuery,
} from "./validation";

export type { ArticleQuery } from "./validation";

const dataset = [...mockArticles];

export interface ArticleFact {
  id: string;
  categoryId: string;
  publishedAt: string | null;
}

/* -------------------------------------------------------------------------- */
/* Fixtures                                                                   */
/* -------------------------------------------------------------------------- */

function mockMatches(query: ArticleQuery): Article[] {
  const term = query.search?.trim() ? sanitizeSearchTerm(query.search) : null;

  let rows = dataset.filter((article) => article.status === "published");

  if (query.locale) rows = rows.filter((article) => article.locale === query.locale);
  if (query.categoryId) rows = rows.filter((article) => article.categoryId === query.categoryId);
  if (query.featured !== undefined) rows = rows.filter((article) => article.featured === query.featured);

  if (term !== null) {
    const needle = term.toLocaleLowerCase();
    rows = needle
      ? rows.filter((article) =>
          [article.title, article.summary, ...article.keywords]
            .join(" ")
            .toLocaleLowerCase()
            .includes(needle),
        )
      : [];
  }

  rows.sort(
    query.orderBy === "published-asc"
      ? (a, b) => byPublishedDateDesc(b, a)
      : byPublishedDateDesc,
  );

  return rows;
}

function mockFacts(): ArticleFact[] {
  return dataset
    .filter((article) => article.status === "published")
    .map((article) => ({
      id: article.id,
      categoryId: article.categoryId,
      publishedAt: article.publishedAt,
    }))
    .sort(byPublishedDateDesc);
}

/* -------------------------------------------------------------------------- */
/* Supabase                                                                   */
/* -------------------------------------------------------------------------- */

interface ArticleRelations {
  sources: Map<string, string[]>;
  related: Map<string, string[]>;
}

async function supabaseRelations(articleIds: string[]): Promise<ArticleRelations> {
  const relations: ArticleRelations = { sources: new Map(), related: new Map() };
  if (articleIds.length === 0) return relations;

  const supabase = createPublicClient();

  const [sources, related] = await Promise.all([
    supabase
      .from("article_sources")
      .select("article_id, source_id, position")
      .in("article_id", articleIds)
      .order("position"),
    supabase
      .from("article_related")
      .select("article_id, related_article_id, position")
      .in("article_id", articleIds)
      .order("position"),
  ]);

  if (sources.error) throw databaseError("article_sources", sources.error.message, sources.error);
  if (related.error) throw databaseError("article_related", related.error.message, related.error);

  for (const row of sources.data ?? []) {
    const list = relations.sources.get(row.article_id);
    if (list) list.push(row.source_id);
    else relations.sources.set(row.article_id, [row.source_id]);
  }
  for (const row of related.data ?? []) {
    const list = relations.related.get(row.article_id);
    if (list) list.push(row.related_article_id);
    else relations.related.set(row.article_id, [row.related_article_id]);
  }

  return relations;
}

async function supabaseList(query: ArticleQuery): Promise<PagedResult<Article>> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  const supabase = createPublicClient();

  let builder = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .is("deleted_at", null);

  if (query.locale) builder = builder.eq("locale", query.locale);
  if (query.categoryId) builder = builder.eq("category_id", query.categoryId);
  if (query.featured !== undefined) builder = builder.eq("featured", query.featured);

  if (query.search?.trim()) {
    const term = sanitizeSearchTerm(query.search);
    if (!term) return pagedResult([], 0, query.page, query.pageSize);
    const pattern = `%${term}%`;
    // title/summary use a substring match; keywords is a curated array, so it is
    // matched as one quoted element (`cs.{"..."}`) — unquoted, a Bengali or
    // multi-word phrase would be misparsed as array grammar.
    builder = builder.or(
      `title.ilike.${pattern},summary.ilike.${pattern},keywords.cs.{${toArrayLiteralElement(term)}}`,
    );
  }

  const ordered = builder.order("published_at", {
    ascending: query.orderBy === "published-asc",
    nullsFirst: false,
  });

  const page = normalizePage(query.page);
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 0;
  const { from, to } = toRange(page, pageSize > 0 ? pageSize : 1);
  const response = pageSize > 0 ? await ordered.range(from, to) : await ordered;

  if (response.error) throw databaseError("articles", response.error.message, response.error);

  const items = (response.data ?? []).map((row) => mapArticle(row));
  return pagedResult(items, response.count ?? items.length, query.page, query.pageSize);
}

async function supabaseGetArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles", `article:${slug}`);

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw databaseError("articles", error.message, error);
  if (!data) return null;

  const relations = await supabaseRelations([data.id]);
  return mapArticle(data, {
    sourceIds: relations.sources.get(data.id) ?? [],
    relatedArticleIds: relations.related.get(data.id) ?? [],
  });
}

async function supabaseGetArticlesByIds(ids: string[]): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  const parsed = parseInput(idListSchema, ids, "articles.byId");
  if (parsed.length === 0) return [];

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .in("id", parsed)
    .eq("status", "published")
    .is("deleted_at", null);

  if (error) throw databaseError("articles", error.message, error);

  const byId = new Map((data ?? []).map((row) => [row.id, mapArticle(row)]));
  return parsed
    .map((id) => byId.get(id))
    .filter((article): article is Article => Boolean(article));
}

async function supabaseFacts(): Promise<ArticleFact[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, category_id, published_at")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw databaseError("articles", error.message, error);

  return (data ?? []).map((row) => ({
    id: row.id,
    categoryId: row.category_id ?? "",
    publishedAt: toIsoDate(row.published_at),
  }));
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Published articles, optionally filtered and paginated. The database is the
 * authority: drafts, archived rows and soft-deleted rows never leave it.
 */
export async function listPublishedArticles(query: ArticleQuery = {}): Promise<PagedResult<Article>> {
  const parsed = parseInput(articleQuerySchema, query, "articles.list");

  if (resolveDataSource() === "mock") {
    return withLatency(paginate(mockMatches(parsed), parsed.page, parsed.pageSize));
  }

  return supabaseList(parsed);
}

/**
 * Every article the current data source can see. Fixtures return drafts too;
 * the database is limited to published rows by Row Level Security, which is
 * exactly what `generateStaticParams` and published-only counters want.
 */
export async function getAllArticles(): Promise<Article[]> {
  if (resolveDataSource() === "mock") return withLatency([...dataset]);
  const result = await supabaseList({});
  return result.items;
}

export async function getPublishedArticles(locale?: Locale): Promise<Article[]> {
  const result = await listPublishedArticles({ locale });
  return result.items;
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const result = await listPublishedArticles({ featured: true, pageSize: 1 });
  return result.items[0] ?? null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return null;

  if (resolveDataSource() === "mock") {
    const article = dataset.find((item) => item.slug === parsed.data) ?? null;
    return withLatency(article);
  }

  return supabaseGetArticleBySlug(parsed.data);
}

export async function getArticlesByCategory(categoryId: string, locale?: Locale): Promise<Article[]> {
  const result = await listPublishedArticles({ categoryId, locale });
  return result.items;
}

export async function getArticlesByIds(ids: string[]): Promise<Article[]> {
  const parsed = parseInput(idListSchema, ids, "articles.byId");
  if (parsed.length === 0) return [];

  if (resolveDataSource() === "mock") {
    const found = parsed
      .map((id) => dataset.find((article) => article.id === id))
      .filter(
        (article): article is Article =>
          article !== undefined && article.status === "published",
      );
    return withLatency(found);
  }

  return supabaseGetArticlesByIds(parsed);
}

/**
 * Narrow projection (id, category, date) used for category counters and the
 * "latest" badge – avoids pulling article bodies just to count them.
 */
export async function getPublishedArticleFacts(): Promise<ArticleFact[]> {
  if (resolveDataSource() === "mock") return withLatency(mockFacts());
  return supabaseFacts();
}

/**
 * Keyword search over title, summary and curated keywords, filtered to the
 * published set and paginated in the database.
 */
export async function searchArticles(params: SearchParams): Promise<SearchResult> {
  const input = parseInput(
    searchInputSchema,
    { ...params, query: params.query?.slice(0, 200) },
    "articles.search",
  );

  const result = await listPublishedArticles({
    search: input.query,
    locale: input.locale,
    categoryId: input.categoryId,
    page: input.page,
    pageSize: input.pageSize ?? input.limit,
  });

  return {
    items: result.items,
    total: result.total,
    query: params.query ?? "",
    categoryId: input.categoryId ?? null,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: result.totalPages,
  };
}
