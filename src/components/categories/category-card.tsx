import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/common/category-icon";
import { localizePath } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { getMessages } from "@/messages";
import type { Category, Locale } from "@/types";

export function CategoryCard({
  category,
  locale,
  articleCount,
  latest,
}: {
  category: Category;
  locale: Locale;
  articleCount?: number;
  latest?: string | null;
}) {
  const m = getMessages(locale);

  return (
    <Link
      href={localizePath(locale, `/categories/${category.slug}`)}
      className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-forest/30"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-sage text-forest">
        <CategoryIcon name={category.icon} />
      </span>
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {category.title[locale]}
      </h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {category.description[locale]}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-1 text-xs text-muted-foreground">
        {typeof articleCount === "number" ? (
          <span>
            {formatNumber(articleCount, locale)} {m.categories.articleCount}
          </span>
        ) : null}
        <ArrowRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
