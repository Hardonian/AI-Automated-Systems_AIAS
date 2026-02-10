# AIAS Platform

Frontend-only, backendless consultancy website for AI Automated Systems (AIAS).

## Repo Truth

- **Framework:** Next.js App Router + TypeScript + Tailwind CSS
- **Package manager:** pnpm
- **Architecture:** Static-first + client-side interactivity only
- **Backend dependencies:** None required for runtime
- **Primary content source:** `src/content/site.ts`
- **Deployment assumption:** Static content on Vercel/Node hosting with no required server env vars

## Edit Content in One Place

All business copy, CTAs, services, process, FAQ, legal content, and engagement examples live in:

- `src/content/site.ts`

If Calendly is unavailable, the primary CTA gracefully falls back to `mailto:`.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm verify
```

`pnpm verify` runs lint → typecheck → test → build → smoke e2e + internal link crawl.

## CTA Configuration

- Primary CTA label/href: `siteContent.positioning.primaryCTA`
- Fallback behavior: invalid/non-Calendly primary href auto-falls back to `mailto:${siteContent.contact.email}`
- Secondary CTA: `siteContent.positioning.secondaryCTA`
- Contact fallback: copy-email button in final CTA section

## Frontend Invariants

- No backend routes, server actions, database calls, or webhook dependencies.
- No hidden runtime env requirements for site rendering.
- Broken/missing content should degrade to safe UI defaults.
