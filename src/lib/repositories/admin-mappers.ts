/**
 * Row → domain mappers for the CMS.
 *
 * Unlike the public mappers these preserve every staff-visible column (status
 * vocabulary, SEO fields, review state, timestamps) and never collapse values.
 */
import type { ArticleBlock } from "@/types";
import type { Tables } from "@/types/database";
import type {
  AdminArticle,
  AdminCategory,
  AdminDua,
  AdminReview,
  AdminSource,
  AdminTag,
} from "@/types/admin";

export function mapAdminArticle(row: Tables<"articles">): AdminArticle {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    summary: row.summary,
    body: (Array.isArray(row.body) ? row.body : []) as unknown as ArticleBlock[],
    categoryId: row.category_id,
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
    readingMinutes: row.reading_minutes,
    isDemo: row.is_demo,
    keywords: row.keywords ?? [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    ogImagePath: row.og_image_path,
    authorId: row.author_id,
    editorialApprovedAt: row.editorial_approved_at,
    religiousReviewStatus: row.religious_review_status,
    reviewedBy: row.reviewed_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapAdminCategory(row: Tables<"categories">): AdminCategory {
  return {
    id: row.id,
    slug: row.slug,
    icon: row.icon,
    titleBn: row.title_bn,
    titleEn: row.title_en,
    descriptionBn: row.description_bn,
    descriptionEn: row.description_en,
    sortOrder: row.sort_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAdminSource(row: Tables<"sources">): AdminSource {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    titleBn: row.title_bn,
    titleEn: row.title_en,
    citation: row.citation,
    url: row.url,
    noteBn: row.note_bn,
    noteEn: row.note_en,
    verification: row.verification,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAdminDua(row: Tables<"duas">): AdminDua {
  return {
    id: row.id,
    slug: row.slug,
    titleBn: row.title_bn,
    titleEn: row.title_en,
    occasionBn: row.occasion_bn,
    occasionEn: row.occasion_en,
    arabic: row.arabic,
    transliteration: row.transliteration,
    translationBn: row.translation_bn,
    translationEn: row.translation_en,
    status: row.status,
    verification: row.verification,
    translationIsEditorial: row.translation_is_editorial,
    isDemo: row.is_demo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAdminTag(row: Tables<"tags">): AdminTag {
  return {
    id: row.id,
    slug: row.slug,
    nameBn: row.name_bn,
    nameEn: row.name_en,
    createdAt: row.created_at,
  };
}

export function mapAdminReview(row: Tables<"article_reviews">): AdminReview {
  return {
    id: row.id,
    articleId: row.article_id,
    reviewerId: row.reviewer_id,
    reviewType: row.review_type,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
