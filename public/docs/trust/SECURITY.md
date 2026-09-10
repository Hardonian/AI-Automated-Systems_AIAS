# Security Posture

Last reviewed: September 10, 2026

## Scope

This document describes the public AIAS consultancy site in this repository. It does not describe every client delivery environment, and it is not a third-party certification or attestation.

## Public-site architecture

- The site is exported as static HTML, CSS, and JavaScript.
- Public routes do not require a database, account system, server action, or runtime API.
- Interactive tools process user inputs in the browser unless a user deliberately follows an external contact or scheduling link.
- Build checks reject server routes, database clients, unresolved internal links, exposed secrets, and material metadata drift.

This design reduces the public attack surface. It does not make browsers, hosting providers, analytics providers, or linked third-party services risk-free.

## Delivery-environment baseline

Client implementations are separately scoped. Depending on the system and statement of work, the baseline may include:

- least-privilege identities and connector scopes;
- environment-separated credentials owned by the client;
- encryption in transit and provider-managed encryption at rest;
- schema validation before state transitions;
- human approval for high-impact or low-confidence actions;
- tamper-evident or replayable operating records;
- rollback, retry, and incident-response procedures;
- dependency, secret, and release checks.

Specific controls, hosting regions, retention periods, recovery objectives, and audit obligations must be named in the signed engagement documents.

## Compliance and certification boundary

AIAS uses control-oriented practices and can map controls to a client's requirements. AIAS does not claim SOC 2, ISO 27001, PIPEDA certification, or any other independent certification unless a current verification is explicitly published. PIPEDA is legislation, not a product certification.

## Vulnerability reporting

Report a suspected vulnerability privately to `security@aiautomatedsystems.ca`. Include the affected URL or artifact, reproduction steps, likely impact, and a safe contact channel. Do not include live client data or secrets.

AIAS will acknowledge a valid report as soon as practical, triage its scope, and coordinate remediation and disclosure based on severity and affected-party obligations.
