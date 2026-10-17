import { cacheLife, cacheTag } from "next/cache";
import { categories as mockCategories } from "@/data/mock/categories";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category } from "@/types";
import { resolveDataSource } from "./data-source";
import { databaseError } from "./errors";
import { mapCategory } from "./mappers";
import { withLatency } from "./shared";
import { slugSchema } from "./validation";

const dataset = [...mockCategories].sort((a, b) => a.order - b.order);

async function supabaseAllCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  if (error) throw databaseError("categories", error.message, error);
  return (data ?? []).map(mapCategory);
}

async function supabaseCategoryBySlug(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories", `category:${slug}`);

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw databaseError("categories", error.message, error);
  return data ? mapCategory(data) : null;
}

export async function getAllCategories(): Promise<Category[]> {
  if (resolveDataSource() === "mock") return withLatency([...dataset]);
  return supabaseAllCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return null;

  if (resolveDataSource() === "mock") {
    const category = dataset.find((item) => item.slug === parsed.data) ?? null;
    return withLatency(category);
  }

  return supabaseCategoryBySlug(parsed.data);
}
