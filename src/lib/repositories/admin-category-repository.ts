import type { AdminCategory } from "@/types/admin";
import { createClient } from "@/lib/supabase/server";
import { mapAdminCategory } from "./admin-mappers";
import { mapPostgrestError } from "./admin-shared";
import { categoryInputSchema, type CategoryInput } from "./admin-validation";
import { parseInput } from "./validation";

function toWritePayload(parsed: CategoryInput) {
  return {
    slug: parsed.slug,
    icon: parsed.icon,
    title_bn: parsed.titleBn,
    title_en: parsed.titleEn,
    description_bn: parsed.descriptionBn,
    description_en: parsed.descriptionEn,
    sort_order: parsed.sortOrder,
    status: parsed.status,
  };
}

export async function listAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("slug");

  if (error) throw mapPostgrestError("admin.categories.list", error);
  return (data ?? []).map(mapAdminCategory);
}

export async function getAdminCategoryById(id: string): Promise<AdminCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapPostgrestError("admin.categories.get", error);
  return data ? mapAdminCategory(data) : null;
}

export async function createAdminCategory(input: CategoryInput): Promise<AdminCategory> {
  const parsed = parseInput(categoryInputSchema, input, "admin.categories.create");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert(toWritePayload(parsed))
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.categories.create", error);
  return mapAdminCategory(data);
}

export async function updateAdminCategory(
  id: string,
  input: CategoryInput,
): Promise<AdminCategory> {
  const parsed = parseInput(categoryInputSchema, input, "admin.categories.update");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update(toWritePayload(parsed))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapPostgrestError("admin.categories.update", error);
  return mapAdminCategory(data);
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw mapPostgrestError("admin.categories.delete", error);
}
