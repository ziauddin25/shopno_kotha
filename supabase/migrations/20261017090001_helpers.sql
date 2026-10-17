-- Shared helper functions used by triggers across the schema.

-- Keeps `updated_at` truthful on every mutation.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'BEFORE UPDATE/INSERT trigger: stamps updated_at with now().';

-- Editorial workflow guard. Prevents skipping review (draft -> published) and
-- keeps published_at honest. Runs on insert and whenever status changes.
create or replace function public.enforce_article_status_transition()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'published' and new.published_at is null then
      new.published_at = now();
    end if;
    return new;
  end if;

  if new.status is distinct from old.status then
    if not (
      (old.status = 'draft'     and new.status in ('in_review', 'archived')) or
      (old.status = 'in_review' and new.status in ('draft', 'published', 'archived')) or
      (old.status = 'published' and new.status in ('draft', 'archived')) or
      (old.status = 'archived'  and new.status = 'draft')
    ) then
      raise exception 'Invalid article status transition: % -> %', old.status, new.status
        using errcode = 'check_violation';
    end if;
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;

  return new;
end;
$$;

comment on function public.enforce_article_status_transition() is
  'Guards the editorial status graph and stamps published_at on publish.';
