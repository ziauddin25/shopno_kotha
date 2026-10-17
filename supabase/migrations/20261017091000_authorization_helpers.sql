-- Authorization helpers used by Row Level Security policies.
--
-- Every helper is:
--   * STABLE            – one value per statement, so the planner evaluates it once
--   * SECURITY DEFINER  – reads public.profiles as the owner, bypassing that
--                         table's own RLS (no recursion) and hiding the query
--   * search_path = ''  – empty, so every reference below is schema-qualified
--                         and cannot be hijacked by a caller-controlled schema
--
-- A caller with no session (anonymous, or service-role/script context where
-- `auth.uid()` is NULL) gets FALSE, never a privilege.

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.profiles
  where id = (select auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'editor'
  );
$$;

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'reviewer'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'editor', 'reviewer')
  );
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or public.is_editor();
$$;

create or replace function public.is_reviewer_or_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or public.is_reviewer();
$$;

-- Functions are EXECUTE-able by PUBLIC by default; drop that and grant only to
-- the roles that evaluate policies. No function here mutates data, so
-- read-only execution is safe.
revoke execute on function
  public.current_user_role(),
  public.is_admin(),
  public.is_editor(),
  public.is_reviewer(),
  public.is_staff(),
  public.is_editor_or_admin(),
  public.is_reviewer_or_admin()
from public;

grant execute on function
  public.current_user_role(),
  public.is_admin(),
  public.is_editor(),
  public.is_reviewer(),
  public.is_staff(),
  public.is_editor_or_admin(),
  public.is_reviewer_or_admin()
to anon, authenticated, service_role;
