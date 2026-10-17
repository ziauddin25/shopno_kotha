-- Authorization that cannot be expressed as a row policy: column- and
-- value-level rules, plus the trusted server-side operations that perform
-- privileged changes on behalf of an authorized user.
--
-- Publish/archive authority is enforced by triggers rather than policies
-- because RLS cannot compare OLD and NEW column values. Role changes are
-- guarded here so that even a future permissive UPDATE policy cannot let a
-- user promote themselves.

-- ---------------------------------------------------------------------------
-- Role changes (profiles.role is authoritative; display_name is not)
-- ---------------------------------------------------------------------------

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Primary key is immutable.
  if new.id is distinct from old.id then
    raise exception 'profiles.id is immutable' using errcode = 'check_violation';
  end if;

  -- Service-role, migrations and scripts run without a JWT subject and are
  -- trusted; they may set any role (used only for bootstrap/administration).
  if (select auth.uid()) is null then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only administrators may change a profile role'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

create trigger prevent_profile_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_privilege_escalation();

-- Trusted operation for promoting/demoting staff. Prefer this over a direct
-- UPDATE so the caller cannot bypass the guard and cannot alter their own role
-- (which could lock the team out of the last admin account).
create or replace function public.admin_set_user_role(
  p_user_id uuid,
  p_role public.user_role
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Only administrators may change roles'
      using errcode = 'insufficient_privilege';
  end if;

  if p_user_id = (select auth.uid()) then
    raise exception 'Administrators cannot change their own role'
      using errcode = 'insufficient_privilege';
  end if;

  update public.profiles
    set role = p_role
    where id = p_user_id
    returning * into result;

  if result.id is null then
    raise exception 'Profile % not found', p_user_id
      using errcode = 'no_data_found';
  end if;

  return result;
end;
$$;

-- ---------------------------------------------------------------------------
-- Editorial workflow authority
-- ---------------------------------------------------------------------------

-- Editors may draft, submit for review and withdraw, but only administrators
-- may publish or archive. The status graph itself is enforced separately by
-- enforce_article_status_transition().
create or replace function public.guard_article_workflow()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;

  if new.status in ('published', 'archived')
     and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    raise exception 'Only administrators may publish or archive articles'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

create trigger guard_article_workflow
  before insert or update on public.articles
  for each row execute function public.guard_article_workflow();

-- Duas have no review stage, but publishing them is still admin-only.
create or replace function public.guard_dua_workflow()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;

  if new.status = 'published'
     and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    raise exception 'Only administrators may publish duas'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

create trigger guard_dua_workflow
  before insert or update on public.duas
  for each row execute function public.guard_dua_workflow();

-- ---------------------------------------------------------------------------
-- Religious review (separate from editorial publication)
-- ---------------------------------------------------------------------------

-- Reviewers record a religious review without holding UPDATE rights on
-- articles. Writes the review row and syncs the denormalized summary on the
-- article in one trusted transaction.
create or replace function public.record_religious_review(
  p_article_id uuid,
  p_status public.review_status,
  p_notes text default ''
)
returns public.article_reviews
language plpgsql
security definer
set search_path = ''
as $$
declare
  reviewer uuid := (select auth.uid());
  inserted public.article_reviews;
  next_review_status public.religious_review_status;
begin
  if not public.is_reviewer_or_admin() then
    raise exception 'Only reviewers may record religious reviews'
      using errcode = 'insufficient_privilege';
  end if;

  if reviewer is null then
    raise exception 'Authentication required' using errcode = 'insufficient_privilege';
  end if;

  insert into public.article_reviews (article_id, reviewer_id, review_type, status, notes)
  values (p_article_id, reviewer, 'religious', p_status, coalesce(p_notes, ''))
  returning * into inserted;

  next_review_status := case p_status
    when 'approved' then 'approved'::public.religious_review_status
    else 'pending'::public.religious_review_status
  end;

  update public.articles
    set religious_review_status = next_review_status,
        reviewed_by = case
          when p_status = 'approved' then reviewer
          else reviewed_by
        end
    where id = p_article_id;

  return inserted;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

revoke execute on function public.admin_set_user_role(uuid, public.user_role) from public;
grant execute on function public.admin_set_user_role(uuid, public.user_role) to authenticated;

revoke execute on function public.record_religious_review(uuid, public.review_status, text) from public;
grant execute on function public.record_religious_review(uuid, public.review_status, text) to authenticated;
