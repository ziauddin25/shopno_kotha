import type { AdminSource } from "@/types/admin";
import { createClient } from "@/lib/supabase/server";
import { mapAdminSource } from "./admin-mappers";
import { mapPostgrestError } from "./admin-shared";
import { sourceInputSchema, type SourceInput } from "./admin-validation";
import { parseInput } from "./validation";

function toWritePayload(parsed: SourceInput) {
  return {
    slug: parsed.slug,
    type: parsed.type,
    title_bn: parsed.titleBn,
    title_en: parsed.titleEn,
    citation: parsed.citation || null,
    url: parsed.url || null,
    note_bn: parsed.noteBn,
    note_en: parsed.noteEn,
    verification: parsed.verification,
  };
}

export async function listAdminSources(): Promise<AdminSource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .order("created_at");

  if (error) throw mapPostgrestError("admin.sources.list", error);
  return (data ?? []).map(mapAdminSource);
}

export async function getAdminSourceById(id: string): Promise<AdminSource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapPostgrestError("admin.sources.get", error);
  return data ? mapAdminSource(data) : null;
}

export async function createAdminSource(input: SourceInput): Promise<AdminSource> {
  const parsed = parseInput(sourceInputSchema, input, "admin.sources.create");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sources")
    .insert(toWritePayload(parsed))
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.sources.create", error);
  return mapAdminSource(data);
}

export async function updateAdminSource(
  id: string,
  input: SourceInput,
): Promise<AdminSource> {
  const parsed = parseInput(sourceInputSchema, input, "admin.sources.update");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sources")
    .update(toWritePayload(parsed))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.sources.update", error);
  return mapAdminSource(data);
}

export async function deleteAdminSource(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("sources").delete().eq("id", id);
  if (error) throw mapPostgrestError("admin.sources.delete", error);
}
