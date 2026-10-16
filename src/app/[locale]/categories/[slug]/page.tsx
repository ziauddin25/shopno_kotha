import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleList } from "@/components/articles/article-list";
import { CategoryIcon } from "@/components/common/category-icon";
import { localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getCategoryDetailData } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== "bn" && locale !== "en") return {};
  const data = await getCategoryDetailData(slug);
  if (!data) return {};
  return pageMetadata({
    locale,
    title: data.category.title[locale],
    description: data.category.description[locale],
    path: `/categories/${slug}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (rawLocale !== "bn" && rawLocale !== "en") notFound();
  const locale = rawLocale as Locale;

  const data = await getCategoryDetailData(slug);
  if (!data) notFound();

  const m = getMessages(locale);
  const { category, articles } = data;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href={localizePath(locale, "/categories")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {m.categories.title}
      </Link>

      <header className="max-w-2xl space-y-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-sage text-forest">
          <CategoryIcon name={category.icon} className="size-5.5" />
        </span>
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {category.title[locale]}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {category.description[locale]}
        </p>
      </header>

      <ArticleList
        articles={articles}
        locale={locale}
        emptyTitle={m.common.emptyTitle}
        emptyDescription={m.categories.emptyDescription}
      />
    </div>
  );
}
