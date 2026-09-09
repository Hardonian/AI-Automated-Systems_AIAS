# Governed Intake Router — Delivery Specification

## Purpose and operating boundary

Use this blueprint when an organization needs a quick, explainable first-pass recommendation for advisory, co-build, or managed work. The router collects only the facts required for that decision, evaluates a versioned deterministic rubric, and produces a reviewable brief. A language model may summarize submitted context, but it must not calculate the recommendation, alter the score, send commercial commitments, or bypass the named human owner.

## Required inputs

| Input | Rule | Why it matters |
| --- | --- | --- |
| Organization profile | Required; unknown values are explicit | Keeps qualification assumptions visible |
| Objective and workflow | Required | Anchors the recommendation in a defined outcome |
| Systems and data context | Required for implementation routes | Identifies integration and residency constraints |
| Risk indicators | Required | Drives escalation before commitments are made |
| Consent and contact route | Required before follow-up | Prevents an accidental outreach path |

## Decision model

1. Validate the input schema and return field-level errors without discarding the visitor's draft.
2. Calculate score bands from a source-controlled matrix; record weights, triggered rules, and rubric version.
3. Apply policy gates for regulated data, ambiguous ownership, incomplete fields, or out-of-scope requests.
4. Create exactly one of three outcomes: direct recommendation, operator review, or no-fit response.
5. Export a structured brief that makes the outcome reproducible by someone who did not design the form.

## Controls and evidence

| Control | Enforcement | Evidence |
| --- | --- | --- |
| Required-field gate | Blocks a decision when minimum context is absent | Completeness receipt and missing-field list |
| Versioned scoring matrix | Calculates score only from declared weights and thresholds | Score breakdown, score band, rubric version |
| Risk escalation | Sends sensitive or ambiguous requests to a named owner | Escalation reason, owner, and resolution |
| Operator override | Requires an explanation rather than silently changing the result | Override category and updated disposition |

## Contracts and failure behaviour

- **Form to scorer:** normalized profile, objective, systems context, risk flags, and schema version. Invalid payloads are rejected with actionable field errors.
- **Scorer to policy gate:** score band, rule trace, and deterministic decision inputs. Incomplete traces or conflicting policies default to review.
- **Policy gate to operator:** recommendation, evidence summary, escalation reason, and next permitted action. A review item is non-sendable until the owner resolves it.

## Delivery sequence

### 1. Calibrate

Map real intake decisions, name decision owners, identify repeated disagreement, and define inclusion, exclusion, and escalation thresholds. Approve the rule register before building the form.

### 2. Build the bounded path

Implement schema validation, scoring, policy evaluation, and artifact export as separate functions. Use fixtures covering accepted, rejected, incomplete, and sensitive examples.

### 3. Pilot and govern change

Replay historical examples, compare results against approved dispositions, monitor override categories, and use a controlled change request for any rubric adjustment.

## Acceptance criteria

- Every recommendation includes its rubric version, score trace, and route.
- No high-risk input bypasses the review queue.
- An operator can reproduce any result from the exported brief alone.
- Overrides are categorized and reviewed before the rubric is changed.

## Handoff pack

- Scoring rubric and policy rule register
- Input schema and invalid-state examples
- Decision-trace JSON contract and operator queue procedure
- Fixture suite, override taxonomy, and change-control checklist
