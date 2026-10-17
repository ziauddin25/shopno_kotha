# Shopno Kotha — Project Progress

> Living status document for the Shopno Kotha (স্বপ্নকথা) project — frontend and
> backend. **Last updated: 2026-10-17.**

Shopno Kotha is a calm, evidence-first Islamic education site about dreams. It
publishes source-linked writing (Quran, hadith, scholarly and editorial
references), duas for sleep and dreams, and — the core product feature — a
**dream search** where a reader describes a dream in Bengali, Banglish or
English and is shown the published topics, articles, duas and sources that
address it. The project never claims a dream has one fixed meaning and never
invents citations.

---

## Status at a glance

| Area | Status |
| --- | --- |
| Public frontend (bn/en) | ✅ Complete — builds and renders |
| Design system + layout | ✅ Complete |
| Public data layer (repositories/services) | ✅ Complete (mock + Supabase paths) |
| Supabase schema + RLS migrations | ✅ Written (⏳ not yet run against a DB) |
| Dream search (core journey) | ✅ Implemented + verified on fixture backend |
| Admin CMS | 🟡 Foundation built, routes/UI not finished |
| Supabase runtime verification | ⛔ Blocked — no Postgres/Supabase/Docker available |
| Tests | ⚠️ Only `supabase/tests/rls_checks.sql` (spec, unexecuted) |

---

## Tech stack

- **Framework:** Next.js 16.4.2 (App Router, Turbopack, Cache Components /
  Partial Prefetching), React 19, TypeScript (strict).
- **Styling:** Tailwind CSS v4, shadcn-style UI primitives on `@base-ui/react`,
  `lucide-react` icons.
- **Validation:** Zod v4.
- **Backend:** Supabase (Postgres + Auth + Storage) via `@supabase/ssr` and
  `@supabase/supabase-js`.
- **Scripts:** `dev`, `build`, `start`, `lint` (ESLint). No test runner.

---

## Frontend

### Routes (App Router, localized under `/[locale]` = `bn` | `en`)

| Route | Purpose |
| --- | --- |
| `/[locale]` | Home — hero, guidance cards, featured + recent articles, trust section |
| `/[locale]/about` | Editorial principles and limits |
| `/[locale]/islamic-dreams` | Article listing |
| `/[locale]/articles/[slug]` | Article detail (body, sources, related, share) |
| `/[locale]/categories` | Category grid |
| `/[locale]/categories/[slug]` | Articles in a category |
| `/[locale]/dream-guidance` | **Dream search entry point** + etiquette guidance + duas |
| `/[locale]/duas` | Duas for sleep and dreams |
| `/[locale]/sources` | Sources & policy |
| `/[locale]/contact` | Contact form |
| `/[locale]/privacy` | Privacy |
| `/[locale]/search` | Search — dream-topic results + article results |
| `/[locale]/admin/login` | Staff sign-in |
| `/[locale]/admin` (protected) | Admin dashboard (placeholder) |
| `/auth/callback` | Supabase auth callback (route handler) |
| `error.tsx`, `not-found.tsx` | Localized error and 404 surfaces |

### Components (`src/components/`)

