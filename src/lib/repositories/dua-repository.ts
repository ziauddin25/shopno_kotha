import { cacheLife, cacheTag } from "next/cache";
import { duas as mockDuas } from "@/data/mock/duas";
import { createPublicClient } from "@/lib/supabase/public";
import type { Dua } from "@/types";
import { resolveDataSource } from "./data-source";
import { databaseError } from "./errors";
import { mapDua } from "./mappers";
import { withLatency } from "./shared";
import { idListSchema, parseInput, slugSchema } from "./validation";

/**
 * Demo duas are placeholder content that must never be presented as authentic.
 * Row Level Security already hides them from anon and the same rule is applied
 * here so every public read is safe by construction, whatever data source is
 * selected. (Like sources, `verification = 'demo'` — not the `is_demo` label —
 * is the public-hiding signal; `is_demo` marks copy shown with a demo notice.)
 */
const PUBLIC_DUAS = mockDuas.filter((dua) => dua.verification !== "demo");

async function supabaseDuaSources(duaIds: string[]): Promise<Map<string, string[]>> {
  const links = new Map<string, string[]>();
  if (duaIds.length === 0) return links;

  const { data, error } = await createPublicClient()
    .from("dua_sources")
    .select("dua_id, source_id, position")
    .in("dua_id", duaIds)
    .order("position");

  if (error) throw databaseError("dua_sources", error.message, error);

  for (const row of data ?? []) {
    const list = links.get(row.dua_id);
    if (list) list.push(row.source_id);
    else links.set(row.dua_id, [row.source_id]);
  }

  return links;
}

async function supabaseAllDuas(): Promise<Dua[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("duas");

  const { data, error } = await createPublicClient()
    .from("duas")
    .select("*")
    .eq("status", "published")
    .neq("verification", "demo")
    .order("created_at");

  if (error) throw databaseError("duas", error.message, error);

  const rows = data ?? [];
  const links = await supabaseDuaSources(rows.map((row) => row.id));
  return rows.map((row) => mapDua(row, links.get(row.id) ?? []));
}

async function supabaseDuaBySlug(slug: string): Promise<Dua | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("duas", `dua:${slug}`);

  const { data, error } = await createPublicClient()
    .from("duas")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .neq("verification", "demo")
    .maybeSingle();

  if (error) throw databaseError("duas", error.message, error);
  if (!data) return null;

  const links = await supabaseDuaSources([data.id]);
  return mapDua(data, links.get(data.id) ?? []);
}

export async function getAllDuas(): Promise<Dua[]> {
  if (resolveDataSource() === "mock") return withLatency([...PUBLIC_DUAS]);
  return supabaseAllDuas();
}

export async function getDuaBySlug(slug: string): Promise<Dua | null> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return null;

  if (resolveDataSource() === "mock") {
    const dua = PUBLIC_DUAS.find((item) => item.slug === parsed.data) ?? null;
    return withLatency(dua);
  }

  return supabaseDuaBySlug(parsed.data);
}

async function supabaseDuasByIds(ids: string[]): Promise<Dua[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("duas");

  const { data, error } = await createPublicClient()
    .from("duas")
    .select("*")
    .in("id", ids)
    .eq("status", "published")
    .neq("verification", "demo");

  if (error) throw databaseError("duas", error.message, error);

  const rows = data ?? [];
  const links = await supabaseDuaSources(rows.map((row) => row.id));
  const byId = new Map(rows.map((row) => [row.id, mapDua(row, links.get(row.id) ?? [])]));
  return ids
    .map((id) => byId.get(id))
    .filter((dua): dua is Dua => Boolean(dua));
}

/** Resolves duas in the order the ids were requested, published and non-demo. */
export async function getDuasByIds(ids: string[]): Promise<Dua[]> {
  const parsed = parseInput(idListSchema, ids, "duas.byId");
  if (parsed.length === 0) return [];

  if (resolveDataSource() === "mock") {
    const found = parsed
      .map((id) => PUBLIC_DUAS.find((dua) => dua.id === id))
      .filter((dua): dua is Dua => Boolean(dua));
    return withLatency(found);
  }

  return supabaseDuasByIds(parsed);
}
