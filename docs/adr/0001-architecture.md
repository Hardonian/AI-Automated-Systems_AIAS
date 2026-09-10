# ADR 0001: Static-First Public Architecture

## Status

Accepted

## Context

The public consultancy site needs a small, dependable operating surface that
can be built deterministically and hosted without an application backend.

## Decision

- Framework: Next.js 16 App Router, React 19, and strict TypeScript.
- Rendering: static export for every public route.
- Content: typed configuration in `src/content/site.ts` plus reviewed portable
  Markdown artifacts under `public/`.
- Runtime data: browser-local state or explicit client-side JSON only.
- Backend services: excluded from this repository. Client engagements may use
  separately scoped infrastructure, but no such dependency is required here.
- Deployment: any static host; Vercel is supported but not required.

## Consequences

- Public pages remain available without a database, queue, or server function.
- Interactive demos must identify illustrative data and degrade safely.
- `pnpm verify` enforces static generation, content integrity, links, metadata,
  security boundaries, and bundle budgets before release.
- A future server-side capability requires a new ADR and explicit approval
  because it changes the project's security and operational model.
