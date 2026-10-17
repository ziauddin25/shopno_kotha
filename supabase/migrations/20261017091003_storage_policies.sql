-- Storage policies for the `article-covers` bucket.
--
-- The bucket itself is public (public URL serves read-only copies without a
-- policy), but every API-level read/write goes through RLS on storage.objects:
--   * anyone may read objects in this bucket (they are published illustrations)
--   * only editors/admins may upload or replace covers
--   * only admins may delete covers

create policy "article_covers_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'article-covers');

create policy "article_covers_staff_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'article-covers'
    and public.is_editor_or_admin()
  );

create policy "article_covers_staff_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'article-covers'
    and public.is_editor_or_admin()
  )
  with check (
    bucket_id = 'article-covers'
    and public.is_editor_or_admin()
  );

create policy "article_covers_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'article-covers'
    and public.is_admin()
  );
