# AIAS Dependency + Marketing Claim Audit

Last reviewed: 2026-09-10

## Dependency posture

### Implemented controls

- The pnpm lockfile is the authoritative resolved dependency graph.
- Pull requests receive dependency-diff review and fail on high-severity findings.
- The security workflow audits production dependencies, runs repository security controls, performs CodeQL analysis, and archives an SPDX SBOM.
- `pnpm verify` enforces strict types, unit tests, static architecture, secret and security checks, a production build, route/schema/link validation, and bundle budgets.
- Package overrides constrain known transitive risk and remain visible in `package.json`.
- The public dependency-governance document defines severity and exception handling.

### Residual risks

- A frontend dependency graph changes as packages and advisories evolve.
- SBOM and audit artifacts are time-bound evidence, not proof that future builds are vulnerability-free.
- License interpretation and exploitability can require human review.

## Marketing claim integrity

The release posture now uses these boundaries:

- security statements describe controls, not an unearned certification;
- PIPEDA is treated as legislation rather than a product certification;
- service levels apply only through executed support schedules;
- outcome metrics are contextual observations or models, not universal promises;
- case studies identify evidence strength and constraints;
- public calculators disclose assumptions.

The public trust policy, security posture, service-response framework, privacy notice, terms, and disclaimer carry these boundaries in visitor-accessible language.

## Regression protection

`pnpm check:release-integrity` rejects public trust templates, placeholder hash links, unsupported certification/availability language in trust documents, unreviewed workflows, missing workflow scripts, non-blocking release checks, and backend workflow dependencies.

## Review cadence

- Every code release: deterministic verification and claim audit.
- Every dependency pull request: dependency-diff review.
- Weekly: production dependency audit, CodeQL, and SBOM refresh.
- On any material business or certification change: trust documents and claim evidence reviewed before publication.
