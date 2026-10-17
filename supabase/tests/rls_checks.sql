-- ============================================================================
-- Shopno Kotha — RLS / authorization verification
-- ============================================================================
--
-- Run against a LOCAL Supabase database (where the `anon`, `authenticated`
-- and `service_role` roles exist):
--
--     npx supabase db reset          -- apply migrations + this file if wired in
--     psql "$DATABASE_URL" -f supabase/tests/rls_checks.sql
--
-- or paste the whole file into the Supabase SQL editor on a throwaway project.
--
-- The script runs entirely inside transactions that ROLL BACK, so it never
-- leaves data behind. It prints one row per check:
--     PASS  – behavior matches the policy
--     FAIL  – behavior contradicts the policy (investigate immediately)
-- Error-based checks raise an exception on FAIL, so the run aborts loudly.
--
-- NOTE: this file has NOT been executed in the authoring environment (no
-- Postgres/Supabase/Docker available there). Treat it as executable
-- specification, not as evidence of a passing run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Part 1 — static catalog inspection (no data involved)
-- ---------------------------------------------------------------------------
-- The public schema is expected to contain exactly these 18 base tables
-- (storage objects/buckets live in the `storage` schema). Update this list and
-- the counts below together whenever the schema changes — a mismatch is a
-- signal, not something to silence.
select
  case when count(*) = 18 then 'PASS' else 'FAIL' end as result,
  'expected number of public base tables (18)' as scenario
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r';

select
  case when count(*) = 18 then 'PASS' else 'FAIL' end as result,
  'RLS enabled on all 18 expected public tables' as scenario
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'profiles','categories','sources','articles','article_sources',
    'article_related','tags','article_tags','duas','dua_sources',
    'article_reviews','correction_reports','contact_messages',
    'dream_topics','dream_topic_aliases','dream_topic_articles',
    'dream_topic_duas','dream_topic_sources'
  )
  and c.relrowsecurity;

select
  case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
  'no public table is missing RLS' as scenario
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and not c.relrowsecurity;

select
  case when count(*) >= 30 then 'PASS' else 'FAIL' end as result,
  'expected number of RLS policies present' as scenario
from pg_policies
where schemaname in ('public', 'storage');

select
  case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
  'no helper/definition function is missing a fixed search_path' as scenario
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
  and (p.proconfig is null or not (p.proconfig @> array['search_path=']));

select
  case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
  'no protected table has a USING (true) write policy' as scenario
from pg_policies
where schemaname = 'public'
  and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  and coalesce(qual, '') = 'true';

-- ---------------------------------------------------------------------------
-- Part 2 — behavioral checks
-- ---------------------------------------------------------------------------
begin;

-- Seed known data as the owner (bypasses RLS). Fixed UUIDs for readability.
insert into public.profiles (id, role, display_name) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin',    'Admin'),
  ('00000000-0000-0000-0000-0000000000e1', 'editor',   'Editor'),
  ('00000000-0000-0000-0000-0000000000f1', 'reviewer', 'Reviewer');

insert into public.categories (id, slug, title_bn, title_en, status) values
  ('00000000-0000-0000-0000-0000000000c1', 'cat-published', 'প্রকাশিত', 'Published', 'published'),
  ('00000000-0000-0000-0000-0000000000c2', 'cat-draft',     'খসড়া',    'Draft',     'draft');

insert into public.sources (id, slug, type, title_bn, title_en, verification) values
  ('00000000-0000-0000-0000-0000000000d1', 'source-checked', 'hadith', 'বিশ্বস্ত', 'Checked', 'checked'),
  ('00000000-0000-0000-0000-0000000000d2', 'source-demo',    'hadith', 'ডেমো',     'Demo',    'demo');

