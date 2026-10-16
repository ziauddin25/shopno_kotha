import type { Article, Category, Locale, SourceReference } from "@/types";
import {
  articleRepository,
  categoryRepository,
  duaRepository,
  sourceRepository,
} from "@/lib/repositories";

export interface HomePageData {
  featured: Article | null;
  latest: Article[];
  categories: (Category & { articleCount: number })[];
}

export async function getHomePageData(): Promise<HomePageData> {
  const [featured, published, categories, all] = await Promise.all([
    articleRepository.getFeaturedArticle(),
    articleRepository.getPublishedArticles(),
    categoryRepository.getAllCategories(),
    articleRepository.getAllArticles(),
  ]);

  const latest = published.filter((article) => article.id !== featured?.id).slice(0, 4);

  const withCounts = categories.map((category) => ({
    ...category,
    articleCount: all.filter(
      (article) => article.categoryId === category.id && article.status === "published",
    ).length,
  }));

  return { featured, latest, categories: withCounts };
}

export interface ArticleIndexData {
  articles: Article[];
  categories: Category[];
  activeCategory: Category | null;
}

export async function getArticleIndexData(categorySlug?: string): Promise<ArticleIndexData> {
  const categories = await categoryRepository.getAllCategories();
  const activeCategory = categorySlug
    ? (categories.find((category) => category.slug === categorySlug) ?? null)
    : null;

  const articles = activeCategory
    ? await articleRepository.getArticlesByCategory(activeCategory.id)
    : await articleRepository.getPublishedArticles();

  const published = articles.filter((article) => article.status === "published");

  return { articles: published, categories, activeCategory };
}

export interface ArticleDetailData {
  article: Article;
  category: Category | null;
  sources: SourceReference[];
  related: Article[];
}

export async function getArticleDetailData(
  slug: string,
): Promise<ArticleDetailData | null> {
  const article = await articleRepository.getArticleBySlug(slug);
  if (!article || article.status !== "published") return null;

  const [categories, sources, related] = await Promise.all([
    categoryRepository.getAllCategories(),
    sourceRepository.getSourcesByIds(article.sourceIds),
    articleRepository.getArticlesByIds(article.relatedArticleIds),
  ]);

  return {
    article,
    category: categories.find((item) => item.id === article.categoryId) ?? null,
    sources,
    related: related.filter((item) => item.status === "published"),
  };
}

export interface CategoryOverviewItem extends Category {
  articleCount: number;
  latest: string | null;
}

export async function getCategoryOverview(): Promise<CategoryOverviewItem[]> {
  const [categories, all] = await Promise.all([
    categoryRepository.getAllCategories(),
    articleRepository.getAllArticles(),
  ]);

  return categories.map((category) => {
    const published = all
      .filter((article) => article.categoryId === category.id && article.status === "published")
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    return {
      ...category,
      articleCount: published.length,
      latest: published[0]?.publishedAt ?? null,
    };
  });
}

export interface CategoryDetailData {
  category: Category;
  articles: Article[];
}

export async function getCategoryDetailData(
  slug: string,
): Promise<CategoryDetailData | null> {
  const category = await categoryRepository.getCategoryBySlug(slug);
  if (!category) return null;

  const articles = (
    await articleRepository.getArticlesByCategory(category.id)
  ).filter((article) => article.status === "published");

  return { category, articles };
}

export interface DuasPageData {
  duas: Awaited<ReturnType<typeof duaRepository.getAllDuas>>;
  sources: SourceReference[];
}

export async function getDuasPageData(): Promise<DuasPageData> {
  const duas = await duaRepository.getAllDuas();
  const allSourceIds = Array.from(new Set(duas.flatMap((dua) => dua.sourceIds)));
  const sources = await sourceRepository.getSourcesByIds(allSourceIds);
  return { duas, sources };
}

export async function getSourcesPageData(): Promise<SourceReference[]> {
  return sourceRepository.getAllSources();
}

export async function getRelatedArticlesForLocale(
  article: Article,
  locale: Locale,
): Promise<Article[]> {
  const related = await articleRepository.getArticlesByIds(article.relatedArticleIds);
  return related
    .filter((item) => item.status === "published" && item.locale === locale)
    .slice(0, 3);
}
