-- Staff profiles, one row per authenticated user.
-- `role` is the single source of truth for authorization; it is never
-- self-assigned (RLS policies, added in the next prompt, will block that).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'editor',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length
    check (display_name is null or char_length(display_name) <= 120)
);

alter table public.profiles enable row level security;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Mirror every new auth user into a profile. Runs as the table owner so the
-- insert bypasses RLS during sign-up/invite. Role falls back to the least
-- capable staff role; an admin promotes explicitly afterwards.
--
-- search_path is empty so the SECURITY DEFINER body cannot be redirected by a
-- caller-controlled schema; every reference below is schema-qualified (the only
-- unqualified names are pg_catalog built-ins, which are always searched first).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function public.handle_new_user() is
  'AFTER INSERT trigger on auth.users: creates the matching public.profiles row.';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
