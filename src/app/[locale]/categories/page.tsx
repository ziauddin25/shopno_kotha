import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/categories/category-grid";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getCategoryOverview } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

// Reads uncached repository data (the mock data source is intentionally not
// cache-wrapped), so this route blocks on the server instead of prerendering a
// static shell. See the cache-components migration guide.
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return pageMetadata({
    locale,
    title: m.categories.title,
    description: m.categories.description,
    path: "/categories",
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const m = getMessages(locale);

  const categories = await getCategoryOverview();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {m.categories.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {m.categories.description}
        </p>
      </header>

      <CategoryGrid categories={categories} locale={locale} />
    </div>
  );
}
