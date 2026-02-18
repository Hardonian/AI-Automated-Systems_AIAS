# AIAS Security Disclosure (Repository Reference)

Last updated: 2026-02-18

## Security model summary

AIAS public site follows a static-first model with minimal server-side attack surface. Intake classification runs client-side with bounded inputs and graceful degradation.

## Current controls

- Deterministic route checks in CI/verification scripts.
- Client-side schema validation for intake fields.
- Spam honeypot field in intake flow.
- No required first-party API/backend for public routes.

## Limitations and non-claims

- AIAS does not represent this public site as formally SOC 2 or ISO 27001 certified unless expressly documented elsewhere.
- Optional third-party webhook forwarding introduces processor-dependent risk outside first-party hosting controls.

## Vulnerability reporting

Report suspected vulnerabilities to: scottrmhardie@gmail.com.
Include reproduction steps and impact assessment where possible.
