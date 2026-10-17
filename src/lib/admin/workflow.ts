/**
 * The editorial workflow, expressed in one place and mirrored from SQL.
 *
 * The database is the authority: `enforce_article_status_transition()` guards
 * the status graph and `guard_article_workflow()` decides who may publish or
 * archive. These helpers reproduce the same rules so the UI only offers legal,
 * role-appropriate actions and Server Actions can fail fast — but they never
 * replace the triggers, which remain the final gate.
 */
import type {
  DbArticleStatus,
  UserRole,
} from "@/types/admin";

/**
 * Legal status edges. Mirrors `enforce_article_status_transition()`:
 *   draft      -> in_review, archived
 *   in_review  -> draft, published, archived
 *   published  -> draft, archived
 *   archived   -> draft
 */
const ARTICLE_TRANSITIONS: Record<DbArticleStatus, readonly DbArticleStatus[]> = {
  draft: ["in_review", "archived"],
  in_review: ["draft", "published", "archived"],
  published: ["draft", "archived"],
  archived: ["draft"],
};

export const ARTICLE_STATUSES: readonly DbArticleStatus[] = [
  "draft",
  "in_review",
  "published",
  "archived",
];

export function allowedArticleTransitions(
  from: DbArticleStatus,
): readonly DbArticleStatus[] {
  return ARTICLE_TRANSITIONS[from] ?? [];
}

export function canTransitionArticle(
  from: DbArticleStatus,
  to: DbArticleStatus,
): boolean {
  return ARTICLE_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Mirrors `guard_article_workflow()`: only administrators may move an article
 * into `published` or `archived`; editors may otherwise edit freely.
 */
export function canSetArticleStatus(role: UserRole, status: DbArticleStatus): boolean {
  if (status === "published" || status === "archived") return role === "admin";
  return role === "editor" || role === "admin";
}

/** Transitions legal from `from` *and* permitted for `role`. */
export function transitionsForRole(
  from: DbArticleStatus,
  role: UserRole,
): DbArticleStatus[] {
  return allowedArticleTransitions(from).filter((to) => canSetArticleStatus(role, to));
}

/** Inserts/updates to articles are editor/admin only (RLS: articles_insert/update_editor_or_admin). */
export function canEditArticles(role: UserRole): boolean {
  return role === "editor" || role === "admin";
}

/** Only admins may delete articles (RLS: articles_delete_admin). */
export function canDeleteArticles(role: UserRole): boolean {
  return role === "admin";
}

/** Only admins may publish a dua (mirrors `guard_dua_workflow()`). */
export function canPublishDua(role: UserRole): boolean {
  return role === "admin";
}

/** Categories are admin-only for every write (RLS: categories_*_admin). */
export function canManageCategories(role: UserRole): boolean {
  return role === "admin";
}

/** Sources are editor/admin for create/update; admin for delete. */
export function canEditSources(role: UserRole): boolean {
  return role === "editor" || role === "admin";
}

export function canDeleteSources(role: UserRole): boolean {
  return role === "admin";
}

/** Duas and tags are editor/admin for create/update; duas delete is admin, tags delete editor/admin. */
export function canEditDuas(role: UserRole): boolean {
  return role === "editor" || role === "admin";
}

export function canDeleteDuas(role: UserRole): boolean {
  return role === "admin";
}

export function canEditTags(role: UserRole): boolean {
  return role === "editor" || role === "admin";
}

/** Religious review is recorded by reviewers and admins only (`record_religious_review`). */
export function canRecordReligiousReview(role: UserRole): boolean {
  return role === "reviewer" || role === "admin";
}
