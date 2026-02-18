# AIAS Hostile Red-Team Simulation

## Objective

Model a motivated attacker targeting AIAS public surfaces for data exposure, trust erosion, abuse of automation narratives, and downstream compromise.

## Attack scenarios

### 1) Prompt injection via contact/intake

- **Attempt**: submit manipulative text intended to poison downstream AI decisioning.
- **Exploitability**: **Low-Medium** (current intake is mostly enum-bound with optional email only, limiting free-form payload injection).
- **Impact**: primarily downstream process contamination if webhook consumers later feed payloads into LLMs without sanitization.
- **Current defenses**: strict client schema + bounded enums + honeypot.
- **Hardening**: enforce schema validation and instruction-stripping on any downstream webhook consumer.

### 2) Exploiting demo logic

- **Attempt**: use demo as evidence of guaranteed autonomous capabilities, then pressure social-engineered transactions.
- **Exploitability**: **Medium** (reputational/social exploit, not code exploit).
- **Impact**: credibility and sales-channel trust damage.
- **Current defenses**: demo describes static/safe walkthrough.
- **Hardening**: add explicit “demo is non-production illustrative flow” banner and anti-impersonation reporting path.

### 3) Overwhelming intake endpoint

- **Attempt**: high-rate submissions to saturate downstream webhook destination.
- **Exploitability**: **Medium-High** if webhook is enabled without rate limiting.
- **Impact**: degraded lead processing, potential cost amplification.
- **Current defenses**: no first-party backend exposure; honeypot only.
- **Hardening**: downstream rate limiting, bot mitigation, and signed webhook acceptance.

### 4) SEO poisoning via metadata narratives

- **Attempt**: exploit over-strong claims and keyword stuffing to create reputational/legal pressure via competitor challenge.
- **Exploitability**: **Medium** (content governance issue).
- **Impact**: legal challenge, trust erosion, ranking volatility.
- **Current defenses**: route metadata checks and messaging contract constraints.
- **Hardening**: create claims substantiation register mapping each bold claim to evidence source.

### 5) Supply-chain injection via dependency compromise

- **Attempt**: compromise upstream package used by build/runtime.
- **Exploitability**: **Medium** (ecosystem-wide risk).
- **Impact**: build compromise, client-side malicious payloads.
- **Current defenses**: pnpm overrides, audit script.
- **Hardening**: locked CI provenance checks, scheduled audit + dependency diff review, optional integrity verification pipeline.

### 6) Phishing imitation of brand assets

- **Attempt**: clone public site and impersonate inquiry channels.
- **Exploitability**: **High** (public assets are easy to replicate).
- **Impact**: lead theft, reputation damage, possible fraud.
- **Current defenses**: none explicit in repository docs.
- **Hardening**: publish official domain policy, DMARC/SPF/DKIM operational checklist, abuse reporting channel, and signed proposal workflow.

---

## Red-team conclusion

The highest-probability attacks are **social/reputational** and **downstream webhook abuse**, not direct exploitation of server-side vulnerabilities (because the public site has minimal backend surface). Defensive maturity should therefore prioritize claim governance, downstream intake controls, and anti-impersonation operations.
