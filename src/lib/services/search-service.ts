import type { Category, Locale, SearchResult } from "@/types";
import { categoryRepository } from "@/lib/repositories";
import { searchArticles } from "@/lib/repositories/article-repository";

export type SearchState = "ok" | "error";

export interface SearchOutcome {
  result: SearchResult;
  categories: Category[];
  activeCategory: Category | null;
}

/**
 * Search orchestration. The `state=error` query flag is an interface
 * demonstration: it forces the simulated failure path so the error UI can be
 * reviewed without breaking anything else on the page.
 */
export async function runSearch(input: {
  query?: string;
  categorySlug?: string;
  locale?: Locale;
  state?: string;
}): Promise<SearchOutcome> {
  const categories = await categoryRepository.getAllCategories();
  const activeCategory = input.categorySlug
    ? (categories.find((category) => category.slug === input.categorySlug) ?? null)
    : null;

  await new Promise((resolve) => setTimeout(resolve, 240));

  if (input.state === "error") {
    throw new Error("Simulated search failure (demo state).");
  }

  const result = await searchArticles({
    query: input.query,
    locale: input.locale,
    categoryId: activeCategory?.id,
  });

  return { result, categories, activeCategory };
}
