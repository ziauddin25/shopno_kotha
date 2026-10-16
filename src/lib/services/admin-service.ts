import type { Article, ArticleStatus } from "@/types";

export const statusOrder: ArticleStatus[] = ["published", "review", "draft"];

export interface StatusCounts {
  published: number;
  review: number;
  draft: number;
  total: number;
}

export function getStatusCounts(articles: Article[]): StatusCounts {
  return {
    published: articles.filter((a) => a.status === "published").length,
    review: articles.filter((a) => a.status === "review").length,
    draft: articles.filter((a) => a.status === "draft").length,
    total: articles.length,
  };
}

export function filterByStatus(
  articles: Article[],
  status: ArticleStatus | "all",
): Article[] {
  if (status === "all") return articles;
  return articles.filter((article) => article.status === status);
}

/**
 * Simulated persistence for the admin preview. Resolves after a short delay;
 * the caller keeps the updated value in React state for the session only.
 */
export async function simulateSave<T>(value: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return value;
}

export function nextStatus(status: ArticleStatus): ArticleStatus {
  switch (status) {
    case "draft":
      return "review";
    case "review":
      return "published";
    default:
      return "published";
  }
}
