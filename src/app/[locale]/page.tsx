import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/articles/article-list";
import { FeaturedArticle } from "@/components/articles/featured-article";
import { CategoryGrid } from "@/components/categories/category-grid";
import { SectionHeading } from "@/components/common/section-heading";
import { EditorialTrustSection } from "@/components/home/editorial-trust-section";
import { GuidanceCards } from "@/components/home/guidance-cards";
import { HomeHero } from "@/components/home/home-hero";
import { Button } from "@/components/ui/button";
import { isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getHomePageData } from "@/lib/services/article-service";
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
    title: m.meta.siteNameFull,
    description: m.meta.description,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const m = getMessages(locale);
  const { featured, latest, categories } = await getHomePageData();

  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.id, category.title[locale]]),
  );

  return (
    <>
      <HomeHero locale={locale} />

      <div className="mx-auto w-full max-w-6xl space-y-20 px-4 py-12 sm:px-6 sm:py-20">
        {featured ? (
          <section className="space-y-5" aria-labelledby="featured-heading">
            <SectionHeading
              eyebrow={m.home.featuredLabel}
              title={m.home.featuredTitle}
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link href={localizePath(locale, "/islamic-dreams")}>
                    {m.common.viewAll}
                  </Link>
                </Button>
              }
            />
            <FeaturedArticle
              article={featured}
              locale={locale}
              categoryName={categoryNames[featured.categoryId]}
            />
          </section>
        ) : null}

        <section className="space-y-5">
          <SectionHeading
            title={m.home.guidanceTitle}
            description={m.home.guidanceDescription}
          />
          <GuidanceCards locale={locale} />
        </section>

        <section className="space-y-5">
          <SectionHeading
            title={m.home.categoriesTitle}
            description={m.home.categoriesDescription}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href={localizePath(locale, "/categories")}>{m.common.viewAll}</Link>
              </Button>
            }
          />
          <CategoryGrid categories={categories} locale={locale} />
        </section>

        <section className="space-y-5">
          <SectionHeading
            title={m.home.latestTitle}
            description={m.home.latestDescription}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href={localizePath(locale, "/islamic-dreams")}>
                  {m.common.viewAll}
                </Link>
              </Button>
            }
          />
          <ArticleList articles={latest} locale={locale} categoryNames={categoryNames} />
        </section>

        <EditorialTrustSection locale={locale} />
      </div>
    </>
  );
}
