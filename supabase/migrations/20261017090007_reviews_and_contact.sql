-- Review records and reader-submitted messages.

-- Immutable audit trail of editorial and religious review passes. The current
-- article's `religious_review_status` / `reviewed_by` is a denormalized
-- summary of the latest approved row here.
create table public.article_reviews (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  reviewer_id uuid references public.profiles (id) on delete set null,
  review_type public.review_type not null,
  status public.review_status not null default 'pending',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index article_reviews_article_idx
  on public.article_reviews (article_id, review_type, created_at desc);
create index article_reviews_reviewer_idx on public.article_reviews (reviewer_id);

alter table public.article_reviews enable row level security;

create trigger set_article_reviews_updated_at
  before update on public.article_reviews
  for each row execute function public.set_updated_at();

-- Reader corrections tied to a specific article (or general feedback).
create table public.correction_reports (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles (id) on delete set null,
  name text,
  email text,
  subject_type text,
  message text not null,
  status public.correction_status not null default 'open',
  resolution_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint correction_reports_message_not_blank
    check (char_length(btrim(message)) > 0),
  constraint correction_reports_email_format check (
    email is null or email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  )
);

create index correction_reports_status_idx
  on public.correction_reports (status, created_at desc);
create index correction_reports_article_idx on public.correction_reports (article_id);

alter table public.correction_reports enable row level security;

create trigger set_correction_reports_updated_at
  before update on public.correction_reports
  for each row execute function public.set_updated_at();

-- General contact form submissions.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status public.contact_status not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_messages_name_not_blank
    check (char_length(btrim(name)) > 0),
  constraint contact_messages_email_format
    check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint contact_messages_message_not_blank
    check (char_length(btrim(message)) > 0)
);

create index contact_messages_status_idx on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;
