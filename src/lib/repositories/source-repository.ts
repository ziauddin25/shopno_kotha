import { cacheLife, cacheTag } from "next/cache";
import { sources as mockSources } from "@/data/mock/sources";
import { createPublicClient } from "@/lib/supabase/public";
import type { SourceReference } from "@/types";
import { resolveDataSource } from "./data-source";
import { databaseError } from "./errors";
import { mapSource } from "./mappers";
import { withLatency } from "./shared";
import { idListSchema, parseInput } from "./validation";

const dataset = [...mockSources];

/**
 * Demo sources are placeholder citations that must never be presented as
 * authentic references. Row Level Security already hides them from anon and
 * the same rule is applied here so every public read is safe by construction,
 * whatever data source is selected.
 */
const PUBLIC_SOURCES = dataset.filter((source) => source.verification !== "demo");

async function supabaseAllSources(): Promise<SourceReference[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sources");

  const { data, error } = await createPublicClient()
    .from("sources")
    .select("*")
    .neq("verification", "demo")
    .order("created_at");

  if (error) throw databaseError("sources", error.message, error);
  return (data ?? []).map(mapSource);
}

async function supabaseSourcesByIds(ids: string[]): Promise<SourceReference[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sources");

  const { data, error } = await createPublicClient()
    .from("sources")
    .select("*")
    .in("id", ids)
    .neq("verification", "demo");

  if (error) throw databaseError("sources", error.message, error);

  const byId = new Map((data ?? []).map((row) => [row.id, mapSource(row)]));
  return ids
    .map((id) => byId.get(id))
    .filter((source): source is SourceReference => Boolean(source));
}

export async function getAllSources(): Promise<SourceReference[]> {
  if (resolveDataSource() === "mock") return withLatency([...PUBLIC_SOURCES]);
  return supabaseAllSources();
}

/** Resolves citations in the order the ids were requested. */
export async function getSourcesByIds(ids: string[]): Promise<SourceReference[]> {
  const parsed = parseInput(idListSchema, ids, "sources.byId");
  if (parsed.length === 0) return [];

  if (resolveDataSource() === "mock") {
    const found = parsed
      .map((id) => PUBLIC_SOURCES.find((source) => source.id === id))
      .filter((source): source is SourceReference => Boolean(source));
    return withLatency(found);
  }

  return supabaseSourcesByIds(parsed);
}
