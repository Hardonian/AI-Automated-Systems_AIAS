# AIAS Platform

AIAS is a static-first authority surface for agentic automation consulting that converts operational pain into governed, production-ready systems.

<!-- BEGIN: REPO HERO -->
![Repository hero generated locally on the GPU stack](assets/repo-hero.png)
<!-- END: REPO HERO -->

## Ecosystem Positioning

AIAS is the advisory and orchestration layer in a broader delivery ecosystem:

- **AIAS** defines strategy, governance boundaries, and rollout sequencing.
- **Reach** handles demand shaping and qualification strategy.
- **Zeo** executes implementation and integration.
- **Settler** supports operationalization, deployment handoff, and ongoing governance.

See [`docs/ECOSYSTEM_POSITIONING.md`](docs/ECOSYSTEM_POSITIONING.md) and [`docs/ECOSYSTEM_ARCHITECTURE.md`](docs/ECOSYSTEM_ARCHITECTURE.md) for the full model.

## Consulting Methodology

AIAS engagements use a deterministic delivery lifecycle:

1. **Discover constraints** (workflow, policy, risk, and ownership).
2. **Design the smallest safe system** (contracts, control points, escalation paths).
3. **Pilot with explicit acceptance criteria** (latency, quality, and governance checks).
4. **Scale with handoff artifacts** (runbooks, review cadences, and operating dashboards).

Detailed method: [`docs/CONSULTING_METHOD.md`](docs/CONSULTING_METHOD.md).

## Automation Philosophy

- Deterministic systems own state transitions and policy enforcement.
- AI is bounded to advisory, summarization, and optimization tasks.
- Human review gates high-impact operations.
- Every automation path includes fallback and replayability.

Security and operating baseline: [`docs/SECURITY_POSTURE.md`](docs/SECURITY_POSTURE.md).

## Governance Principles

- **Policy before execution**: no high-risk action without explicit guardrails.
- **Least privilege by default**: only required access is granted.
- **Auditability as a product requirement**: each engagement produces reviewable artifacts.
- **Graceful degradation**: public routes remain usable even when optional dependencies fail.

Deployment boundaries: [`docs/DEPLOYMENT_MODELS.md`](docs/DEPLOYMENT_MODELS.md).

## Open-Source Alignment

This repository is intentionally:

- **Backendless for the public site** (static-first, no mandatory runtime API).
- **Type-safe for business content** (`src/content/site.ts` is the source of truth).
- **Deterministically verifiable** through reproducible `pnpm verify` checks.

## Community Funnel

### Newsletter (static and optional)

AIAS uses a static-first approach for newsletter onboarding:

- A newsletter CTA can point to a third-party form provider.
- The site does not require backend signup infrastructure to remain functional.
- If newsletter infrastructure is unavailable, community onboarding still works through docs + direct contact.

### Contribution Pathway

1. Open an issue describing your suggested improvement.
2. Align scope with backendless + static-first invariants.
3. Submit a PR with focused changes and verification output.
4. Ensure `pnpm verify` passes before requesting review.

### Ecosystem Entry Links

- Reach and Zeo relationship overview: [`docs/ECOSYSTEM_POSITIONING.md`](docs/ECOSYSTEM_POSITIONING.md).
- Live ecosystem architecture map: [`docs/ECOSYSTEM_ARCHITECTURE.md`](docs/ECOSYSTEM_ARCHITECTURE.md).

### Case Study Structure

Use the standard evidence format documented in [`docs/CASE_STUDY_STRUCTURE.md`](docs/CASE_STUDY_STRUCTURE.md).

## Repo Truth

- **Framework:** Next.js App Router + TypeScript + Tailwind CSS
- **Package manager:** pnpm
- **Architecture:** Static-first + client-side interactivity only
- **Backend dependencies:** None required for runtime
- **Primary content source:** `src/content/site.ts`
- **Deployment assumption:** Static content on Vercel/Node hosting with no required server env vars

## Content Editing

Update business copy in `src/content/site.ts` for:

- Services
- Process
- FAQs
- Legal text
- CTA labels and hrefs
- Engagement examples

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

## Frontend Invariants

- No backend routes, server actions, database calls, or webhook dependencies.
- No hidden runtime env requirements for site rendering.
- Broken/missing content degrades to safe UI defaults.

## Add a new panel page

1. Update source content in `src/content/site.ts`.
2. Create a route in `app/<route>/page.tsx`.
3. Add the route to `siteContent.navigation` and `app/sitemap.ts`.
4. Run `pnpm verify`.
