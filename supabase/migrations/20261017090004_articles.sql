-- Articles: one row per (slug, locale). Editorial status and religious review
-- are deliberately orthogonal — publishing never implies religious approval.

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  locale public.content_locale not null,
  title text not null,
  summary text not null default '',
  body jsonb not null default '[]'::jsonb,
  category_id uuid references public.categories (id) on delete set null,
  status public.article_status not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  reading_minutes integer not null default 1,
  is_demo boolean not null default false,
  keywords text[] not null default '{}',
  seo_title text,
  seo_description text,
  og_image_path text,
  author_id uuid references public.profiles (id) on delete set null,
  editorial_approved_at timestamptz,
  religious_review_status public.religious_review_status not null default 'none',
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint articles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint articles_reading_minutes_positive check (reading_minutes >= 1),
  constraint articles_body_is_array check (jsonb_typeof(body) = 'array'),
  -- A published article must carry a publication timestamp.
  constraint articles_published_requires_date
    check (status <> 'published' or published_at is not null)
);

create index articles_status_published_at_idx on public.articles (status, published_at desc);
create index articles_locale_status_idx on public.articles (locale, status);
create index articles_category_idx on public.articles (category_id);
create index articles_author_idx on public.articles (author_id);
create index articles_featured_idx on public.articles (featured) where featured;
create index articles_keywords_idx on public.articles using gin (keywords);

alter table public.articles enable row level security;

create trigger set_articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create trigger enforce_articles_status_transition
  before insert or update of status on public.articles
  for each row execute function public.enforce_article_status_transition();

-- Sources cited by an article body / source list.
create table public.article_sources (
  article_id uuid not null references public.articles (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  position integer not null default 0,
  primary key (article_id, source_id)
);

create index article_sources_source_idx on public.article_sources (source_id);

alter table public.article_sources enable row level security;

-- Curated "related articles". A row is a directed edge; the app may treat it
-- as symmetric at read time.
create table public.article_related (
  article_id uuid not null references public.articles (id) on delete cascade,
  related_article_id uuid not null references public.articles (id) on delete cascade,
  position integer not null default 0,
  primary key (article_id, related_article_id),
  constraint article_related_no_self check (article_id <> related_article_id)
);

create index article_related_related_idx on public.article_related (related_article_id);

alter table public.article_related enable row level security;