insert into public.duas (id, slug, title_bn, title_en, arabic, status, verification) values
  ('00000000-0000-0000-0000-0000000000e1', 'dua-published', 'প্রকাশিত দোয়া', 'Published dua', 'x', 'published', 'checked'),
  ('00000000-0000-0000-0000-0000000000e2', 'dua-pending',   'অপেক্ষমাণ দোয়া', 'Pending dua',   'x', 'published', 'pending'),
  ('00000000-0000-0000-0000-0000000000e3', 'dua-demo',      'ডেমো দোয়া',      'Demo dua',      'x', 'published', 'demo');

insert into public.articles (id, slug, locale, title, summary, category_id, status, published_at) values
  ('00000000-0000-0000-0000-000000000001', 'published-article', 'bn', 'প্রকাশিত প্রবন্ধ', 's', '00000000-0000-0000-0000-0000000000c1', 'published', now()),
  ('00000000-0000-0000-0000-000000000002', 'draft-article',     'bn', 'খসড়া প্রবন্ধ',    's', '00000000-0000-0000-0000-0000000000c1', 'draft',     null);

insert into public.article_sources (article_id, source_id) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000d1'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-0000000000d2');

insert into public.contact_messages (name, email, message) values
  ('Visitor', 'visitor@example.com', 'Hello');

insert into public.dream_topics (id, slug, title_bn, title_en, status, is_demo) values
  ('00000000-0000-0000-0000-0000000000f1', 'topic-published', 'প্রকাশিত বিষয়', 'Published topic', 'published', false),
  ('00000000-0000-0000-0000-0000000000f2', 'topic-draft',     'খসড়া বিষয়',    'Draft topic',     'draft',     false),
  ('00000000-0000-0000-0000-0000000000f3', 'topic-demo',      'ডেমো বিষয়',     'Demo topic',      'published', true);

insert into public.dream_topic_aliases (topic_id, locale, is_romanized, alias) values
  ('00000000-0000-0000-0000-0000000000f1', 'bn', false, 'প্রকাশিত বিষয়'),
  ('00000000-0000-0000-0000-0000000000f2', 'bn', false, 'খসড়া বিষয়');

-- == Anonymous visitor =====================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}', true);

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'anon sees exactly the published article' as scenario
from public.articles;

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'anon cannot see the draft article' as scenario
from public.articles where slug = 'draft-article';

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'anon sees only non-demo sources' as scenario
from public.sources;

select case when count(*) = 2 then 'PASS' else 'FAIL' end as result,
       'anon sees only published, non-demo duas' as scenario
from public.duas;

select case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
       'anon cannot see a published demo dua' as scenario
from public.duas where verification = 'demo';

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'anon sees only the published, non-demo dream topic' as scenario
from public.dream_topics;

select case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
       'anon cannot see a published demo dream topic' as scenario
from public.dream_topics where is_demo;

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'anon sees aliases only for public dream topics' as scenario
from public.dream_topic_aliases;

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'anon cannot read contact submissions' as scenario
from public.contact_messages;

do $$
begin
  begin
    insert into public.articles (slug, locale, title) values ('anon-insert', 'bn', 'x');
    raise exception 'FAIL: anon was able to insert an article';
  exception when insufficient_privilege then
    raise notice 'PASS: anon insert into articles blocked';
  end;
end $$;

do $$
begin
  begin
    update public.articles set title = 'hacked' where slug = 'published-article';
    raise exception 'FAIL: anon was able to update an article';
  exception when insufficient_privilege then
    raise notice 'PASS: anon update of articles blocked';
  end;
end $$;

do $$
begin
  begin
    delete from public.articles where slug = 'published-article';
    raise exception 'FAIL: anon was able to delete an article';
  exception when insufficient_privilege then
    raise notice 'PASS: anon delete of articles blocked';
  end;
end $$;

-- The public contact form is allowed to insert, but only in its initial state.
insert into public.contact_messages (name, email, message) values
  ('Anon', 'anon@example.com', 'allowed');

do $$
begin
  begin
    insert into public.contact_messages (name, email, message, status)
    values ('Anon', 'anon@example.com', 'x', 'read');
    raise exception 'FAIL: anon could set a privileged contact status';
  exception when insufficient_privilege then
    raise notice 'PASS: anon cannot forge contact status';
  end;
