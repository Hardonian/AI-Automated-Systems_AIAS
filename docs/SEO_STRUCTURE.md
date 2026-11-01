# SEO Structure

## Hierarchy

- One clear H1 per page via page hero.
- H2 sections aligned to explicit page intent.

## Structured data

- Organization schema in root layout.
- Professional service schema in root layout.
- Service schema on focused service pages.
- FAQ schema on homepage FAQ block.

## Internal linking

- Homepage links to ecosystem architecture, automation demo, and checklist assets.
- Services page links to service-specific routes.
- Case studies index links to structured `[slug]` pages.

## Metadata intent

- Each new route has explicit metadata title, description, and canonical path.
- Sitemap includes new marketing and case-study routes.

## Schema-critical routes

- `/` (service list + FAQ schema markers)
- `/blog` (blog collection schema marker)
- `/case-studies/[slug]` (case-study article schema marker on each prerendered detail page)

## Answer Engine Optimization (AEO) & Distribution

- Explicit AI bot crawler rules in `app/robots.ts` welcoming `GPTBot`, `ClaudeBot`, `PerplexityBot`, and indexers to `/llms.txt`.
- Structured citation mappings in `public/llms.txt` and `public/llms-full.txt`.
- Developer community launch packages in [Community Distribution Kit](./COMMUNITY_DISTRIBUTION_KIT.md).
