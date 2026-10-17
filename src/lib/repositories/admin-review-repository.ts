import type { AdminReview } from "@/types/admin";
import { createClient } from "@/lib/supabase/server";
import { mapAdminReview } from "./admin-mappers";
import { mapPostgrestError } from "./admin-shared";
import { reviewStatusSchema } from "./admin-validation";
import { parseInput } from "./validation";

export async function listAdminReviews(articleId: string): Promise<AdminReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_reviews")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) throw mapPostgrestError("admin.reviews.list", error);
  return (data ?? []).map(mapAdminReview);
}

/**
 * Records a religious review through the trusted RPC. This is the only path
 * that may change `religious_review_status` / `reviewed_by`; it runs as the
 * signed-in reviewer and re-checks `is_reviewer_or_admin()` in the database.
 */
export async function recordReligiousReview(
  articleId: string,
  status: string,
  notes: string,
): Promise<AdminReview> {
  const parsed = parseInput(reviewStatusSchema, status, "admin.reviews.record");
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("record_religious_review", {
    p_article_id: articleId,
    p_status: parsed,
    p_notes: notes.slice(0, 2000),
  });

  if (error) throw mapPostgrestError("admin.reviews.record", error);
  return mapAdminReview(data);
}

/**
 * Stamps (or clears) the editorial approval time. This is an editorial action,
 * deliberately separate from the religious review state.
 */
export async function setEditorialApproval(
  articleId: string,
  approved: boolean,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ editorial_approved_at: approved ? new Date().toISOString() : null })
    .eq("id", articleId);

  if (error) throw mapPostgrestError("admin.reviews.editorial", error);
}
