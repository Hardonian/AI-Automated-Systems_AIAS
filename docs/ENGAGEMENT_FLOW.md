# Engagement Intake Flow

## Purpose

The intake flow collects structured lead context without requiring backend infrastructure. It classifies engagement fit client-side and always resolves with a success state, even when optional delivery channels are unavailable.

## Data captured

`components/IntakeForm` captures:

- Organization type
- Problem category
- Current AI stack and model mix
- Primary failure mode
- Governance maturity
- Urgency
- Engagement scope (`one-off`, `build-with`, `managed-refinement`)
- Budget flexibility range (`constrained`, `moderate`, `strategic`)
- Contact identity, organization, work email, and a bounded workflow summary
- Catalog shortlist and first-touch campaign attribution when present

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
  "contact": { "name": "...", "organization": "...", "email": "..." },
  "workflowSummary": "sanitized operating context",
  "catalogSelection": [],
  "attribution": { "source": "...", "medium": "...", "campaign": "..." },
  "intake": { "...": "validated selections" },
  "classification": { "tier": "...", "score": 0, "rationale": [] },
  "delivery": { "provider": "none", "requestedFollowUp": "fit-review" }
}
```

Delivery behavior is intentionally resilient:

- `NEXT_PUBLIC_INTAKE_PROVIDER=none` keeps the workflow entirely local.
- `formspree` sends a Formspree-compatible body; `custom` sends the full typed payload.
- Delivery also requires a verified HTTPS `NEXT_PUBLIC_INTAKE_WEBHOOK_URL`.
- If delivery fails or returns non-OK, the UI still renders confirmation and recommended path.
- A structured JSON artifact is always downloaded. The confirmation also offers a human-readable Markdown decision brief, email handoff, and booking handoff.

This guarantees no hard failure path and keeps the site static-first.

## Attribution and funnel events

The client preserves `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, first landing path, and referrer in session storage. Analytics emits only bounded operational labels for form start, validation blocks, completed steps, delivery outcome, and handoff actions; free-text workflow or contact data is never sent to analytics.

## Provider activation

Do not set production delivery variables until the receiving endpoint is owned, tested, and covered by an appropriate privacy/retention process. Custom provider origins must also be added explicitly to the Content Security Policy in `vercel.json`.

## Architecture constraints

- No API route or server action required.
- No database or third-party backend dependency required.
- Works in static-export mode with graceful degradation.
