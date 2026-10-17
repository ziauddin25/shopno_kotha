-- Duas are bilingual: Arabic is shared, the translation/occasion carry both
-- languages on one row. Same verification model as articles/sources.

create table public.duas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_bn text not null,
  title_en text not null,
  occasion_bn text not null default '',
  occasion_en text not null default '',
  arabic text not null,
  transliteration text not null default '',
  translation_bn text not null default '',
  translation_en text not null default '',
  status public.dua_status not null default 'draft',
  verification public.verification_status not null default 'pending',
  -- True while the Bengali rendering is an editorial draft, not reviewer-approved.
  translation_is_editorial boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint duas_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index duas_status_idx on public.duas (status);
create index duas_verification_idx on public.duas (verification);

alter table public.duas enable row level security;

create trigger set_duas_updated_at
  before update on public.duas
  for each row execute function public.set_updated_at();

create table public.dua_sources (
  dua_id uuid not null references public.duas (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  position integer not null default 0,
  primary key (dua_id, source_id)
);

create index dua_sources_source_idx on public.dua_sources (source_id);

alter table public.dua_sources enable row level security;
