-- Structured dream topics.
--
-- These tables power the core dream-search journey: a reader describes a dream
-- in Bengali, Banglish or English and gets the published articles, duas and
-- evidence sources that address that idea.
--
-- Design notes
--   * A topic is a concept ("disturbing dream", "dream types"), never a claim
--     about a symbol's meaning. The page stores no religious verdict of its
--     own — evidence comes only from the linked `sources.type`.
--   * Aliases carry the surface forms a reader might type. `normalized` is a
--     canonical form used to de-duplicate aliases and to back a trigram index;
--     matching itself also normalises the query in the application so the mock
--     and Supabase paths rank identically.
--   * `status`/`is_demo` deliberately mirror the public-hiding rules used for
--     `categories` and `sources`: only published, non-demo topics are readable
--     by anonymous visitors.

create extension if not exists pg_trgm with schema extensions;

create table public.dream_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_bn text not null,
  title_en text not null,
  summary_bn text not null default '',
  summary_en text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  status public.category_status not null default 'draft',
  review_status public.review_status not null default 'pending',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dream_topics_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index dream_topics_status_idx on public.dream_topics (status);
create index dream_topics_category_idx on public.dream_topics (category_id);

alter table public.dream_topics enable row level security;

create trigger set_dream_topics_updated_at
  before update on public.dream_topics
  for each row execute function public.set_updated_at();

-- Canonical normalisation for Bengali / Banglish / English alias text: Unicode
-- NFKC, lower-cased, whitespace collapsed. Immutable so it can feed the
-- `normalized` column below and be indexed. The application performs the same
-- normalisation (plus punctuation stripping) before matching.
create or replace function public.normalize_dream_text(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(
    trim(
      regexp_replace(
        lower(normalize(coalesce(value, ''), NFKC)),
        '[[:space:]]+',
        ' ',
        'g'
      )
    ),
    ''
  );
$$;

comment on function public.normalize_dream_text(text) is
  'NFKC + lower-case + whitespace-collapse normalisation for dream-search aliases and queries.';

create table public.dream_topic_aliases (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.dream_topics (id) on delete cascade,
  locale public.content_locale not null default 'bn',
  -- True when the alias is a Banglish / romanised rendering ("kharap shopno").
  is_romanized boolean not null default false,
  alias text not null,
  normalized text not null default '',
  created_at timestamptz not null default now(),
  constraint dream_topic_aliases_alias_not_blank check (char_length(btrim(alias)) > 0),
  constraint dream_topic_aliases_unique unique (topic_id, locale, is_romanized, normalized)
);

create index dream_topic_aliases_topic_idx on public.dream_topic_aliases (topic_id);
create index dream_topic_aliases_normalized_trgm_idx
  on public.dream_topic_aliases
  using gin (normalized extensions.gin_trgm_ops);

alter table public.dream_topic_aliases enable row level security;

-- Keeps `normalized` faithful to `alias`; clients never set it themselves.
create or replace function public.set_dream_alias_normalized()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.normalized := coalesce(public.normalize_dream_text(new.alias), '');
  return new;
end;
$$;

create trigger set_dream_topic_aliases_normalized
  before insert or update of alias on public.dream_topic_aliases
  for each row execute function public.set_dream_alias_normalized();

-- ---------------------------------------------------------------------------
-- Topic → content links. `position` preserves the editorial ordering that the
-- reader sees; the primary key makes each pairing unique.
-- ---------------------------------------------------------------------------
create table public.dream_topic_articles (
  topic_id uuid not null references public.dream_topics (id) on delete cascade,
  article_id uuid not null references public.articles (id) on delete cascade,
  position integer not null default 0,
  primary key (topic_id, article_id)
);

create index dream_topic_articles_article_idx on public.dream_topic_articles (article_id);

alter table public.dream_topic_articles enable row level security;

create table public.dream_topic_duas (
  topic_id uuid not null references public.dream_topics (id) on delete cascade,
  dua_id uuid not null references public.duas (id) on delete cascade,
  position integer not null default 0,
  primary key (topic_id, dua_id)
);

create index dream_topic_duas_dua_idx on public.dream_topic_duas (dua_id);

alter table public.dream_topic_duas enable row level security;

create table public.dream_topic_sources (
  topic_id uuid not null references public.dream_topics (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  position integer not null default 0,
  primary key (topic_id, source_id)
);

create index dream_topic_sources_source_idx on public.dream_topic_sources (source_id);

alter table public.dream_topic_sources enable row level security;
