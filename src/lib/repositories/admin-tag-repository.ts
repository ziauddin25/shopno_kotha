import type { AdminTag } from "@/types/admin";
import { createClient } from "@/lib/supabase/server";
import { mapAdminTag } from "./admin-mappers";
import { mapPostgrestError } from "./admin-shared";
import { tagInputSchema, type TagInput } from "./admin-validation";
import { parseInput } from "./validation";

function toWritePayload(parsed: TagInput) {
  return {
    slug: parsed.slug,
    name_bn: parsed.nameBn,
    name_en: parsed.nameEn,
  };
}

export async function listAdminTags(): Promise<AdminTag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").order("slug");

  if (error) throw mapPostgrestError("admin.tags.list", error);
  return (data ?? []).map(mapAdminTag);
}

export async function createAdminTag(input: TagInput): Promise<AdminTag> {
  const parsed = parseInput(tagInputSchema, input, "admin.tags.create");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .insert(toWritePayload(parsed))
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.tags.create", error);
  return mapAdminTag(data);
}

export async function updateAdminTag(id: string, input: TagInput): Promise<AdminTag> {
  const parsed = parseInput(tagInputSchema, input, "admin.tags.update");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .update(toWritePayload(parsed))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.tags.update", error);
  return mapAdminTag(data);
}

export async function deleteAdminTag(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw mapPostgrestError("admin.tags.delete", error);
}
