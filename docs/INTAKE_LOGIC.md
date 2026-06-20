# Intake Intelligence Logic

## Inputs

- Organization type
- Problem category
- Urgency
- Engagement scope
- Budget flexibility
- Optional email
- Honeypot field (`website`) for spam filtering

## Deterministic classification tiers

- Advisory
- Co-build sprint
- Managed system refinement
- Enterprise engagement

## Runtime behavior

1. Multi-step form validates each step before progression.
2. Classification score and rationale are generated in-browser.
3. If configured, webhook submission is attempted.
4. Structured JSON artifact is always exported locally.
5. Missing email does not block submission.

## Guardrails

- No silent failures: non-OK responses and request failures are logged.
- Honeypot submissions are ignored.
- Classification remains deterministic and explainable.
