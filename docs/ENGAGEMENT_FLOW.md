# Engagement Intake Flow

## Purpose

The intake flow collects structured lead context without requiring backend infrastructure. It classifies engagement fit client-side and always resolves with a success state, even when optional delivery channels are unavailable.

## Data captured

`components/IntakeForm` captures:

- Organization type
- Problem category
- Urgency
- Engagement scope (`one-off`, `build-with`, `managed-refinement`)
- Budget flexibility range (`constrained`, `moderate`, `strategic`)

All fields are validated in-browser with a strict `zod` schema before submission.

## Classification

`lib/intakeClassifier.ts` computes a heuristic score from intake signals and maps to one of:

1. `advisory-sprint`
2. `build-partnership`
3. `managed-program`

The classifier also returns rationale and a recommended next-step summary used in the tailored confirmation view.

## Routing and delivery behavior

On submit, the form produces a structured JSON payload:

```json
{
  "type": "lead-intake",
  "submittedAt": "ISO timestamp",
  "intake": { "...": "validated selections" },
  "classification": { "tier": "...", "score": 0, "rationale": [] }
}
```

Delivery behavior is intentionally resilient:

- If `NEXT_PUBLIC_INTAKE_WEBHOOK_URL` is present, the app sends the JSON payload with `fetch`.
- If the env var is absent, payload data is logged safely in the browser.
- If delivery fails or returns non-OK, the UI still renders confirmation and recommended path.

This guarantees no hard failure path and keeps the site static-first.

## Architecture constraints

- No API route or server action required.
- No database or third-party backend dependency required.
- Works in static-export mode with graceful degradation.
