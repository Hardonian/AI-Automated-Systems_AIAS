# Agent Guidelines & Invariants

This project follows a strict "Backendless" architecture for the public-facing consultancy site.

## Invariants

1. **No Backend**: Do not introduce server-side logic (API routes, server actions, DB calls) unless absolutely critical and marked as optional with graceful degradation.
2. **Static First**: All content must be renderable at build time or via client-side JSON.
3. **Type Safety**: Strictly typed content via `src/content/site.ts`. No `any`.
4. **Deterministic Builds**: `pnpm verify` must pass before merging.

## Contributor Workflow

1. Edit content in `src/content/site.ts`.
2. Run `pnpm dev` to preview.
3. Run `pnpm verify` to ensure linting and type safety.
4. Run `pnpm test:e2e` to verify critical flows.

## Adding Features

- **New Page**: Create `app/page-name/page.tsx`. Use client components for interactivity.
- **New Content**: Add field to `SiteConfig` interface in `src/content/site.ts` first, then implementing component.
