-- Shopno Kotha — base extensions and enumeration types.
-- Applied first: every later migration depends on these types.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- Who a staff account is allowed to act as. Public sign-up stays disabled;
-- these rows are provisioned by an administrator.
create type public.user_role as enum ('admin', 'editor', 'reviewer');

-- The language a piece of content is authored in. Content is never
-- machine-translated, so one row carries exactly one language.
create type public.content_locale as enum ('bn', 'en');

-- Editorial workflow. Religious verification is tracked separately and is
-- never implied by reaching `published`.
create type public.article_status as enum ('draft', 'in_review', 'published', 'archived');

create type public.category_status as enum ('draft', 'published');

create type public.source_type as enum ('quran', 'hadith', 'scholarly', 'editorial', 'cultural');

-- `checked`   – text and citation matched against a public source.
-- `pending`   – plausible but still needs a second check before final use.
-- `demo`      – placeholder content that must never be shown as authentic.
create type public.verification_status as enum ('checked', 'pending', 'demo');

create type public.dua_status as enum ('draft', 'published');

create type public.review_type as enum ('editorial', 'religious');

create type public.review_status as enum ('pending', 'approved', 'changes_requested');

create type public.religious_review_status as enum ('none', 'pending', 'approved');

create type public.correction_status as enum ('open', 'reviewing', 'resolved', 'rejected');

create type public.contact_status as enum ('new', 'read', 'archived');
