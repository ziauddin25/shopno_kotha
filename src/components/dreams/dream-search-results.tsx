import Link from "next/link";
import { BookOpen, FileText, Moon } from "lucide-react";
import { DuaCard } from "@/components/duas/dua-card";
import { EmptyState } from "@/components/common/empty-state";
import { NoticeBox } from "@/components/common/notice-box";
import { VerificationBadge } from "@/components/common/verification-badge";
import { formatNumber } from "@/lib/format";
import { localizePath } from "@/lib/i18n";
import { sourceTypeLabel } from "@/lib/source-labels";
import { getDreamTopicCatalog, searchDreams, type DreamTopicMatch } from "@/lib/services/dream-search-service";
import { getMessages } from "@/messages";
import type { DreamEvidenceTier, DreamTopic, Locale } from "@/types";

function evidenceLabel(tier: DreamEvidenceTier, locale: Locale): string {
  const d = getMessages(locale).dreamSearch;
  switch (tier) {
    case "scripture":
      return d.evidenceScripture;
    case "scholarly":
      return d.evidenceScholarly;
    case "educational":
    default:
      return d.evidenceEducational;
  }
}

function topicSearchHref(topic: DreamTopic, locale: Locale): string {
  const base = localizePath(locale, "/search");
  return `${base}?q=${encodeURIComponent(topic.title[locale])}`;
}

/** A compact, link-based grid of every published topic (used for browse + empty states). */
export function DreamTopicBrowser({
  topics,
  locale,
  heading,
}: {
  topics: DreamTopic[];
  locale: Locale;
  heading: string;
}) {
  if (topics.length === 0) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{heading}</h2>
      <ul className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              href={topicSearchHref(topic, locale)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-forest/30 hover:text-forest"
            >
              <Moon className="size-3.5 text-forest" aria-hidden />
              {topic.title[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MatchCard({ match, locale }: { match: DreamTopicMatch; locale: Locale }) {
  const m = getMessages(locale);
  const d = m.dreamSearch;
  const { topic, articles, duas, sources, evidenceTier, matchedOn } = match;
  const sourceMap = Object.fromEntries(sources.map((source) => [source.id, source]));

  return (
    <article className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3 py-1 text-xs font-medium text-forest">
            <BookOpen className="size-3.5" aria-hidden />
            {evidenceLabel(evidenceTier, locale)}
          </span>
          <span className="text-xs text-muted-foreground">{d.evidenceLabel}</span>
        </div>
        <h3 className="text-pretty text-lg font-semibold tracking-tight text-foreground">
          {topic.title[locale]}
        </h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {topic.summary[locale]}
        </p>
        {matchedOn ? (
          <p className="text-xs text-muted-foreground">
            {d.matchLabel}: <span className="text-foreground/80">“{matchedOn}”</span>
          </p>
        ) : null}
      </header>

      {articles.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {d.relatedArticles}
          </h4>
          <ul className="space-y-1.5">
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={localizePath(locale, `/articles/${article.slug}`)}
                  className="inline-flex items-start gap-2 text-sm text-foreground/85 transition-colors hover:text-forest"
                >
                  <FileText className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden />
                  <span className="underline decoration-dotted underline-offset-3">
                    {article.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {duas.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {d.relatedDuas}
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {duas.map((dua) => (
              <DuaCard key={dua.id} dua={dua} locale={locale} sourceMap={sourceMap} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{d.duaDisclaimer}</p>
        </div>
      ) : null}

      {sources.length > 0 ? (
        <div className="space-y-2 border-t border-border/70 pt-4">
          <h4 className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {m.common.sources}
          </h4>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            {sources.map((source) => (
              <li key={source.id} className="inline-flex items-center gap-2">
                <span className="sr-only">{sourceTypeLabel(m, source.type)}</span>
                <VerificationBadge
                  status={source.verification}
                  labels={{
                    checked: m.common.verificationChecked,
                    pending: m.common.verificationPending,
                    demo: m.common.verificationDemo,
                  }}
                />
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest underline decoration-dotted underline-offset-3"
                  >
                    {source.citation ?? source.title[locale]}
                  </a>
                ) : (
                  <span>{source.citation ?? source.title[locale]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

/**
 * Renders dream-topic matches for a free-text description. It fails soft: a
 * data error shows an inline notice rather than taking down the surrounding
 * article search, and an unmatched description points at the topic browser
 * instead of guessing.
 */
export async function DreamSearchResults({
  query,
  locale,
}: {
  query?: string;
  locale: Locale;
}) {
  const m = getMessages(locale);
  const d = m.dreamSearch;
  const trimmed = query?.trim();
  if (!trimmed) return null;

  let results;
  try {
    results = await searchDreams({ query: trimmed, locale });
  } catch {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{d.resultsHeading}</h2>
        <NoticeBox tone="warning" title={d.errorTitle}>
          {d.errorDescription}
        </NoticeBox>
      </section>
    );
  }

  if (results.matches.length === 0) {
    let topics: DreamTopic[] = [];
    try {
      topics = await getDreamTopicCatalog();
    } catch {
      topics = [];
    }

    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{d.resultsHeading}</h2>
        <EmptyState title={d.emptyTitle} description={d.emptyDescription} />
        <DreamTopicBrowser topics={topics} locale={locale} heading={d.browseHeading} />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{d.resultsHeading}</h2>
        <p className="text-sm text-muted-foreground">
          {formatNumber(results.total, locale)} {d.resultsTopicSuffix}
        </p>
      </div>
      <ul className="space-y-5">
        {results.matches.map((match) => (
          <li key={match.topic.id}>
            <MatchCard match={match} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
