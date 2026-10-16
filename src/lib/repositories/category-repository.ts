import { categories as mockCategories } from "@/data/mock/categories";
import type { Category } from "@/types";
import { withLatency } from "./shared";

const dataset = [...mockCategories].sort((a, b) => a.order - b.order);

export async function getAllCategories(): Promise<Category[]> {
  return withLatency([...dataset]);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = dataset.find((item) => item.slug === slug) ?? null;
  return withLatency(category);
}

export function getCategoryByIdSync(id: string): Category | null {
  return dataset.find((item) => item.id === id) ?? null;
}

export function getCategoryMapSync(): Record<string, Category> {
  return Object.fromEntries(dataset.map((category) => [category.id, category]));
}
