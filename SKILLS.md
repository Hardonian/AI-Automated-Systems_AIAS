# Required Skills

Contributors (and agents) should master the following:

## Frontend Architecture
- **Next.js App Router**: Static export optimizations.
- **Client Components**: Interactive UI islands (like `workflow-sandbox`).
- **Tailwind CSS**: Utility-first styling for speed and consistency.

## Content Management
- **Type-Safe CMS**: All content lives in `src/content/site.ts`. Never hardcode text in components if it belongs in the 'CMS'.
- **Structured Data**: Ensure SEO components match the TS interfaces.

## Verification
- **ESLint**: Respect the rules. No `any`, no unused vars.
- **TypeCheck**: `tsc --noEmit` must pass cleanly.
- **Playwright**: Smoke tests for critical paths only.
