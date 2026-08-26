# Agent Guidelines & Invariants

This project follows a strict "Backendless" architecture for the public-facing consultancy site.

## Invariants

1. **No Backend**: Do not introduce server-side logic (API routes, server actions, DB calls) unless absolutely critical and marked as optional with graceful degradation.
2. **Static First**: All content must be renderable at build time or via client-side JSON.
3. **Type Safety**: Strictly typed content via `src/content/site.ts`. No `any` in content models.
4. **Deterministic Builds**: `pnpm verify` must pass before merging.

## Contributor Workflow

1. Edit content in `src/content/site.ts`.
2. Run `pnpm dev` to preview.
3. Run `pnpm verify` before finalizing.
4. Run `pnpm test:e2e` for smoke + link crawl checks.

## What to update for business copy

- Services, process, FAQs, legal text, social links, CTA labels/hrefs, and engagement examples are in `src/content/site.ts`.
- Prefer editing content there instead of hardcoding strings in components.

---

# AIAS – AGENTS.md (Master Pack)

Last Updated: 2026-02-18

## Purpose

Defines autonomous agent roles, responsibilities, and constraints for **AIAS**.

## Global Principles

- Production-grade output only (no placeholders)
- Deterministic file changes; prefer minimal diffs
- Never delete content unless directly conflicting with newer validated structure
- Optimize for clarity, minimal context usage, and high leverage
- User routes must never hard-500 (graceful degradation)

## Agent Roles

- **Architecture Agent:** system design, invariants, boundaries, modular cohesion
- **Code Quality Agent:** lint/typecheck/build, hydration/perf passes, vulnerability hygiene
- **Design Agent:** visual system integrity, tokens, UI coherence, hero/motion alignment
- **Infrastructure Agent:** CI/resilience, env validation, security hardening, deploy readiness
- **Release Agent:** changelog discipline, versioning, smoke verification, rollback notes
- **Documentation Agent:** README/CHANGELOG/ADR updates, eliminates redundancy

## Injection Protocol

When new constraints/skills are added:

1. Append new capability or rule.
2. Refine for clarity and remove duplication.
3. Preserve prior decisions unless superseded by verified improvements.