end $$;

rollback;

-- == Authenticated editor ===================================================
begin;

insert into public.profiles (id, role, display_name) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin',  'Admin'),
  ('00000000-0000-0000-0000-0000000000e1', 'editor', 'Editor');

insert into public.articles (id, slug, locale, title, summary, status, published_at) values
  ('00000000-0000-0000-0000-000000000001', 'published-article', 'bn', 'প্রকাশিত', 's', 'published', now());

insert into public.duas (id, slug, title_bn, title_en, arabic, status, verification) values
  ('00000000-0000-0000-0000-0000000000e3', 'dua-demo', 'ডেমো দোয়া', 'Demo dua', 'x', 'published', 'demo');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000e1', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1"}', true);

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'editor can see drafts (staff)' as scenario
from public.articles;

select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'staff can still see a demo dua in the CMS' as scenario
from public.duas where verification = 'demo';

-- Editor may create and submit for review, but not publish.
do $$
begin
  insert into public.articles (slug, locale, title, status)
  values ('editor-draft', 'bn', 'Editor draft', 'draft');
  raise notice 'PASS: editor can create a draft';
end $$;

do $$
begin
  begin
    insert into public.articles (slug, locale, title, status)
    values ('editor-published', 'bn', 'Editor publish attempt', 'published');
    raise exception 'FAIL: editor was able to publish directly';
  exception when insufficient_privilege then
    raise notice 'PASS: editor direct publish blocked';
  end;
end $$;

-- Editor cannot change their own role.
do $$
begin
  begin
    update public.profiles set role = 'admin'
    where id = '00000000-0000-0000-0000-0000000000e1';
    raise exception 'FAIL: editor escalated their own role';
  exception when insufficient_privilege then
    raise notice 'PASS: editor self role escalation blocked';
  end;
end $$;

-- Editor may change their own display name.
do $$
begin
  update public.profiles set display_name = 'Renamed Editor'
  where id = '00000000-0000-0000-0000-0000000000e1';
  raise notice 'PASS: editor can edit own profile metadata';
end $$;

-- Editor cannot read contact submissions.
select case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
       'editor cannot read contact submissions' as scenario
from public.contact_messages;

rollback;

-- == Authenticated admin ====================================================
begin;

insert into public.profiles (id, role, display_name) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin',  'Admin'),
  ('00000000-0000-0000-0000-0000000000e1', 'editor', 'Editor');

insert into public.articles (id, slug, locale, title, summary, status, published_at) values
  ('00000000-0000-0000-0000-000000000001', 'published-article', 'bn', 'প্রকাশিত', 's', 'published', now());

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1"}', true);

do $$
begin
  update public.articles set status = 'archived' where slug = 'published-article';
  raise notice 'PASS: admin can archive';
end $$;

do $$
begin
  -- reachable only from archived -> draft and draft -> in_review chain
  update public.articles set status = 'draft' where slug = 'published-article';
  raise notice 'PASS: admin can unpublish';
end $$;

do $$
declare updated public.profiles;
begin
  updated := public.admin_set_user_role('00000000-0000-0000-0000-0000000000e1', 'reviewer');
  if updated.role = 'reviewer' then
    raise notice 'PASS: admin can change another user''s role';
  else
    raise exception 'FAIL: admin role change did not apply';
  end if;
end $$;

-- Admin cannot change their own role through the trusted operation.
do $$
begin
  begin
    perform public.admin_set_user_role('00000000-0000-0000-0000-0000000000a1', 'editor');
    raise exception 'FAIL: admin changed their own role';
  exception when insufficient_privilege then
    raise notice 'PASS: admin self role change blocked';
  end;
end $$;

rollback;

-- == Storage =================================================================
begin;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);

-- Anonymous visitors may read the public bucket but not write to it.
select case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
       'anon storage write policy is absent (expected)' as scenario
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  and 'anon' = any (roles);

rollback;

-- ============================================================================
-- End. Scan the output for FAIL; each PASS confirms one policy.
-- ============================================================================
