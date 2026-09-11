# Required Skills

Contributors (and agents) should master the following:

## Frontend Architecture

- **Next.js App Router**: Static-first route rendering and performance hardening.
- **Client Components**: Interactive UI islands (such as `workflow-sandbox` and `diagnostic-wizard`).
- **Tailwind CSS**: Utility-first styling, consistent tokens, and WCAG AA contrast.

## Visual & Creative Engineering

- **Gemini Image Pro**: 4K hero image generation and composition.
- **Veo 3.1**: Seamless 8–12s motion loop production without visual noise.
- **Stitch UI**: Enterprise consulting aesthetic, clean panels, and token normalization.
- **Token Discipline**: Preserving design system tokens in `design/tokens.json`.

## Content Management

- **Type-Safe CMS Pattern**: Keep business content centralized in `src/content/site.ts`.
- **Truthful Messaging**: Label non-client proof as “Example engagements” and avoid invented claims.

## Operational & Governance

- **Deterministic Logic**: Enforce boundaries between deterministic logic and probabilistic AI inference.
- **CI Resilience**: Maintain zero-flake static verification and automated release integrity.
- **Hydration & Boundaries**: Prevent hydration mismatches; implement graceful fallback UI.

## Verification

- **ESLint**: `pnpm lint`
- **TypeCheck**: `pnpm typecheck`
- **Build**: `pnpm build`
- **Smoke + Link Crawl**: `pnpm test:e2e`
- **Gate**: `pnpm verify`
