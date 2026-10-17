# Backend setup (Supabase)

Shopno Kotha stores all content in a Supabase Postgres project. The frontend
reads through the repository layer, so the database can be swapped in without
touching page components. This document covers local setup and how to apply the
schema.

## 1. Environment variables

Copy the example file and fill in the values from your Supabase project
(**Project Settings → API**):

```bash
cp .env.example .env.local
```

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs, metadata, sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key; access governed by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS. Never expose or commit |
| `DATA_SOURCE` | server | `mock` or `supabase`. Production must be `supabase` |
| `SUPABASE_STORAGE_BUCKET` | server | Article cover bucket (default `article-covers`) |

`.env.local` is git-ignored. `.env.example` is committed and holds placeholders
only.

> The service-role key must never be prefixed with `NEXT_PUBLIC_`. If it were,
> Next.js would inline it into the browser bundle.

## 2. Apply the schema

The schema lives in `supabase/migrations/` as ordered, version-controlled SQL.
Apply it with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
# one-time: authenticate and link this folder to your project
npx supabase login
npx supabase link --project-ref <your-project-ref>

# apply every pending migration to the linked project
npx supabase db push

# (optional) recreate a full local stack + seed
npx supabase start
npx supabase db reset
```

Migrations run inside a transaction each and are applied in filename order:

| File | Contents |
| --- | --- |
| `20261017090000_extensions_and_enums.sql` | `pgcrypto`, all enum types |
| `20261017090001_helpers.sql` | `set_updated_at`, status-transition guard |
| `20261017090002_profiles.sql` | `profiles` + `auth.users` mirror trigger |
| `20261017090003_categories_and_sources.sql` | `categories`, `sources` |
| `20261017090004_articles.sql` | `articles`, `article_sources`, `article_related` |
| `20261017090005_tags.sql` | `tags`, `article_tags` |
| `20261017090006_duas.sql` | `duas`, `dua_sources` |
| `20261017090007_reviews_and_contact.sql` | `article_reviews`, `correction_reports`, `contact_messages` |
| `20261017090008_storage.sql` | `article-covers` storage bucket |
| `20261017091000_authorization_helpers.sql` | `SECURITY DEFINER` role helpers + grants |
| `20261017091001_trusted_operations.sql` | role/publish guards, `admin_set_user_role`, `record_religious_review` |
| `20261017091002_rls_policies.sql` | row-level security policies for every table |
| `20261017091003_storage_policies.sql` | storage read/upload/delete rules |

RLS is **enabled on every table**. Access is granted only through the policies in
the final two migrations, summarised in §7.

## 3. Regenerate TypeScript types

`src/types/database.ts` mirrors the schema and is hand-maintained for now.
Refresh it after changing migrations:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

Keep `src/types/database.ts` free of domain imports (see `src/types/index.ts`
for the app-facing types); rows are mapped in the repository layer.

## 4. Client utilities

| Module | Use |
| --- | --- |
| `src/lib/supabase/client.ts` | Browser client (`createClient`) for Client Components |
| `src/lib/supabase/server.ts` | Server client (`createClient`) for RSC, Server Actions, Route Handlers |
| `src/lib/supabase/admin.ts` | Service-role client (`createAdminClient`); server-only, bypasses RLS |
| `src/lib/supabase/env.ts` | Public config lookup + validation |

Only the anon key reaches the browser. All privileged operations go through the
server client or, where RLS must be bypassed deliberately, the admin client.

## 5. Data model summary

```
profiles ──< articles >── categories
   │            │  │
   │            │  └──< article_sources >── sources >── dua_sources >── duas
   │            ├──< article_related >── articles (self)
   │            ├──< article_tags >── tags
   │            └──< article_reviews
   └──< article_reviews (reviewer)

dream_topics >── categories (nullable)
   ├──< dream_topic_aliases (alias + normalized)
   ├──< dream_topic_articles >── articles
   ├──< dream_topic_duas >── duas
   └──< dream_topic_sources >── sources

