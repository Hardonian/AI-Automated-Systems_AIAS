# Governed Intake Router Blueprint

## Problem
Inbound demand is frequently triaged manually, causing inconsistency and delayed response times.

## Constraints
- Deterministic scoring only
- No backend requirement for initial qualification
- Human escalation for risk-tiered accounts

## Architecture
1. Intake form captures firmographic and risk indicators.
2. Deterministic score matrix computes engagement fit.
3. Policy gate determines escalation vs direct recommendation.
4. Structured brief artifact exported for operator review.

## Implementation Notes
- Keep rubric weights versioned in source control.
- Block final recommendation when mandatory governance fields are missing.
- Emit summary JSON for auditability and handoff.
