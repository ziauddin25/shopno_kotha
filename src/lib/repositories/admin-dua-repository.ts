import type { AdminDua, DbDuaStatus } from "@/types/admin";
import { createClient } from "@/lib/supabase/server";
import { mapAdminDua } from "./admin-mappers";
import { mapPostgrestError } from "./admin-shared";
import {
  duaInputSchema,
  duaStatusSchema,
  type DuaInput,
} from "./admin-validation";
import { parseInput } from "./validation";

function toWritePayload(parsed: DuaInput) {
  return {
    slug: parsed.slug,
    title_bn: parsed.titleBn,
    title_en: parsed.titleEn,
    occasion_bn: parsed.occasionBn,
    occasion_en: parsed.occasionEn,
    arabic: parsed.arabic,
    transliteration: parsed.transliteration,
    translation_bn: parsed.translationBn,
    translation_en: parsed.translationEn,
    verification: parsed.verification,
    translation_is_editorial: parsed.translationIsEditorial,
    is_demo: parsed.isDemo,
  };
}

export async function listAdminDuas(): Promise<AdminDua[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("duas")
    .select("*")
    .order("created_at");

  if (error) throw mapPostgrestError("admin.duas.list", error);
  return (data ?? []).map(mapAdminDua);
}

export async function getAdminDuaById(id: string): Promise<AdminDua | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("duas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapPostgrestError("admin.duas.get", error);
  return data ? mapAdminDua(data) : null;
}

export async function createAdminDua(input: DuaInput): Promise<AdminDua> {
  const parsed = parseInput(duaInputSchema, input, "admin.duas.create");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("duas")
    .insert(toWritePayload(parsed))
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.duas.create", error);
  return mapAdminDua(data);
}

export async function updateAdminDua(id: string, input: DuaInput): Promise<AdminDua> {
  const parsed = parseInput(duaInputSchema, input, "admin.duas.update");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("duas")
    .update(toWritePayload(parsed))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.duas.update", error);
  return mapAdminDua(data);
}

/** Publishing is admin-only (mirrors `guard_dua_workflow()`). */
export async function setAdminDuaStatus(
  id: string,
  status: DbDuaStatus,
): Promise<AdminDua> {
  const parsed = parseInput(duaStatusSchema, status, "admin.duas.status");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("duas")
    .update({ status: parsed })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.duas.status", error);
  return mapAdminDua(data);
}

export async function deleteAdminDua(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("duas").delete().eq("id", id);
  if (error) throw mapPostgrestError("admin.duas.delete", error);
}