- **layout/** — `site-header`, `nav-links`, `mobile-navigation`,
  `language-switcher`, `brand-link`, `site-footer`.
- **home/** — `home-hero`, `rotating-dream-card`, `guidance-cards`,
  `editorial-trust-section`.
- **articles/** — `article-card`, `article-list`, `article-body`,
  `featured-article`, `related-articles`, `share-button`.
- **categories/** — `category-card`, `category-grid`.
- **duas/** — `dua-card` (Arabic, transliteration, meaning, citation, status).
- **search/** — `search-box`.
- **dreams/** — `dream-search-box`, `dream-search-results` (matches + browse).
- **sources/** — `source-reference-card`.
- **contact/** — `contact-form`.
- **common/** — `verification-badge`, `notice-box`, `empty-state`,
  `error-state`, `skeletons`, `section-heading`, `category-icon`.
- **ui/** — shadcn-style primitives (button, badge, card, input, textarea,
  select, switch, table, tabs, dialog, dropdown-menu, alert, label, separator,
  skeleton).

### Internationalization & content

- Two locales (`bn`, `en`) with a typed message dictionary in
  `src/messages/{bn,en}.ts` (`en` is structurally typed against `bn`, so both
  must stay in sync). A `dreamSearch` section was added for the core feature.
- Content is authored per language and never machine-translated; articles carry
  a `locale` and the UI flags foreign-language articles.
- Metadata, navigation and formatting helpers in `src/lib/`
  (`metadata.ts`, `navigation.ts`, `format.ts`, `i18n.ts`, `site.ts`).

### Design

- Calm, low-fear aesthetic (forest/sage/gold palette). Consistent badges for
  **verification** (`checked` / `pending` / `demo`) and for article status.
- Localized RTL-aware Arabic rendering in article bodies and duas.

---

## Backend (Supabase)

### Data model

Base tables (public schema): `profiles`, `categories`, `sources`, `articles`,
`article_sources`, `article_related`, `tags`, `article_tags`, `duas`,
`dua_sources`, `article_reviews`, `correction_reports`, `contact_messages`, plus
the dream-search tables `dream_topics`, `dream_topic_aliases`,
`dream_topic_articles`, `dream_topic_duas`, `dream_topic_sources` (**18 total**).

Enum types: `user_role`, `content_locale`, `article_status`, `category_status`,
`source_type`, `verification_status`, `dua_status`, `review_type`,
`review_status`, `religious_review_status`, `correction_status`,
`contact_status`.

Key conventions:

- UUID primary keys; timestamptz stored in UTC.
- Bilingual data as `_bn` / `_en` column pairs, or one row per language
  (articles).
- Editorial status and **religious review status** are independent — publishing
  never implies religious approval.
- `verification` (`checked` / `pending` / `demo`) travels with sources and duas;
  `is_demo` marks placeholder copy that must never be shown as authentic.
- Demo and unpublished content is hidden from anonymous readers by RLS.

### Migrations (`supabase/migrations/`)

1. `20261017090000_extensions_and_enums` — `pgcrypto` + all enums
2. `20261017090001_helpers` — `set_updated_at`, article status transition guard
3. `20261017090002_profiles` — profiles + `handle_new_user` trigger
4. `20261017090003_categories_and_sources`
5. `20261017090004_articles` — articles + link tables + workflow guard
6. `20261017090005_tags`
7. `20261017090006_duas` — duas + `dua_sources`
8. `20261017090007_reviews_and_contact`
9. `20261017090008_storage`
10. `20261017091000_authorization_helpers` — `is_admin`, `is_editor`,
    `is_reviewer`, `is_staff`, `is_editor_or_admin`, `is_reviewer_or_admin`
11. `20261017091001_trusted_operations` — `record_religious_review`,
    `admin_set_user_role`, profile escalation guard
12. `20261017091002_rls_policies` — RLS for all content tables
13. `20261017091003_storage_policies`
14. `20261017092000_dream_topics` — dream tables + `normalize_dream_text()` +
    `pg_trgm` + trigram index
15. `20261017092001_dream_topics_rls` — RLS for the dream tables

### Authorization

- Roles: `admin`, `editor`, `reviewer`. Public sign-up is intended to stay
  **disabled**; accounts are provisioned by an admin.
- Authz helpers are `STABLE` / `SECURITY DEFINER` with `search_path = ''`, used
  inside RLS policies.
- Role changes go through `admin_set_user_role`; a trigger blocks
  self-promotion.
- Article workflow (`draft → in_review → published → archived`) is enforced by
  trigger; only admins may publish/archive.
- RLS: anonymous readers see only published content and non-demo
  sources/duas/dream topics; writes are restricted to editor/admin (delete:
  admin). Internal tables (`article_reviews`, `correction_reports`,
  `contact_messages`) are staff/admin only.

### Storage

- Public bucket `article_covers`: public read, editor/admin write, admin delete.

---

## Data access layer

Architecture (strict): **pages → services (`src/lib/services`) → repositories
(`src/lib/repositories`) → data source**. Repositories are the only place that
knows mock vs Supabase.

- `data-source.ts` resolves the backend: explicit `DATA_SOURCE` wins; otherwise
  Supabase when configured, else fixtures. `DATA_SOURCE=supabase` never falls
  back.
- **Public repositories:** `article`, `category`, `source`, `dua`, `tag`,
  `dream-topic` — published-only filtering and demo hiding on **both** backends.
  Pagination returns `{ items, total, page, pageSize, totalPages }`.
- **Admin repositories:** `admin-{article,category,source,dua,tag,review}` with
  Zod validation (`admin-validation.ts`), row mappers, typed errors
  (`AdminRepositoryError`) and a cookie-aware Supabase client (RLS-scoped,
  uncached).
- **Services:** `search-service`, `article-service`, `contact-service`,
  `admin-service`, and `dream-search-service`.
- **Supabase clients:** `public` (anon), `server` (cookie/SSR), `client`
  (browser), `admin` (service-role — server only, never exposed), plus `env`
  and `middleware`.
- **Caching:** Supabase reads use `"use cache"` + `cacheLife("hours")` +
  `cacheTag(...)` so the admin layer can `revalidateTag` after edits. Fixture
  reads are intentionally uncached.
- **Mock fixtures:** `src/data/mock/` (`articles`, `categories`, `sources`,
  `duas`, `dream-topics`) — used only when `DATA_SOURCE=mock`.

---

## Dream search (core feature)

Describe a dream → get published guidance. Backed by `dream_topics` and its
child tables (aliases + article/dua/source links).

- **Data:** `dreamTopicRepository.getPublishedDreamTopics()` returns published,
  non-demo topics with aliases and link ids.
- **Ranking:** pure, dependency-free `src/lib/dream/ranking.ts` (so the fixture
  and Supabase paths rank identically). Text is normalised (NFKC, lower-case,
  punctuation stripped, combining marks preserved); aliases and titles are
  scored (exact `1.0`, prefix `0.9`, token containment `0.74–0.78`, substring
  ≥`0.68`, else Sørensen–Dice bigram × `0.7`). Matches below `0.55` are dropped;
  at most 4 returned.
- **Conservative by design:** an unrecognised description returns **no**
  matches, so the UI shows a safe "we do not have this yet" state instead of
  guessing.
- **Evidence tiering:** each match is labelled `scripture` (Quran/hadith source
  linked), `scholarly`, or `educational` — never a meaning claim.
- **Hydration:** matches are filled with linked articles (`getArticlesByIds`),
  duas (`getDuasByIds`) and sources (`getSourcesByIds`).
- **UI:** `DreamSearchBox` + `DreamSearchResults`, rendered on `/dream-guidance`
  and folded into `/search`. It fails soft, so a failed dream query never breaks
  the article search beside it.
- **Future scaling:** `pg_trgm` and a trigger-maintained `normalized` column
  with a GIN index are in place for a database-side search when the topic count
  grows.

---

## Admin CMS

Foundation is in place, user-facing routes are not:

- Auth guards (`requireStaff`, `requireRole`, memoized session profile) and
  login (`admin/login`, `admin/login-form`), guarded `admin/(protected)` layout.
- Admin repository + validation + workflow-mirror layers.
- **Not yet built:** dashboard, article/category/source/tag/dua/dream-topic
  management screens, server actions, and imagery upload UI.

---

## Verification & checks

- `tsc --noEmit` — **passes**, no diagnostics.
- `npm run lint` — **0 errors**; 2 pre-existing unused-variable warnings in
  `contact-form.tsx` (none in the data/backend layer).
- `DATA_SOURCE=mock next build` — **succeeds** (exit 0, 68/68 pages).
- Dream search verified against the running fixture backend (Bengali, Banglish
  and English queries match expected topics; unrecognised descriptions return
  nothing) and the live routes `/bn/dream-guidance` and `/en/search` render the
  expected sections.
- **Not verified:** the Supabase-backed path and the SQL migrations/RLS. No
  Postgres/Supabase/Docker/CLI was available, so `DATA_SOURCE=supabase` has not
  been exercised and `supabase/tests/rls_checks.sql` has not been run. All SQL
  is static-review/type-check-only until then.

---

## Known limitations / next steps

1. **Run the backend for real** — create a Supabase project, set `.env.local`
   (URL, anon key, service-role key), apply migrations
   (`npx supabase db push`), and run `supabase/tests/rls_checks.sql`.
2. **Disable public sign-ups** in Supabase and provision the first admin.
3. **Finish the Admin CMS** — dashboard and content/dream-topic management,
   server-side authz on every privileged page/action, and `revalidateTag` wiring.
4. **Remove tooling workarounds** — drop the `instant = false` opt-outs once
   every data source reads through cached functions.
5. **Add automated tests** — there is no JS/TS test runner today; only the SQL
   RLS spec exists.
6. **Optional:** a database-side dream search (`search_dream_topics` RPC) using
   the existing `pg_trgm` index and `normalize_dream_text()` function.







backend prompts: maybe completed 4 prompts):

# Shopno Kotha — Backend Integration Roadmap

## PROMPT 0 — Audit Existing Project First

You are working on my existing project, **স্বপ্নকথা (Shopno Kotha)**. The frontend is mostly implemented. Your first task is to inspect the current codebase and prepare a backend integration plan.

Before changing anything:

1. Inspect the project structure, `package.json`, Next.js version, App Router structure, TypeScript configuration, Tailwind setup, UI components, existing routes, mock data, forms, search functionality, language switcher, and current admin preview if present.
2. Identify every page and component currently using hardcoded or mock data.
3. Identify all existing features that must remain visually and functionally intact.
4. Check the current routing, server/client component boundaries, validation patterns, and error handling.
5. Identify existing dependencies and reuse them where appropriate. Do not reinstall or duplicate dependencies.
6. Report the recommended Supabase architecture, database entities, authentication approach, required environment variables, and implementation phases.

### Constraints
- Do not create a new Next.js project.
- Do not redesign the existing frontend.
- Do not delete existing working features.
- Do not install dependencies or modify files during this audit.
- Do not assume a feature exists until you inspect the code.

At the end, provide:
- Current architecture summary
- Existing mock-data locations
- Proposed database schema
- Proposed route and component integration plan
- Security risks and migration risks
- Exact implementation order

Wait for my approval before implementing the backend.

---

## PROMPT 1 — Supabase Foundation and Database Schema

After I approve the audit, integrate Supabase into the existing project using a secure, maintainable architecture compatible with the installed Next.js version.

Use Supabase PostgreSQL for data, Supabase Auth for authentication, and Supabase Storage for article images.

### Requirements

1. Configure the appropriate Supabase browser and server clients using the supported `@supabase/ssr` approach, if compatible with the current project.
2. Read configuration from environment variables. Create `.env.example` containing placeholder names only.
3. Never expose the Supabase service-role key or any privileged secret to browser code.
4. Create version-controlled SQL migrations. Do not rely on manual dashboard-only schema changes.
5. Use UUID primary keys, appropriate foreign keys, timestamps, indexes, constraints, and sensible deletion behavior.
6. Store timestamps consistently and display them in the appropriate local timezone.
7. Add database types and generate or maintain TypeScript types for queries.

### Suggested entities

- `profiles`: user profile and role
- `categories`: bilingual category names, slug, description, status
- `articles`: bilingual title, slug, excerpt, content, cover image, category, author, status, SEO fields, timestamps, published date
- `article_sources`: source title, URL or bibliographic reference, source type, evidence classification, notes
- `article_tags` and `tags`: article tagging
- `article_reviews`: review status, reviewer, review notes, and timestamps
- `duas`: Arabic text, Bengali translation, transliteration, references, and publication status, if the current frontend includes a dua section
- `correction_reports`: reports submitted by readers and their resolution status, if appropriate

Adjust the schema to the existing frontend and actual product requirements. Avoid unnecessary tables or fields.

### Article workflow

Support statuses such as `draft`, `in_review`, `published`, and `archived`. Define and enforce valid transitions in server-side logic. Only published and publicly available content should be accessible to anonymous visitors.

Do not mark content as religiously verified merely because an admin published it. Track editorial publication and religious review as distinct concepts.

### Deliverables

- SQL migrations
- Database relationship summary
- TypeScript database types
- Supabase client utilities
- Environment-variable documentation
- Setup instructions for creating the Supabase project and applying migrations

Do not put real credentials into source control. Run the available checks and report any blockers.

---

## PROMPT 2 — Authentication, Roles, and Database Security

Implement secure admin authentication and authorization.

### Authentication
- Use Supabase Auth with the appropriate server-side session handling for the installed Next.js version.
- Implement admin login, logout, session persistence, and appropriate error messages.
- Protect admin routes on the server.
- Do not rely on hiding buttons or client-side redirects as security controls.
- Do not expose public admin registration.
- Provide a safe, documented method for promoting the initial administrator. Do not hardcode credentials or allow anonymous users to assign themselves an admin role.

### Authorization
- Define the minimum necessary roles, such as `admin`, `editor`, and `reviewer`, only if the workflow needs them.
- Enforce permissions in server-side operations and database RLS policies.
- Public users may read published content and its approved public references.
- Only authorized staff may create or modify content.
- Restrict publishing, role changes, review approval, and deletion to authorized roles.
- Users must never be able to elevate their own privileges by editing profile data.
- Protect private review notes, unpublished content, and correction-report details.

### Row Level Security
Enable RLS on every table exposed through the Supabase Data API. Write explicit policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` as applicable. Avoid broad policies that allow all authenticated users to modify all rows.

Keep privileged operations server-side and verify the current user's role before executing them.

### Deliverables
- RLS migrations
- Role and permission matrix
- Secure server-side authorization helpers
- Login and logout integration
- Unauthorized and unauthenticated states
- Tests or reproducible checks proving that anonymous visitors cannot modify content and non-admin users cannot publish or change roles

Do not claim security is complete unless the actual policies and relevant checks have been implemented.

---

## PROMPT 3 — Create a Backend Service Layer

Connect the existing frontend to Supabase through a clean data-access layer.

### Architecture
Create a repository/service abstraction that separates database operations from UI components. Adapt the directory structure to the existing project rather than imposing a new architecture unnecessarily.

For example, use equivalents of:
- `lib/supabase/`
- `lib/validators/`
- `lib/auth/`
- `repositories/`
- `services/`
- `types/`

Use Zod if it is already installed or if adding it is justified for request validation.

### Required behavior
- Fetch published articles for the homepage.
- Fetch featured and latest articles according to the existing UI.
- Fetch articles by slug and return a proper not-found state.
- Fetch categories and category-specific articles.
- Search article titles, excerpts, and supported content fields.
- Add pagination and deterministic sorting.
- Fetch related articles.
- Fetch approved public source references.
- Fetch published duas if the current frontend supports them.
- Handle loading, empty results, network/database errors, and missing records.
- Validate slugs and request parameters.
- Prevent unpublished content from leaking through public queries.

Avoid fetching the entire database into the browser and filtering it locally.

### Mock-data migration
Keep the existing mock data available as fixtures for tests and local development if useful, but do not silently use fake data as a fallback when a production database request fails.

Create a clear configuration or dependency boundary for mock and Supabase repositories. Production mode must not silently display demo articles when Supabase is unavailable.

Keep React Server Components for data-driven pages where practical, and use Client Components only for genuine interactivity.

Do not change the current visual design. Preserve the existing page layouts, responsive behavior, Bengali/English switcher, and component API wherever practical.

---

## PROMPT 4 — Build the Admin CMS

Turn the existing admin preview into a functional, protected content-management system. If no admin interface exists, add one that matches the current design system.

### Article management
- List, search, filter, sort, and paginate articles.
- Create and edit Bengali and English article fields.
- Generate a slug from the selected primary-language title, with collision checks.
- Allow a manually edited slug and preserve existing URLs when possible.
- Save drafts and submit content for review.
- Preview articles before publication.
- Publish, unpublish, archive, and restore articles according to permissions.
- Confirm destructive actions.
- Show validation errors and save/publish feedback.
- Track creation, editing, publishing, and review timestamps.

### Editorial and Islamic-source management
- Add, edit, and remove source references with proper authorization.
- Record the type of evidence and the actual reference details.
- Distinguish Quran, Hadith, scholarly interpretation, and cultural belief where relevant.
- Track religious review separately from ordinary editorial approval.
- Never invent quotations, references, hadith grading, or scholarly approvals.
- Do not permit publication as verified unless the required review information is genuinely recorded and the applicable workflow is satisfied.

### Media
- Integrate Supabase Storage for cover images.
- Validate file type and size.
- Use unique storage paths.
- Restrict uploads and deletions to authorized staff.
- Handle upload failures and orphaned files safely.
- Store image metadata in the database when useful.

### Other content
Implement category, tag, and dua management only when those features are part of the existing product scope.

Build reusable forms and tables, and reuse existing UI components. Add accessible labels, keyboard support, confirmation dialogs, loading states, and empty states.

Every admin action must call a real, authorized backend operation. Do not leave fake buttons or simulated save success.

---

## PROMPT 5 — Connect Every Public Frontend Page

Now connect the existing public website to the real database without redesigning it.

Audit every route and remove its dependency on hardcoded production content where applicable.

### Integration checklist
- Homepage: real featured and latest articles, real categories.
- Search: database-backed results, query validation, loading, empty and error states.
- Category pages: real category information, filtered articles, pagination.
- Article details: fetch by slug, render bilingual content correctly, show approved source references and related articles.
- Dua pages: fetch only published records and display source details where implemented.
- Language switcher: display the corresponding language fields without losing the current article or category context.
- Header, footer, and navigation: preserve current behavior.
- Missing or unpublished articles: proper not-found behavior.
- All links, buttons, filters, forms, and pagination controls: verify that they work.

Do not introduce a second source of truth for content. Avoid duplicating the same article data in multiple components.

Use server-side fetching for public pages when appropriate. Keep private admin data and privileged credentials out of client bundles.

If the current frontend has sections that are intentionally static, leave them static unless there is a clear requirement to manage them through the CMS.

At completion, report every page connected and every intentionally static or deferred feature.

---

## PROMPT 6 — Search, SEO, and Performance

Implement production-ready content discovery and SEO using the existing Next.js architecture.

### SEO
- Unique metadata titles and descriptions for articles and categories.
- Canonical URLs and correct Open Graph metadata.
- Dynamic sitemap containing only eligible public URLs.
- `robots.txt` configuration that does not accidentally block public content or expose private routes.
- Appropriate structured data only when its fields are accurate and supported.
- Correct handling of missing, unpublished, and archived article URLs.
- Bengali and English metadata when corresponding translations exist.

### Search and performance
- Add suitable PostgreSQL indexes for slugs, publication status, category filtering, and common search operations.
- Use database-side pagination and filtering.
- Avoid unnecessary client-side JavaScript and duplicate requests.
- Use optimized image delivery and appropriate caching/revalidation.
- Ensure newly published or edited content appears within a clearly defined cache-revalidation window.
- Do not cache personalized admin responses publicly.
- Add rate limiting to abuse-prone public endpoints where appropriate, using an implementation suitable for the deployment environment.

Do not install an external search service unless the current database-backed search is demonstrably insufficient.

Verify Bengali text rendering, mobile usability, accessibility, and page metadata.

---

## PROMPT 7 — Final Integration Audit and Production Readiness

Perform an end-to-end audit of the complete frontend/backend integration.

### Functional tests
- Anonymous visitor reads published articles.
- Anonymous visitor cannot access admin data or perform admin operations.
- Authorized admin can create and edit a draft.
- Authorized staff can submit an article for review.
- Only appropriately authorized users can approve or publish.
- Publishing makes an article available on the public website.
- Unpublishing removes it from public queries and public sitemap output.
- Search, filters, categories, pagination, and article slugs work correctly.
- Failed database requests display proper error states.
- Invalid inputs are rejected.
- Image upload and cleanup behave safely.
- Language switching preserves the relevant route.
- Missing and unpublished articles return the correct result.

### Engineering checks
- Run the project's existing lint, TypeScript, and production-build commands.
- Add or update tests for critical services, authorization rules, and content workflows.
- Check for hydration issues, unsafe HTML rendering, leaked secrets, broken links, and unnecessary client-side data exposure.
- Check database constraints, RLS policies, and migration consistency.
- Do not disable lint rules, TypeScript checks, or security protections merely to make the build pass.

### Deployment documentation
Provide:
- Required environment variables and where to configure them.
- Supabase project setup and migration instructions.
- Safe initial-admin setup.
- Storage bucket and access-policy setup.
- Local development instructions.
- Vercel deployment instructions.
- A production smoke-test checklist.
- Any known limitations or unfinished features.

Do not deploy, delete production data, change live credentials, or perform destructive database migrations without explicit approval.

### Final report
Summarize:
1. What was implemented.
2. Which files changed.
3. Database tables and RLS policies created.
4. Which pages use real data.
5. Tests and build results, with actual outcomes.
6. Required manual setup steps.
7. Remaining risks and next steps.

Never claim that a test passed unless it was actually run successfully.