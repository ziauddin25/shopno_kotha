import type { Json } from "@/types/database";
import type { AdminArticle, DbArticleStatus } from "@/types/admin";
import { createClient } from "@/lib/supabase/server";
import { mapAdminArticle } from "./admin-mappers";
import { mapPostgrestError } from "./admin-shared";
import {
  articleInputSchema,
  articleStatusSchema,
  type AdminArticleQuery,
  type ArticleInput,
} from "./admin-validation";
import { parseInput } from "./validation";
import {
  pagedResult,
  sanitizeSearchTerm,
  toRange,
  type PagedResult,
} from "./shared";

/** Shared column projection for the CMS. */
function toWritePayload(parsed: ArticleInput) {
  return {
    slug: parsed.slug,
    locale: parsed.locale,
    title: parsed.title,
    summary: parsed.summary,
    body: parsed.body as unknown as Json,
    category_id: parsed.categoryId,
    featured: parsed.featured,
    reading_minutes: parsed.readingMinutes,
    is_demo: parsed.isDemo,
    keywords: parsed.keywords,
    seo_title: parsed.seoTitle || null,
    seo_description: parsed.seoDescription || null,
    og_image_path: parsed.ogImagePath || null,
  };
}

export async function listAdminArticles(
  query: AdminArticleQuery,
): Promise<PagedResult<AdminArticle>> {
  const supabase = await createClient();

  let builder = supabase.from("articles").select("*", { count: "exact" });

  if (query.status === "deleted") {
    builder = builder.not("deleted_at", "is", null);
  } else {
    builder = builder.is("deleted_at", null);
    if (query.status !== "all") builder = builder.eq("status", query.status);
  }

  if (query.locale !== "all") builder = builder.eq("locale", query.locale);
  if (query.categoryId) builder = builder.eq("category_id", query.categoryId);

  if (query.search) {
    const term = sanitizeSearchTerm(query.search);
    if (term) builder = builder.or(`title.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  const ordered = builder.order("updated_at", { ascending: false });
  const { from, to } = toRange(query.page, query.pageSize);
  const { data, error, count } = await ordered.range(from, to);

  if (error) throw mapPostgrestError("admin.articles.list", error);

  const items = (data ?? []).map(mapAdminArticle);
  return pagedResult(items, count ?? items.length, query.page, query.pageSize);
}

export interface AdminArticleCounts {
  draft: number;
  in_review: number;
  published: number;
  archived: number;
  deleted: number;
  total: number;
}

export async function getAdminArticleCounts(): Promise<AdminArticleCounts> {
  const supabase = await createClient();
  const statuses: DbArticleStatus[] = ["draft", "in_review", "published", "archived"];

  const [statusResults, deletedResult] = await Promise.all([
    Promise.all(
      statuses.map((status) =>
        supabase
          .from("articles")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("status", status),
      ),
    ),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .not("deleted_at", "is", null),
  ]);

  const byStatus: Record<DbArticleStatus, number> = {
    draft: 0,
    in_review: 0,
    published: 0,
    archived: 0,
  };

  statuses.forEach((status, index) => {
    const result = statusResults[index];
    if (result.error) throw mapPostgrestError("admin.articles.counts", result.error);
    byStatus[status] = result.count ?? 0;
  });

  if (deletedResult.error) {
    throw mapPostgrestError("admin.articles.counts", deletedResult.error);
  }

  return {
    ...byStatus,
    deleted: deletedResult.count ?? 0,
    total: byStatus.draft + byStatus.in_review + byStatus.published + byStatus.archived,
  };
}

export async function getAdminArticleById(id: string): Promise<AdminArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapPostgrestError("admin.articles.get", error);
  return data ? mapAdminArticle(data) : null;
}

export async function createAdminArticle(
  input: ArticleInput,
  authorId: string,
): Promise<AdminArticle> {
  const parsed = parseInput(articleInputSchema, input, "admin.articles.create");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .insert({ ...toWritePayload(parsed), author_id: authorId })
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.articles.create", error);
  return mapAdminArticle(data);
}

export async function updateAdminArticle(
  id: string,
  input: ArticleInput,
): Promise<AdminArticle> {
  const parsed = parseInput(articleInputSchema, input, "admin.articles.update");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .update(toWritePayload(parsed))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.articles.update", error);
  return mapAdminArticle(data);
}

/** Moves an article to a new status. The DB trigger validates the edge + role. */
export async function setAdminArticleStatus(
  id: string,
  status: DbArticleStatus,
): Promise<AdminArticle> {
  const parsed = parseInput(articleStatusSchema, status, "admin.articles.status");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .update({ status: parsed })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.articles.status", error);
  return mapAdminArticle(data);
}

export async function setAdminArticleDeleted(
  id: string,
  deleted: boolean,
): Promise<AdminArticle> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .update({ deleted_at: deleted ? new Date().toISOString() : null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.articles.deleted", error);
  return mapAdminArticle(data);
}

export async function getAdminArticleTagIds(articleId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_tags")
    .select("tag_id")
    .eq("article_id", articleId);

  if (error) throw mapPostgrestError("admin.articles.tags", error);
  return (data ?? []).map((row) => row.tag_id);
}

/**
 * Reconciles the article's tag selection with the stored join rows. Additions
 * are inserted before removals so a transient failure never leaves an article
 * with fewer tags than it started with.
 */
export async function setAdminArticleTags(
  articleId: string,
  tagIds: string[],
): Promise<void> {
  const supabase = await createClient();
  const existing = await getAdminArticleTagIds(articleId);

  const selected = new Set(tagIds);
  const current = new Set(existing);
  const toAdd = tagIds.filter((id) => !current.has(id));
  const toRemove = existing.filter((id) => !selected.has(id));

  if (toAdd.length > 0) {
    const { error } = await supabase
      .from("article_tags")
      .insert(toAdd.map((tag_id) => ({ article_id: articleId, tag_id })));
    if (error) throw mapPostgrestError("admin.articles.tags.insert", error);
  }

  if (toRemove.length > 0) {
    const { error } = await supabase
      .from("article_tags")
      .delete()
      .eq("article_id", articleId)
      .in("tag_id", toRemove);
    if (error) throw mapPostgrestError("admin.articles.tags.delete", error);
  }
}
