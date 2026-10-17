export const locales = ["bn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export type LocalizedText = {
  bn: string;
  en: string;
};

export type ArticleStatus = "draft" | "review" | "published";

/**
 * How confident the editorial team is about a religious claim.
 *
 * - `checked`    – text and citation were matched against a public source
 *                  (sunnah.com / alquran.cloud) during Phase 1 authoring.
 * - `pending`    – the claim is plausible but the citation or wording still
 *                  needs a second check before it may be published as final.
 * - `demo`       – placeholder content used only to exercise the UI. It must
 *                  never be presented as authentic scripture or scholarship.
 */
export type VerificationStatus = "checked" | "pending" | "demo";

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "arabic";
      text: string;
      transliteration?: string;
      translation?: string;
      sourceId?: string;
    }
  | { type: "note"; text: string };

export interface Article {
  id: string;
  slug: string;
  /** Language the article body is written in. Never machine-translated. */
  locale: Locale;
  title: string;
  summary: string;
  body: ArticleBlock[];
  categoryId: string;
  keywords: string[];
  status: ArticleStatus;
  featured: boolean;
  /** ISO date (yyyy-mm-dd) or null for unpublished drafts. */
  publishedAt: string | null;
  readingMinutes: number;
  sourceIds: string[];
  relatedArticleIds: string[];
  /** True when the copy is placeholder text written for the demo dataset. */
  isDemo: boolean;
  /** Always null in Phase 1 – no scholar has reviewed this dataset. */
  reviewedBy: string | null;
}

export interface Category {
  id: string;
  slug: string;
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  order: number;
}

export type SourceType = "quran" | "hadith" | "scholarly" | "editorial" | "cultural";

export interface SourceReference {
  id: string;
  title: LocalizedText;
  type: SourceType;
  /** Short citation shown to readers, e.g. "Sahih al-Bukhari 6986". */
  citation: string | null;
  /** Verified public link when one is known. */
  url: string | null;
  note: LocalizedText;
  verification: VerificationStatus;
}

export interface Dua {
  id: string;
  slug: string;
  title: LocalizedText;
  occasion: LocalizedText;
  arabic: string;
  transliteration: string;
  translation: LocalizedText;
  sourceIds: string[];
  verification: VerificationStatus;
  /** Bengali meaning is an editorial rendering until a reviewer signs off. */
  translationIsEditorial: boolean;
  isDemo: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  name: LocalizedText;
}

export interface SearchParams {
  query?: string;
  locale?: Locale;
  categoryId?: string;
  limit?: number;
  /** 1-based. Only meaningful together with `pageSize`. */
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  items: Article[];
  total: number;
  query: string;
  categoryId: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * One surface form a reader might type for a dream topic. `isRomanised` marks
 * Banglish renderings ("kharap shopno") that have no single script to match on.
 */
export interface DreamTopicAlias {
  text: string;
  locale: Locale;
  isRomanized: boolean;
}

/**
 * A searchable dream concept ("disturbing dream", "types of dreams") with the
 * published content that addresses it. Assembled by the repository layer; the
 * search service ranks and hydrates it into reader-facing results.
 */
export interface DreamTopic {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  categoryId: string | null;
  aliases: DreamTopicAlias[];
  articleIds: string[];
  duaIds: string[];
  sourceIds: string[];
  isDemo: boolean;
}

/**
 * Strength of the evidence a topic leans on, derived from its linked
 * `sources.type`. It is deliberately coarse: it tells a reader whether a topic
 * rests on scripture, scholarly interpretation or general educational copy —
 * never that a dream has a fixed meaning.
 */
export type DreamEvidenceTier = "scripture" | "scholarly" | "educational";
