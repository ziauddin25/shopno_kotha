-- Row Level Security policies.
--
-- Model:
--   * anon          – anonymous visitor: published content + non-demo sources only
--   * authenticated – any signed-in user; extra access depends on profile role
--   * staff         – authenticated user whose profile role is admin/editor/reviewer
--
-- RLS is already enabled on every table (schema migration); until a policy is
-- added below, access is denied. Policies are permissive and OR together.
-- The service_role bypasses RLS entirely and needs no policy.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles_select_self_or_staff"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or public.is_staff());

create policy "profiles_update_self_or_admin"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (id = (select auth.uid()) or public.is_admin());

create policy "profiles_delete_admin"
  on public.profiles
  for delete
  to authenticated
  using (public.is_admin());

-- No INSERT policy: profile rows are created by the SECURITY DEFINER trigger
-- on auth.users, never by clients.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create policy "categories_select_public_or_staff"
  on public.categories
  for select
  to anon, authenticated
  using (status = 'published' or public.is_staff());

create policy "categories_insert_admin"
  on public.categories
  for insert
  to authenticated
  with check (public.is_admin());

create policy "categories_update_admin"
  on public.categories
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_delete_admin"
  on public.categories
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- sources
-- ---------------------------------------------------------------------------
-- Demo sources are placeholder citations and must never be shown as authentic
-- public references; staff can still see them in the CMS.
create policy "sources_select_public_approved_or_staff"
  on public.sources
  for select
  to anon, authenticated
  using (verification <> 'demo' or public.is_staff());

create policy "sources_insert_editor_or_admin"
  on public.sources
  for insert
  to authenticated
  with check (public.is_editor_or_admin());

create policy "sources_update_editor_or_admin"
  on public.sources
  for update
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "sources_delete_admin"
  on public.sources
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------
create policy "articles_select_published_or_staff"
  on public.articles
  for select
  to anon, authenticated
  using ((status = 'published' and deleted_at is null) or public.is_staff());

create policy "articles_insert_editor_or_admin"
  on public.articles
  for insert
  to authenticated
  with check (public.is_editor_or_admin());

create policy "articles_update_editor_or_admin"
  on public.articles
  for update
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "articles_delete_admin"
  on public.articles
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- article_sources / article_related / article_tags
-- Public reads must never reveal that an unpublished article exists, so each
-- policy re-checks the parent article's visibility.
-- ---------------------------------------------------------------------------
create policy "article_sources_select_public_or_staff"
  on public.article_sources
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.articles a
      where a.id = article_sources.article_id
        and a.status = 'published'
        and a.deleted_at is null
    )
  );

create policy "article_sources_write_editor_or_admin"
  on public.article_sources
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "article_related_select_public_or_staff"
  on public.article_related
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or (
      exists (
        select 1 from public.articles a
        where a.id = article_related.article_id
          and a.status = 'published' and a.deleted_at is null
      )
      and exists (
        select 1 from public.articles b
        where b.id = article_related.related_article_id
          and b.status = 'published' and b.deleted_at is null
      )
    )
  );

create policy "article_related_write_editor_or_admin"
  on public.article_related
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "article_tags_select_public_or_staff"
  on public.article_tags
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.articles a
      where a.id = article_tags.article_id
        and a.status = 'published'
        and a.deleted_at is null
    )
  );

create policy "article_tags_write_editor_or_admin"
  on public.article_tags
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
-- Topic labels are public taxonomy with no private fields.
create policy "tags_select_public"
  on public.tags
  for select
  to anon, authenticated
  using (true);

create policy "tags_write_editor_or_admin"
  on public.tags
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- duas
-- ---------------------------------------------------------------------------
-- Same rule as sources: a demo dua is placeholder content and must never be
-- shown as authentic, even when it is marked published. Staff still see demos
-- in the CMS.
create policy "duas_select_published_or_staff"
  on public.duas
  for select
  to anon, authenticated
  using ((status = 'published' and verification <> 'demo') or public.is_staff());

create policy "duas_insert_editor_or_admin"
  on public.duas
  for insert
  to authenticated
  with check (public.is_editor_or_admin());

create policy "duas_update_editor_or_admin"
  on public.duas
  for update
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "duas_delete_admin"
  on public.duas
  for delete
  to authenticated
  using (public.is_admin());

create policy "dua_sources_select_public_or_staff"
  on public.dua_sources
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.duas d
      where d.id = dua_sources.dua_id
        and d.status = 'published'
        and d.verification <> 'demo'
    )
  );

create policy "dua_sources_write_editor_or_admin"
  on public.dua_sources
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- article_reviews (internal moderation data)
-- ---------------------------------------------------------------------------
create policy "article_reviews_select_staff"
  on public.article_reviews
  for select
  to authenticated
  using (public.is_staff());

create policy "article_reviews_insert_reviewer_or_admin"
  on public.article_reviews
  for insert
  to authenticated
  with check (public.is_reviewer_or_admin());

create policy "article_reviews_update_reviewer_or_admin"
  on public.article_reviews
  for update
  to authenticated
  using (public.is_reviewer_or_admin())
  with check (public.is_reviewer_or_admin());

create policy "article_reviews_delete_admin"
  on public.article_reviews
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- correction_reports (reader submissions; private to admins)
-- ---------------------------------------------------------------------------
-- Anonymous visitors may submit a correction, but only in the initial state.
create policy "correction_reports_insert_public"
  on public.correction_reports
  for insert
  to anon, authenticated
  with check (status = 'open');

create policy "correction_reports_select_admin"
  on public.correction_reports
  for select
  to authenticated
  using (public.is_admin());

create policy "correction_reports_update_admin"
  on public.correction_reports
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "correction_reports_delete_admin"
  on public.correction_reports
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- contact_messages (contact form submissions; private to admins)
-- ---------------------------------------------------------------------------
create policy "contact_messages_insert_public"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (status = 'new');

create policy "contact_messages_select_admin"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_admin());

create policy "contact_messages_update_admin"
  on public.contact_messages
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_messages_delete_admin"
  on public.contact_messages
  for delete
  to authenticated
  using (public.is_admin());
