# Dependency Governance

Last reviewed: September 10, 2026

## Release controls

The public site uses a locked pnpm dependency graph. Release verification includes linting, strict TypeScript checks, unit tests, secret scanning, security-invariant checks, a production static build, bundle budgets, and route/content validation.

## Supply-chain review

- Pull requests that change dependencies receive dependency-diff review.
- Production dependencies are audited for known high-severity vulnerabilities.
- A software bill of materials is generated as a CI artifact on the security cadence.
- License and transitive dependency exceptions require explicit review rather than silent allowlisting.
- Package overrides are documented in `package.json` and should be removed when upstream constraints make them unnecessary.

## Remediation priorities

| Priority | Condition                                              | Expected action                                                        |
| -------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| P0       | Known exploitable issue on the public execution path   | Block release; patch, remove, or isolate the dependency                |
| P1       | High-severity issue with a credible reachable path     | Remediate before the next release or document a time-bounded exception |
| P2       | Unreachable, development-only, or lower-severity issue | Track with owner, rationale, and review date                           |

## Evidence and cadence

The lockfile is the authoritative resolved dependency record. CI artifacts provide time-bound evidence; they are not permanent proof that a future build is vulnerability-free. The scheduled security workflow refreshes audit and SBOM evidence weekly, and every release still runs the deterministic repository checks.
