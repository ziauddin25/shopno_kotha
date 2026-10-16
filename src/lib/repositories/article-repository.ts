import { articles as mockArticles } from "@/data/mock/articles";
import type { Article, Locale, SearchParams, SearchResult } from "@/types";
import { byPublishedDateDesc, withLatency } from "./shared";

const dataset = [...mockArticles];

export async function getAllArticles(): Promise<Article[]> {
  return withLatency([...dataset]);
}

export async function getPublishedArticles(locale?: Locale): Promise<Article[]> {
  const published = dataset
    .filter((article) => article.status === "published")
    .sort(byPublishedDateDesc);
  return withLatency(locale ? published.filter((a) => a.locale === locale) : published);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const featured =
    dataset
      .filter((article) => article.featured && article.status === "published")
      .sort(byPublishedDateDesc)[0] ?? null;
  return withLatency(featured);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = dataset.find((item) => item.slug === slug) ?? null;
  return withLatency(article);
}

export async function getArticlesByCategory(categoryId: string, locale?: Locale): Promise<Article[]> {
  const matches = dataset
    .filter((article) => article.categoryId === categoryId)
    .sort(byPublishedDateDesc);
  return withLatency(locale ? matches.filter((a) => a.locale === locale) : matches);
}

export async function getArticlesByIds(ids: string[]): Promise<Article[]> {
  const found = ids
    .map((id) => dataset.find((article) => article.id === id))
    .filter((article): article is Article => Boolean(article));
  return withLatency(found);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase().trim();
}

/**
 * Naive keyword search over titles, summaries and curated keywords.
 * Deliberately simple: Phase 2 moves this behind a real query engine.
 */
export async function searchArticles(params: SearchParams): Promise<SearchResult> {
  const query = normalize(params.query ?? "");
  const categoryId = params.categoryId ?? null;
  const locale = params.locale;

  let matches = dataset.filter((article) => article.status === "published");

  if (locale) matches = matches.filter((article) => article.locale === locale);
  if (categoryId) matches = matches.filter((article) => article.categoryId === categoryId);

  if (query) {
    matches = matches.filter((article) => {
      const haystack = normalize(
        [article.title, article.summary, ...article.keywords].join(" "),
      );
      return haystack.includes(query);
    });
  }

  matches.sort(byPublishedDateDesc);

  const total = matches.length;
  const limited = params.limit ? matches.slice(0, params.limit) : matches;

  return withLatency({
    items: limited,
    total,
    query: params.query ?? "",
    categoryId,
  });
}
