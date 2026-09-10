# Static Release Scorecard

Last updated: 2026-09-10

## Verified baseline

| Control                     | Current evidence          | Budget or target                          | Status |
| --------------------------- | ------------------------- | ----------------------------------------- | ------ |
| Deterministic release suite | `pnpm verify` passed      | All checks pass                           | Green  |
| Unit tests                  | 55 passed across 12 files | Zero failures                             | Green  |
| Static generation           | 68 pages generated        | All public routes prerender               | Green  |
| JavaScript output           | 1.74 MB total             | At most 3.00 MB                           | Green  |
| Largest gzip chunk          | 83.5 KB                   | At most 250 KB                            | Green  |
| Built-link validation       | 59 HTML files checked     | Zero broken internal links                | Green  |
| Browser smoke suite         | 13 tests passed           | Zero failures                             | Green  |
| CI surface                  | 6 reviewed workflows      | No stale backend or missing-script jobs   | Green  |
| Public trust artifacts      | 6 maintained documents    | No placeholders or unsupported guarantees | Green  |

## Closed hot paths

1. Documentation discovery now routes to real pages and portable evidence instead of hash placeholders.
2. Release integrity blocks placeholder links, trust-template leakage, and workflow architecture drift.
3. CI is consolidated around the static release contract, browser verification, security/SBOM, dependency review, performance, and static metrics.
4. Shared button composition no longer requires an untyped motion-prop spread.
5. Public legal and trust copy now uses one consistent advisory, certification, data, ownership, continuity, and service-level boundary.

## Ongoing operating cadence

- Every change: `pnpm verify`.
- Before handoff: `pnpm test:e2e`.
- Every dependency change: dependency review.
- Weekly: security audit, CodeQL, SBOM, Lighthouse, bundle, and static quality evidence.
- Quarterly or after a material business change: review legal, trust, continuity, claims, and diligence documents.

This scorecard reports repository evidence only. Commercial throughput, incident response, client outcomes, recovery exercises, and staffing coverage require their own current evidence sources.
