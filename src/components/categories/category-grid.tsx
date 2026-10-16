import { CategoryCard } from "./category-card";
import type { Category, Locale } from "@/types";

export function CategoryGrid({
  categories,
  locale,
  counts = {},
}: {
  categories: (Category & { articleCount?: number; latest?: string | null })[];
  locale: Locale;
  counts?: Record<string, number>;
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard
            category={category}
            locale={locale}
            articleCount={category.articleCount ?? counts[category.id]}
            latest={category.latest}
          />
        </li>
      ))}
    </ul>
  );
}
