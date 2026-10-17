import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tag } from "@/types";
import { resolveDataSource } from "./data-source";
import { databaseError } from "./errors";
import { mapTag } from "./mappers";
import { withLatency } from "./shared";
import { idSchema, parseInput } from "./validation";

async function supabaseAllTags(): Promise<Tag[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("tags");

  const { data, error } = await createPublicClient()
    .from("tags")
    .select("*")
    .order("slug");

  if (error) throw databaseError("tags", error.message, error);
  return (data ?? []).map(mapTag);
}

async function supabaseTagsForArticle(articleId: string): Promise<Tag[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("tags");

  const supabase = createPublicClient();

  const links = await supabase
    .from("article_tags")
    .select("tag_id")
    .eq("article_id", articleId);

  if (links.error) throw databaseError("article_tags", links.error.message, links.error);

  const tagIds = (links.data ?? []).map((row) => row.tag_id);
  if (tagIds.length === 0) return [];

  const { data, error } = await supabase.from("tags").select("*").in("id", tagIds).order("slug");
  if (error) throw databaseError("tags", error.message, error);

  return (data ?? []).map(mapTag);
}

export async function getAllTags(): Promise<Tag[]> {
  // Fixtures never grew a tag dataset; the CMS seeds tags. An empty list is the
  // honest fixture answer rather than inventing bilingual labels.
  if (resolveDataSource() === "mock") return withLatency<Tag[]>([]);
  return supabaseAllTags();
}

export async function getTagsForArticle(articleId: string): Promise<Tag[]> {
  const parsed = parseInput(idSchema, articleId, "tags.forArticle");

  if (resolveDataSource() === "mock") return withLatency<Tag[]>([]);
  return supabaseTagsForArticle(parsed);
}
