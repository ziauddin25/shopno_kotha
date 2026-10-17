/**
 * Input validation for the data layer.
 *
 * Every value that reaches a query – search terms, pagination, slugs, id lists –
 * is parsed with the project's Zod schemas first. Invalid input is a caller bug,
 * so it is reported as a typed `RepositoryError` rather than a raw `ZodError`.
 */
import { z } from "zod";
import { validationError } from "./errors";

export const localeSchema = z.enum(["bn", "en"]);

export const slugSchema = z.string().min(1).max(160);

export const idSchema = z.string().min(1).max(64);

export const idListSchema = z.array(idSchema).max(500);

export const articleQuerySchema = z.object({
  locale: localeSchema.optional(),
  categoryId: z.string().min(1).max(64).optional(),
  featured: z.boolean().optional(),
  search: z.string().max(200).optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(200).optional(),
  orderBy: z.enum(["published-desc", "published-asc"]).optional(),
});

export const searchInputSchema = z.object({
  query: z.string().max(200).optional(),
  locale: localeSchema.optional(),
  categoryId: z.string().min(1).max(64).optional(),
  limit: z.number().int().min(1).max(200).optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(200).optional(),
});

export type ArticleQuery = z.infer<typeof articleQuerySchema>;
export type SearchInput = z.infer<typeof searchInputSchema>;

export function parseInput<T>(schema: z.ZodType<T>, value: unknown, scope: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
      .join("; ");
    throw validationError(scope, detail);
  }
  return result.data;
}
