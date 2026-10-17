/**
 * Zod schemas for CMS input.
 *
 * The same schema validates a form submission in a Server Action and the object
 * the repository hands to PostgREST, so a field can never be validated one way
 * and written another. Nullable columns accept an empty string from the form
 * and are normalised to `null` by the repository, not here.
 */
import { z } from "zod";

export const adminSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens (for example: understanding-dreams).",
  );

export const adminIdSchema = z.uuid();

/* -------------------------------------------------------------------------- */
/* Article body                                                              */
/* -------------------------------------------------------------------------- */

const paragraphBlock = z.object({
  type: z.literal("paragraph"),
  text: z.string(),
});

const headingBlock = z.object({
  type: z.literal("heading"),
  level: z.union([z.literal(2), z.literal(3)]),
  text: z.string(),
});

const listBlock = z.object({
  type: z.literal("list"),
  items: z.array(z.string()),
  ordered: z.boolean().optional(),
});

const quoteBlock = z.object({
  type: z.literal("quote"),
  text: z.string(),
  attribution: z.string().optional(),
});

const arabicBlock = z.object({
  type: z.literal("arabic"),
  text: z.string(),
  transliteration: z.string().optional(),
  translation: z.string().optional(),
  sourceId: z.string().optional(),
});

const noteBlock = z.object({
  type: z.literal("note"),
  text: z.string(),
});

export const articleBlockSchema = z.discriminatedUnion("type", [
  paragraphBlock,
  headingBlock,
  listBlock,
  quoteBlock,
  arabicBlock,
  noteBlock,
]);

export const articleBodySchema = z.array(articleBlockSchema);

/* -------------------------------------------------------------------------- */
/* Article                                                                   */
/* -------------------------------------------------------------------------- */

export const articleInputSchema = z.object({
  slug: adminSlugSchema,
  locale: z.enum(["bn", "en"]),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(600).default(""),
  body: articleBodySchema.default([]),
  categoryId: z.uuid().nullable().default(null),
  featured: z.boolean().default(false),
  readingMinutes: z.number().int().min(1).max(120).default(1),
  isDemo: z.boolean().default(false),
  keywords: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  seoTitle: z.string().trim().max(200).default(""),
  seoDescription: z.string().trim().max(300).default(""),
  ogImagePath: z.string().trim().max(300).default(""),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

export const articleStatusSchema = z.enum([
  "draft",
  "in_review",
  "published",
  "archived",
]);

export const duaStatusSchema = z.enum(["draft", "published"]);

/* -------------------------------------------------------------------------- */
/* Category                                                                  */
/* -------------------------------------------------------------------------- */

export const categoryInputSchema = z.object({
  slug: adminSlugSchema,
  icon: z.string().trim().max(80).default(""),
  titleBn: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  descriptionBn: z.string().trim().max(600).default(""),
  descriptionEn: z.string().trim().max(600).default(""),
  sortOrder: z.number().int().min(0).max(1000).default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

/* -------------------------------------------------------------------------- */
/* Source                                                                    */
/* -------------------------------------------------------------------------- */

export const sourceTypeSchema = z.enum([
  "quran",
  "hadith",
  "scholarly",
  "editorial",
  "cultural",
]);

export const verificationSchema = z.enum(["checked", "pending", "demo"]);

export const sourceInputSchema = z.object({
  slug: adminSlugSchema,
  type: sourceTypeSchema,
  titleBn: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  citation: z.string().trim().max(300).default(""),
  url: z
    .string()
    .trim()
    .max(500)
    .default("")
    .refine(
      (value) => value === "" || /^https?:\/\//i.test(value),
      "Enter a full http(s) URL or leave it blank.",
    ),
  noteBn: z.string().trim().max(600).default(""),
  noteEn: z.string().trim().max(600).default(""),
  verification: verificationSchema.default("pending"),
});

export type SourceInput = z.infer<typeof sourceInputSchema>;

/* -------------------------------------------------------------------------- */
/* Dua                                                                       */
/* -------------------------------------------------------------------------- */

export const duaInputSchema = z.object({
  slug: adminSlugSchema,
  titleBn: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  occasionBn: z.string().trim().max(200).default(""),
  occasionEn: z.string().trim().max(200).default(""),
  arabic: z.string().trim().min(1).max(2000),
  transliteration: z.string().trim().max(2000).default(""),
  translationBn: z.string().trim().max(2000).default(""),
  translationEn: z.string().trim().max(2000).default(""),
  verification: verificationSchema.default("pending"),
  translationIsEditorial: z.boolean().default(false),
  isDemo: z.boolean().default(false),
});

export type DuaInput = z.infer<typeof duaInputSchema>;

/* -------------------------------------------------------------------------- */
/* Tag                                                                       */
/* -------------------------------------------------------------------------- */

export const tagInputSchema = z.object({
  slug: adminSlugSchema,
  nameBn: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().min(1).max(120),
});

export type TagInput = z.infer<typeof tagInputSchema>;

/* -------------------------------------------------------------------------- */
/* Review                                                                    */
/* -------------------------------------------------------------------------- */

export const reviewStatusSchema = z.enum([
  "pending",
  "approved",
  "changes_requested",
]);

export type ReviewStatusInput = z.infer<typeof reviewStatusSchema>;

/* -------------------------------------------------------------------------- */
/* Article list query                                                        */
/* -------------------------------------------------------------------------- */

export const adminArticleStatusFilterSchema = z.enum([
  "all",
  "draft",
  "in_review",
  "published",
  "archived",
  "deleted",
]);

export const adminArticleQuerySchema = z.object({
  status: adminArticleStatusFilterSchema.default("all"),
  locale: z.enum(["all", "bn", "en"]).default("all"),
  categoryId: z.string().max(64).optional(),
  search: z.string().trim().max(200).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type AdminArticleQuery = z.infer<typeof adminArticleQuerySchema>;

/** Coerces Next's `searchParams` (string | string[] | undefined) into a query. */
export function parseAdminArticleSearchParams(
  input: Record<string, string | string[] | undefined>,
): AdminArticleQuery {
  const single = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

  const pageRaw = Number(single(input.page));
  const statusRaw = single(input.status);
  const localeRaw = single(input.locale);
  const categoryRaw = single(input.categoryId);
  const searchRaw = single(input.search);

  const candidate = {
    status: adminArticleStatusFilterSchema.safeParse(statusRaw).success
      ? statusRaw
      : "all",
    locale: localeRaw === "bn" || localeRaw === "en" ? localeRaw : "all",
    categoryId: categoryRaw ? categoryRaw : undefined,
    search: searchRaw ? searchRaw : undefined,
    page: Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    pageSize: 20,
  };

  const parsed = adminArticleQuerySchema.safeParse(candidate);
  return parsed.success
    ? parsed.data
    : { status: "all", locale: "all", page: 1, pageSize: 20 };
}
