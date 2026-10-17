-- Bilingual taxonomy + reference sources.
-- Categories and sources are locale-independent (both languages live on one
-- row); articles and duas are language-specific and reference these.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  icon text not null default 'sparkles',
  title_bn text not null,
  title_en text not null,
  description_bn text not null default '',
  description_en text not null default '',
  sort_order integer not null default 0,
  status public.category_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index categories_status_sort_idx on public.categories (status, sort_order);

alter table public.categories enable row level security;

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type public.source_type not null,
  title_bn text not null,
  title_en text not null,
  citation text,
  url text,
  note_bn text not null default '',
  note_en text not null default '',
  verification public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sources_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint sources_url_format check (url is null or url ~* '^https?://')
);

create index sources_type_idx on public.sources (type);
create index sources_verification_idx on public.sources (verification);

alter table public.sources enable row level security;

create trigger set_sources_updated_at
  before update on public.sources
  for each row execute function public.set_updated_at();
