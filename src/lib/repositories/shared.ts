/**
 * Shared helpers for the mock data layer.
 *
 * Repositories resolve asynchronously so that swapping the mock dataset for
 * Supabase (Phase 2) does not change a single call site. Latency is tiny and
 * exists only to keep loading states honest during development.
 */
import { defaultLocale, type Locale } from "@/types";

export function withLatency<T>(value: T, ms = 12): Promise<T> {
  if (ms <= 0) return Promise.resolve(value);
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : defaultLocale;
}

export function byPublishedDateDesc(a: { publishedAt: string | null }, b: { publishedAt: string | null }) {
  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}