correction_reports >── articles (nullable)
contact_messages (standalone)
```

Key conventions:

- **UUID primary keys** (`gen_random_uuid()`), `timestamptz` timestamps stored in
  UTC and formatted to the reader's timezone at display.
- **Bilingual data** is stored either as `_bn` / `_en` column pairs (categories,
  sources, duas, dream topics) or as one row per language (articles, keyed by
  `locale`).
- **Editorial status** (`article_status`) and **religious review**
  (`religious_review_status`) are independent. Publishing never implies
  religious approval.
- **Verification** (`checked` / `pending` / `demo`) travels with sources and
  duas; `is_demo` marks placeholder copy.
- **Dream topics** link a searchable concept (with Bengali/Banglish/English
  aliases) to existing articles, duas and sources. They carry no religious
  claim of their own — evidence tiering is derived from the linked
  `sources.type` at read time — and share the public-hiding rules of
  `categories`: only `status = 'published'` and `is_demo = false` rows are
  visible to anonymous readers.
- **Deletion**: join rows cascade with their parent; `articles.category_id`,
  `articles.author_id`, `articles.reviewed_by` and reviewer links are
  `ON DELETE SET NULL` to preserve history. `articles.deleted_at` supports soft
  deletion.

## 6. Article status workflow

Statuses: `draft → in_review → published → archived`, enforced by a database
trigger (`enforce_article_status_transition`).

| From | Allowed next |
| --- | --- |
| `draft` | `in_review`, `archived` |
| `in_review` | `draft`, `published`, `archived` |
| `published` | `draft`, `archived` |
| `archived` | `draft` |

`published_at` is stamped automatically the first time an article is published.

## 7. Authentication and authorization

### Roles

Only three roles exist (`public.user_role`):

| Role | May |
| --- | --- |
| `admin` | everything: publish/archive/delete, manage profiles, read contact submissions, change roles |
| `editor` | create/edit content, submit for review, curate sources/tags/categories; **cannot** publish or archive |
| `reviewer` | read content and record religious reviews via `record_religious_review()`; **cannot** edit article bodies |

User-editable profile fields (`display_name`) are never authoritative; authorization
always reads `public.profiles.role` on the server.

### SQL layer

- `20261017091000_authorization_helpers.sql` – `SECURITY DEFINER` role helpers with a fixed empty
  `search_path`, `STABLE`, execute revoked from `PUBLIC` and granted only to `anon`/`authenticated`/`service_role`.
- `20261017091001_trusted_operations.sql` – `prevent_profile_privilege_escalation` (nobody
  changes their own role without being an admin, and the PK is immutable), publish/archive guards
  on `articles` and `duas`, plus `admin_set_user_role()` and `record_religious_review()`.
- `20261017091002_rls_policies.sql` – per-table policies (see below).
- `20261017091003_storage_policies.sql` – `article-covers` upload/read/delete rules.

### RLS summary

| Table | anon SELECT | authenticated SELECT | writes |
| --- | --- | --- | --- |
| `profiles` | – | own row or staff | self (name only, role guarded) / admin; delete admin |
| `categories` | published | published or staff | admin only |
| `sources` | non-demo | non-demo or staff | insert/update editor-or-admin, delete admin |
| `articles` | published, not deleted | + staff (drafts) | insert/update editor-or-admin, delete admin |
| `duas` | published, non-demo | + staff | insert/update editor-or-admin, delete admin |
| `tags` | yes (public taxonomy) | yes | editor-or-admin |
| `article_sources`, `article_related`, `article_tags`, `dua_sources` | only when the parent article/dua is published | + staff | editor-or-admin |
| `article_reviews` | – | staff | insert/update reviewer-or-admin, delete admin |
| `contact_messages`, `correction_reports` | – | admin only | insert as anon (`status` = `new`/`open`), read/update/delete admin |

Storage (`article-covers`): read for everyone, insert/update for editor-or-admin, delete for admin.
No protected table has a `USING (true)` write policy.

### Application flow

1. **`src/proxy.ts`** – locale routing + `updateSession()` refresh for `/{locale}/admin` only.
   The non-localized `/auth/*` callback is excluded from the matcher. Proxy is an optimistic
   check only; it never makes authorization decisions.
2. **`src/lib/supabase/middleware.ts`** – `createServerClient` with `getAll`/`setAll`, writing
   refreshed cookies and `Cache-Control: private, no-store`.
3. **`src/lib/auth/guards.ts`** – the Data Access Layer: `getSessionProfile()` (memoized,
   `getUser()` + role from `public.profiles`), `requireStaff()`, `requireRole()`.
4. **`src/lib/auth/actions.ts`** – `signInAction` / `signOutAction`, server-side re-validated,
   generic credential errors (no account enumeration).
5. **`src/app/auth/callback/route.ts`** – PKCE code exchange with an open-redirect guard.
6. **Routes** – `/{locale}/admin/login` (sign-in) and `/{locale}/admin` (guarded layout, noindex).
   Both export `instant = false` because they read the session cookie.

There is **no public sign-up**. Staff accounts are created by an administrator.

## 8. Data access layer (repositories and services)

Pages never touch Supabase or the fixtures directly: they call the services in
`src/lib/services/`, which call the repositories in `src/lib/repositories/`. The
repository layer is the only place that knows whether it is talking to Postgres or
to the development fixtures.

### Choosing the backend

`resolveDataSource()` (`src/lib/repositories/data-source.ts`) resolves the backend:

| `DATA_SOURCE` | Supabase configured | Result |
| --- | --- | --- |
| `mock` | either | fixtures (development/tests) |
| `supabase` | yes | live database |
| `supabase` | no | **throws** `RepositoryError` (`kind: "configuration"`) |
| unset | yes | live database |
| unset | no | fixtures + a one-time startup warning |

An explicit `DATA_SOURCE=supabase` **never** falls back to fixtures: a missing
configuration or a failed query surfaces as an error instead of silently serving
placeholder content. Production must set `DATA_SOURCE=supabase`.

### Modules

| Module | Responsibility |
| --- | --- |
| `repositories/data-source.ts` | backend resolution (above) |
| `repositories/errors.ts` | `RepositoryError` with `scope` + `kind` (`database` / `validation` / `configuration`) |
| `repositories/mappers.ts` | DB row → app type (`Article`, `Category`, `SourceReference`, `Dua`, `Tag`) |
| `repositories/validation.ts` | Zod schema for every repository input |
| `repositories/shared.ts` | pagination + search helpers (`PagedResult`, `normalizePage`, `sanitizeSearchTerm`) |
| `repositories/article-repository.ts` | published listing, slug lookup, category/related/id lookups, featured, counts, search |
| `repositories/{category,source,dua,tag}-repository.ts` | remaining taxonomies |

`parseInput()` validates repository input against its Zod schema and converts
failures into a `RepositoryError`, so a malformed call never leaks a raw
`ZodError`. Services add caching and presentation-shaped results on top.

### Public-read guarantees

- Public queries filter `status = 'published'` (and `deleted_at is null`) even
  though RLS already does, so drafts, archived rows and review notes cannot
  escape if a policy is later loosened.
- Sources with `verification = 'demo'` are filtered in **both** backends, so an
  unapproved source is never rendered.
- Duas with `verification = 'demo'` are filtered in **both** backends as well, so a
  placeholder dua can never be presented as authentic scripture. Staff still see
  demo duas in the CMS (`is_staff()`), and `is_demo` remains a display label rather
  than a hiding rule — the same way an `is_demo` article is shown with a notice.
- Only the anon key reaches the browser. Cacheable public reads use
  `createPublicClient()` (`src/lib/supabase/public.ts`), which is cookie-free and
  therefore safe inside `"use cache"`; the service-role client stays server-only.

### Search

`searchArticles()` matches `title`/`summary` with a case-insensitive substring
(`ilike`) and `keywords` as an exact, quoted array element
(`keywords.cs.{"…"}`). Terms are sanitized (`sanitizeSearchTerm`) before they
touch the PostgREST `or` expression, and array elements are quoted
(`toArrayLiteralElement`) so a Bengali or multi-word phrase is treated as one
value instead of being parsed as array grammar. Keyword matching is exact-tag,
not substring: parity with the fixture substring search over keywords would
require a generated search column, which is deferred.

### Dream search

The core journey — describe a dream, get published guidance — is backed by
`dream_topics` and four child tables (aliases + article/dua/source links). The
data path is the usual one: `dreamTopicRepository.getPublishedDreamTopics()`
returns published, non-demo topics with their aliases and link ids;
`src/lib/services/dream-search-service.ts` ranks them and hydrates each match
with the linked articles (`getArticlesByIds`), duas (`getDuasByIds`) and sources
(`getSourcesByIds`).

Ranking lives in the pure, dependency-free `src/lib/dream/ranking.ts` so the
fixture and Supabase paths behave identically:

- Text is normalised once (`normalizeDreamText`: NFKC, lower-case, punctuation
  stripped, whitespace collapsed — combining marks are preserved so Bengali
  words stay intact).
- Each topic's aliases plus both titles are scored: exact match `1.0`, prefix
  `0.9`, full token containment `0.74–0.78`, substring `≥0.68`, otherwise a
  Sørensen–Dice bigram coefficient scaled by `0.7`.
- Matches below `0.55` are dropped and at most 4 are returned. An unrecognised
  description returns **no** matches by design, so the UI can show a safe
  "we do not have this yet" state instead of guessing an interpretation.
- Evidence tier per match is `scripture` (quran/hadith source linked),
  `scholarly`, or `educational` — never a claim that the dream means something.

The migration enables `pg_trgm` and keeps a trigger-maintained `normalized`
column with a GIN trigram index on `dream_topic_aliases` for a future
database-side search; matching today is done in the service so mock and Supabase
rank identically. The public UI is `DreamSearchResults` / `DreamSearchBox`
(rendered on `/dream-guidance` and folded into `/search`); it fails soft, so a
failed dream query never takes down the article search beside it.

### Caching

Supabase read functions are wrapped in `"use cache"` + `cacheLife("hours")` +
`cacheTag(...)` (`articles`, `categories`, `sources`, `duas`, `tags`,
`dream-topics`, plus per-entity tags) so database reads do not force dynamic
rendering and the admin layer can `revalidateTag` after an edit. The fixture
path is intentionally uncached so fixture edits stay HMR-fresh.

### Pagination

`listPublishedArticles()` and `searchArticles()` accept `{ page, pageSize }` and
return `{ items, total, page, pageSize, totalPages }`, backed by `.range()` and
`count: "exact"`. Bounded call sites use it today (home: 5 latest, featured: 1,
counts via `getPublishedArticleFacts()`); no route puts a page number in the URL yet.

### Failure states

`src/app/[locale]/error.tsx` is the route-level error boundary for the locale
segment — it renders the localized `error.*` copy and a retry button if a database
read throws. Missing content still goes through each page's `notFound()`, and empty
lists render the existing empty states.

### Mock fixtures

`src/data/mock/` is the fixture backend behind `DATA_SOURCE=mock` and the only
remaining mock dependency; no service or component imports it directly. There is no
tag fixture, so `tagRepository` returns `[]` in mock mode.

## 9. Manual Supabase setup

These cannot be automated in code and need your action in the Supabase dashboard:

1. **Disable public sign-ups** – *Authentication → Providers → Email* (or *Sign In / Providers*):
   turn off public sign-up so nobody can self-register.
2. **Create your first administrator** – invite yourself from *Authentication → Users* (or use a
   temporary service-role script), then promote the profile:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```

   After that, admins change other roles through `select public.admin_set_user_role(...)` —
   never with a direct `update`, which the trigger would reject unless run as `postgres`.
3. **Set `.env.local`** from `.env.example` (project URL, anon key, service-role key).
4. **Apply migrations** – `npx supabase db push` (see §2).

## 10. Verification status

- `npx tsc --noEmit` **passes** with no diagnostics; `npx next typegen` succeeds.
- `npm run lint` reports **0 errors** and 2 **pre-existing** unused-variable warnings
  (`contact-form.tsx`), none in the data layer.
- `next build` (`DATA_SOURCE=mock`) **succeeds** (exit 0, 68/68 static pages). The
  earlier `blocking-prerender-dynamic` failure was a fixture-mode artifact: fixture reads
  are intentionally uncached, so pages that call a service directly could not build a
  static shell. The routes that read data (`/[locale]`, `categories`, `categories/[slug]`,
  `articles/[slug]`, `sources`, `duas`, `dream-guidance`) now export `instant = false` —
  the documented Cache Components opt-out (the admin pages already use it) — so they block
  on the server instead of prerendering. Remove those opt-outs once reads are cached for
  every data source. The Supabase reads are already `"use cache"`-wrapped, so a real
  `DATA_SOURCE=supabase` build should prerender them; that has not been run (see below).
- Every public route was smoke-tested against the running fixture backend
  (`DATA_SOURCE` unset): `/bn`, `/bn/categories`, `/bn/categories/dream-types`, `/bn/sources`,
  `/bn/duas`, `/bn/islamic-dreams`, `/bn/dream-guidance`, `/bn/search?q=dream`, `/en/sources`,
  article pages and Bengali search all return 200; a draft slug and an unknown slug correctly
  return 404.
- The locale error boundary (`src/app/[locale]/error.tsx`) renders correctly in both
  languages (Bengali/English copy + retry button).
- **Dream search was verified against the running fixture backend**: ranking was
  exercised directly (`rankDreamTopics` over the mock topics — Bengali, Banglish
  and English queries match the expected topics; unrecognised descriptions such
  as "I saw a snake in my dream" return no matches), and the live routes
  `GET /bn/dream-guidance?dream=dua before sleep`, `?dream=I saw a snake…`,
  `/bn/dream-guidance` (browse) and `/en/search?q=bad dream` all returned 200
  with the expected topic, evidence label and article-search sections. The
  Supabase-backed dream path is **not** runtime-verified (see the migration note
  below).
- The **Supabase-backed path is not runtime-verified**: no Postgres/Supabase instance or
  CLI was available, so `DATA_SOURCE=supabase` could not be exercised end to end. Query
  shapes, filters, mappers and pagination are covered by static review and type-checking only.
- The SQL migrations and RLS policies have **not been executed**. `supabase/tests/rls_checks.sql`
  is an executable specification (static catalog checks, then anonymised anon/editor/admin/storage
  behavioral checks, plus a role-escalation attempt) that must be run against a local Supabase
  before the policies can be considered verified. Nothing in this document should be read as
  "RLS tested".
- Security-audit fixes applied but **not yet run against a database**: `handle_new_user` now uses
  `set search_path = ''` (all references schema-qualified); the `duas` / `dua_sources` policies and
  the dua repository hide `verification = 'demo'` from the public; `rls_checks.sql` asserts the
  18-table inventory (and flags missing RLS or an unexpected table) and covers demo-dua hiding for
  anon vs staff; the search filter quotes keyword array elements. These are verified by static
  review and type-checking only until `rls_checks.sql` is executed. The five dream-topic tables
  (`20261017092000_dream_topics.sql` + `20261017092001_dream_topics_rls.sql`), their `pg_trgm`
  extension, `normalize_dream_text()` trigger and their RLS policies are likewise **unexecuted**;
  `rls_checks.sql` now also seeds a published/draft/demo topic and asserts anonymous visibility.
