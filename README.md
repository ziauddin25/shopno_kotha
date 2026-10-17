# Shopno Kotha (স্বপ্নকথা)

Shopno Kotha is a bilingual Bengali and English educational website about dreams and Islamic guidance. Its goal is to help readers explore the topic calmly and responsibly, with sources, verification status, uncertainty, and editorial limits made visible alongside the content.

The site provides educational information; it does not interpret individual dreams, predict the future, or replace advice from a qualified scholar or health professional.

## Project status

This repository is Phase 1: a frontend prototype powered by local mock data. It demonstrates the reader experience and editorial presentation, but it is not a production publishing system. There is no database, authentication, protected admin area, or backend contact submission. Demo interactions are temporary and do not persist after a refresh.

## What the site includes

- Bengali (`bn`) and English (`en`) interfaces, with Bengali as the default locale and locale-prefixed URLs.
- A homepage with a featured article, recent articles, topic categories, search, and editorial trust information.
- Article listings, category browsing, article detail pages, related articles, and source references.
- Dream guidance pages covering pleasant and disturbing dreams and the limits of interpretation.
- Dua listings with Arabic text, transliteration, translation, occasion, and source status.
- Search over published article titles, summaries, and curated keywords, with locale and category filters.
- About, sources and editorial policy, contact, and not-found pages.
- Responsive navigation, language switching, sharing/copy-link controls, metadata, and accessible loading, empty, and error states.
- Visible content labels: `checked`, `pending`, and `demo`. These communicate the state of the supplied content; they do not imply scholar review.

## Routes

All pages use a locale prefix (`/bn` or `/en`). The locale middleware redirects unprefixed page paths to Bengali.

| Path | Purpose |
| --- | --- |
| `/[locale]` | Home |
| `/[locale]/dream-guidance` | General guidance and limits |
| `/[locale]/islamic-dreams` | Published article index |
| `/[locale]/articles/[slug]` | Article detail |
| `/[locale]/categories` | Topic category index |
| `/[locale]/categories/[slug]` | Articles in a category |
| `/[locale]/search` | Search published articles |
| `/[locale]/duas` | Dua reference cards |
| `/[locale]/sources` | Sources and editorial policy |
| `/[locale]/about` | Project purpose and limitations |
| `/[locale]/contact` | Contact form demonstration |

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Base UI and local shadcn-style UI components
- Lucide icons

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/bn`.

Available scripts:

```bash
npm run dev    # Start the local development server
npm run build  # Build the production app
npm run start  # Serve the production build
npm run lint   # Run ESLint
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin when deploying. It defaults to `http://localhost:3000` and is used for canonical and social metadata.

## Project layout

```text
src/
  app/[locale]/          Locale-aware pages and layouts
  components/            Page sections, navigation, forms, and UI primitives
  data/mock/             Sample articles, categories, duas, and sources
  lib/repositories/      Async data access over the mock datasets
  lib/services/          Page data orchestration, search, contact, and admin helpers
  messages/              Bengali and English interface copy
  types/                 Shared content and locale types
public/                  Static assets
```

Repositories currently read local arrays in `src/data/mock/` and add a small simulated delay. The service layer composes repository results for pages. This boundary is intended to make a future data-source replacement easier, but no database adapter is included in this phase.

## Content and editorial model

Articles include a locale, category, publication status, body blocks, source IDs, related article IDs, keywords, and demo/review metadata. Source records identify the kind of reference and its verification state. Dua records include Arabic, transliteration, translation, source links, and a flag for editorial translations.

When adding or editing content, retain the distinction between sourced claims, editorial explanations, culturally common beliefs, and sample/demo copy. The interface and policy pages explicitly state that the current dataset has not received scholar review. Demo passages must not be presented as authentic scripture or scholarly opinion.

## Prototype limitations

- Content is bundled mock data, not remotely managed content.
- Contact form validation and success feedback are demonstrations; messages are not sent or stored.
- The admin preview mentioned in interface copy is not a secure publishing system. No authenticated admin route or server-side persistence is included in the current route tree.
- Search is a simple case-insensitive substring match over titles, summaries, and keywords; it is not a full-text search engine.
- Some entries are sample content and are explicitly marked as demo or pending verification.

## Next.js guidance

This project includes repository-specific Next.js agent instructions in `AGENTS.md`. Before changing application code, consult the installed Next.js guides under `node_modules/next/dist/docs/`; this repository's Next.js version may differ from conventions in older examples.
