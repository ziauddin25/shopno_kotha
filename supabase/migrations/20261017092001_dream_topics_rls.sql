-- Row Level Security for the dream-topic tables.
--
-- The public search journey must never reveal an unpublished or demo topic,
-- nor leak which private articles/duas/sources a topic links to. Every link
-- table therefore re-checks its parent topic's public visibility, exactly as
-- the article/dua link tables re-check their parent content.

-- ---------------------------------------------------------------------------
-- dream_topics
-- ---------------------------------------------------------------------------
create policy "dream_topics_select_published_or_staff"
  on public.dream_topics
  for select
  to anon, authenticated
  using ((status = 'published' and is_demo = false) or public.is_staff());

create policy "dream_topics_insert_editor_or_admin"
  on public.dream_topics
  for insert
  to authenticated
  with check (public.is_editor_or_admin());

create policy "dream_topics_update_editor_or_admin"
  on public.dream_topics
  for update
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "dream_topics_delete_admin"
  on public.dream_topics
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- dream_topic_aliases
-- ---------------------------------------------------------------------------
create policy "dream_topic_aliases_select_public_or_staff"
  on public.dream_topic_aliases
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.dream_topics t
      where t.id = dream_topic_aliases.topic_id
        and t.status = 'published'
        and t.is_demo = false
    )
  );

create policy "dream_topic_aliases_write_editor_or_admin"
  on public.dream_topic_aliases
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- dream_topic_articles / dream_topic_duas / dream_topic_sources
-- ---------------------------------------------------------------------------
create policy "dream_topic_articles_select_public_or_staff"
  on public.dream_topic_articles
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.dream_topics t
      where t.id = dream_topic_articles.topic_id
        and t.status = 'published'
        and t.is_demo = false
    )
  );

create policy "dream_topic_articles_write_editor_or_admin"
  on public.dream_topic_articles
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "dream_topic_duas_select_public_or_staff"
  on public.dream_topic_duas
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.dream_topics t
      where t.id = dream_topic_duas.topic_id
        and t.status = 'published'
        and t.is_demo = false
    )
  );

create policy "dream_topic_duas_write_editor_or_admin"
  on public.dream_topic_duas
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy "dream_topic_sources_select_public_or_staff"
  on public.dream_topic_sources
  for select
  to anon, authenticated
  using (
    public.is_staff()
    or exists (
      select 1 from public.dream_topics t
      where t.id = dream_topic_sources.topic_id
        and t.status = 'published'
        and t.is_demo = false
    )
  );

create policy "dream_topic_sources_write_editor_or_admin"
  on public.dream_topic_sources
  for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());
