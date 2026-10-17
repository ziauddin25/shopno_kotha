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
}: {
  category: Category;
  locale: Locale;
  articleCount?: number;
}) {
  const m = getMessages(locale);

  const categoryHref = localizePath(locale, `/categories/${category.slug}`);

  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <span className="flex size-10 items-center justify-center rounded-lg bg-sage text-forest">
        <CategoryIcon name={category.icon} />
      </span>
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        <Link href={categoryHref} className="inline cursor-pointer rounded-sm underline-offset-4 hover:text-forest hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {category.title[locale]}
        </Link>
      </h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {category.description[locale]}
      </p>
      <span className="mt-auto inline-flex w-fit pt-1 text-xs text-muted-foreground">
        {typeof articleCount === "number" ? (
          <Link href={categoryHref} className="inline-flex w-fit items-center gap-2 rounded-sm cursor-pointer hover:text-forest hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span>
              {formatNumber(articleCount, locale)}
            </span>
            <span>{m.categories.articleCount}</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        ) : null}
      </span>
    </article>
  );
}
