# Required Skills

Contributors (and agents) should master the following:

## Frontend Architecture

- **Next.js App Router**: Static-first route rendering.
- **Client Components**: Interactive UI islands (such as `workflow-sandbox`).
- **Tailwind CSS**: Utility-first styling and consistent spacing.

## Content Management

- **Type-Safe CMS Pattern**: Keep business content centralized in `src/content/site.ts`.
- **Truthful Messaging**: Label non-client proof as “Example engagements” and avoid invented claims.

## Verification

- **ESLint**: `pnpm lint`
- **TypeCheck**: `pnpm typecheck`
- **Build**: `pnpm build`
- **Smoke + Link Crawl**: `pnpm test:e2e`
- **Gate**: `pnpm verify`
