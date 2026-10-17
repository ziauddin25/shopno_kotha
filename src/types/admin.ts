/**
 * Types for the staff content-management (CMS) area.
 *
 * These intentionally mirror the database rows rather than the lossy public
 * projections in `@/types`: the CMS must see drafts, archived rows, SEO fields,
 * timestamps and the religious-review columns that public readers never do.
 * `article_status` therefore keeps the database vocabulary (`in_review`, not
 * the public `review`), so the workflow graph matches the SQL trigger exactly.
 */
import type { ArticleBlock, Locale } from "@/types";

export type UserRole = "admin" | "editor" | "reviewer";

export type DbArticleStatus = "draft" | "in_review" | "published" | "archived";

export type DbDuaStatus = "draft" | "published";

export type DbCategoryStatus = "draft" | "published";

export type VerificationStatus = "checked" | "pending" | "demo";

export type SourceType = "quran" | "hadith" | "scholarly" | "editorial" | "cultural";

export type ReligiousReviewStatus = "none" | "pending" | "approved";

export type ReviewStatus = "pending" | "approved" | "changes_requested";

export type ReviewType = "editorial" | "religious";

export interface AdminArticle {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  body: ArticleBlock[];
  categoryId: string | null;
  status: DbArticleStatus;
  featured: boolean;
  /** ISO timestamp or null while unpublished. */
  publishedAt: string | null;
  readingMinutes: number;
  isDemo: boolean;
  keywords: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImagePath: string | null;
  authorId: string | null;
  editorialApprovedAt: string | null;
  religiousReviewStatus: ReligiousReviewStatus;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminCategory {
  id: string;
  slug: string;
  icon: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  sortOrder: number;
  status: DbCategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSource {
  id: string;
  slug: string;
  type: SourceType;
  titleBn: string;
  titleEn: string;
  citation: string | null;
  url: string | null;
  noteBn: string;
  noteEn: string;
  verification: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDua {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  occasionBn: string;
  occasionEn: string;
  arabic: string;
  transliteration: string;
  translationBn: string;
  translationEn: string;
  status: DbDuaStatus;
  verification: VerificationStatus;
  translationIsEditorial: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTag {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  createdAt: string;
}

export interface AdminReview {
  id: string;
  articleId: string;
  reviewerId: string | null;
  reviewType: ReviewType;
  status: ReviewStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
