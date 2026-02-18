# AIAS Dependency + Marketing Claim Audit

## Dependency risk snapshot

### Observations

- Stack is modern and active (`next`, `react`, `zod`, Radix ecosystem, Playwright).
- `pnpm` overrides are present to constrain known vulnerable transitive packages.
- An audit command exists (`audit:ci`) for high-severity production dependency checks.

### Risks

1. **Supply-chain volatility** from large transitive frontend ecosystem.
2. **License governance gap**: no dedicated SBOM/license-report artifact committed.
3. **Operational drift** if audit cadence is not enforced in CI for every release.

### Recommendation

- Add automated license report + SBOM generation in CI and archive outputs with release artifacts.

---

## Marketing claim integrity findings

### High-risk statements requiring precision

- “SOC 2 Ready”
- “PIPEDA Compliant”
- “Enterprise Secure”
- “10x Faster Deployment”
- “10+ hrs/week saved per employee”

### Why they are risky

- Certification-adjacent language can imply completed attestation.
- Performance claims can be interpreted as guaranteed across all clients.

### Defensible correction pattern

- Reframe to **control-oriented** statements: “SOC 2-aligned controls available per engagement scope.”
- Add explicit qualifier: “Outcomes vary by workflow complexity, baseline process maturity, and client adoption constraints.”
- Keep a claim-to-evidence map internally for investor/customer diligence.

---

## SEO and metadata integrity

- Route metadata coverage is programmatically enforced.
- No evidence of hardcoded false compliance badges in metadata fields was found in route files.
- Primary inflation risk is business copy in centralized content, not technical metadata plumbing.

## Compliance non-implication check

- This repository should not imply SOC2/ISO certification status unless officially achieved and documented.
- Legal docs now include explicit non-certification language to reduce ambiguity.
