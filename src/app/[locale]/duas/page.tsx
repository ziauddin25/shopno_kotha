import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DuaCard } from "@/components/duas/dua-card";
import { NoticeBox } from "@/components/common/notice-box";
import { Button } from "@/components/ui/button";
import { isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getDuasPageData } from "@/lib/services/article-service";
import { getMessages } from "@/messages";
import type { Locale, SourceReference } from "@/types";

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
    title: m.duas.title,
    description: m.duas.description,
    path: "/duas",
  });
}

export default async function DuasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const m = getMessages(locale);

  const { duas, sources } = await getDuasPageData();
  const sourceMap: Record<string, SourceReference> = Object.fromEntries(
    sources.map((source) => [source.id, source]),
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {m.duas.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {m.duas.description}
        </p>
      </header>

      <NoticeBox tone="warning" title={m.duas.noticeTitle} className="max-w-3xl">
        {m.duas.noticeBody}
      </NoticeBox>

      {duas.length === 0 ? (
        <NoticeBox tone="demo" title={m.duas.emptyTitle}>
          {m.duas.emptyDescription}
        </NoticeBox>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {duas.map((dua) => (
            <li key={dua.id} className="relative">
              <DuaCard dua={dua} locale={locale} sourceMap={sourceMap} />
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={localizePath(locale, "/sources")}>
            {m.dreamGuidance.ctaSources}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={localizePath(locale, "/articles/before-sleep-duas")}>
            {m.common.readMore}
          </Link>
        </Button>
      </div>
    </div>
  );
}
