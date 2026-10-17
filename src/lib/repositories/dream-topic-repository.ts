import { cacheLife, cacheTag } from "next/cache";
import { dreamTopics as mockDreamTopics } from "@/data/mock/dream-topics";
import { createPublicClient } from "@/lib/supabase/public";
import type { DreamTopic, DreamTopicAlias } from "@/types";
import { resolveDataSource } from "./data-source";
import { databaseError } from "./errors";
import { withLatency } from "./shared";

/**
 * Published, non-demo dream topics for the public search journey. Row Level
 * Security already hides draft and demo rows from anonymous readers; the same
 * filter is applied here so every public read is safe whatever the data source.
 */
const PUBLIC_TOPICS = mockDreamTopics.filter((topic) => !topic.isDemo);

function group<T>(
  rows: T[],
  key: (row: T) => string,
  value: (row: T) => string,
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const list = map.get(key(row));
    if (list) list.push(value(row));
    else map.set(key(row), [value(row)]);
  }
  return map;
}

async function supabaseDreamTopics(): Promise<DreamTopic[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("dream-topics");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("dream_topics")
    .select("*")
    .eq("status", "published")
    .eq("is_demo", false);

  if (error) throw databaseError("dream_topics", error.message, error);

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);

  const [aliases, articles, duas, sources] = await Promise.all([
    supabase
      .from("dream_topic_aliases")
      .select("topic_id, locale, is_romanized, alias")
      .in("topic_id", ids),
    supabase
      .from("dream_topic_articles")
      .select("topic_id, article_id, position")
      .in("topic_id", ids)
      .order("position"),
    supabase
      .from("dream_topic_duas")
      .select("topic_id, dua_id, position")
      .in("topic_id", ids)
      .order("position"),
    supabase
      .from("dream_topic_sources")
      .select("topic_id, source_id, position")
      .in("topic_id", ids)
      .order("position"),
  ]);

  if (aliases.error) throw databaseError("dream_topic_aliases", aliases.error.message, aliases.error);
  if (articles.error) throw databaseError("dream_topic_articles", articles.error.message, articles.error);
  if (duas.error) throw databaseError("dream_topic_duas", duas.error.message, duas.error);
  if (sources.error) throw databaseError("dream_topic_sources", sources.error.message, sources.error);

  const aliasMap = new Map<string, DreamTopicAlias[]>();
  for (const row of aliases.data ?? []) {
    const alias: DreamTopicAlias = {
      text: row.alias,
      locale: row.locale,
      isRomanized: row.is_romanized,
    };
    const list = aliasMap.get(row.topic_id);
    if (list) list.push(alias);
    else aliasMap.set(row.topic_id, [alias]);
  }

  const articleMap = group(articles.data ?? [], (row) => row.topic_id, (row) => row.article_id);
  const duaMap = group(duas.data ?? [], (row) => row.topic_id, (row) => row.dua_id);
  const sourceMap = group(sources.data ?? [], (row) => row.topic_id, (row) => row.source_id);

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: { bn: row.title_bn, en: row.title_en },
    summary: { bn: row.summary_bn, en: row.summary_en },
    categoryId: row.category_id,
    aliases: aliasMap.get(row.id) ?? [],
    articleIds: articleMap.get(row.id) ?? [],
    duaIds: duaMap.get(row.id) ?? [],
    sourceIds: sourceMap.get(row.id) ?? [],
    isDemo: row.is_demo,
  }));
}

export async function getPublishedDreamTopics(): Promise<DreamTopic[]> {
  if (resolveDataSource() === "mock") return withLatency([...PUBLIC_TOPICS]);
  return supabaseDreamTopics();
}
