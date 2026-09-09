# Resilient Agent Release Pipeline — Delivery Specification

## Purpose and operating boundary

Use this blueprint to release AI-assisted features safely. A release is an immutable bundle of model configuration, prompts, policies, tools, schemas, and evaluation fixtures. The pipeline promotes only a measured bundle through staged traffic, while an independent rollback controller can return users to the last verified bundle without waiting for the released agent to diagnose itself.

## Release manifest

Every candidate must contain:

- Bundle ID and approved baseline reference
- Model, prompt, tool, policy, and schema versions
- Deterministic fixture set and evaluation-rubric version
- Cohort definition, rollout ceiling, and promotion thresholds
- Change classification, owner, and customer-impact note

An unversioned prompt change, tool update, or policy adjustment is a new candidate, not a patch to a running release.

## Promotion model

1. Build and sign the immutable manifest.
2. Run deterministic contract checks: schema validity, policy compliance, tool-call shape, security assertions, and replayability.
3. Run human quality review only after non-negotiable checks pass.
4. Release to a bounded canary cohort; observe error, policy-exception, and outcome signals.
5. Promote, hold, or roll back using declared thresholds. Publish the decision and the supporting receipt.

## Control points

| Control | Enforcement | Evidence |
| --- | --- | --- |
| Immutable manifest | Rejects releases with missing or mutable behavior-affecting assets | Signed bundle ID and baseline reference |
| Deterministic gate | Blocks subjective QA until contracts pass | Fixture report, contract failures, and policy exceptions |
| Canary guard | Limits exposure and compares the candidate with the baseline | Cohort receipt and threshold scorecard |
| Independent rollback | Reverts traffic on a declared threshold breach | Traffic-change receipt and linked incident |

## Failure behaviour

- Missing fixture coverage, an unreproducible result, or an unisolated cohort defaults to **hold**.
- A contract or policy regression defaults to **rollback** for the affected cohort.
- A missed containment objective pauses further expansion until the incident owner closes corrective controls.
- Every rollback adds a fixture, root-cause record, and re-promotion condition; it is never treated as a silent retry.

## Delivery sequence

### 1. Establish a verified baseline

Inventory all behavior-affecting artifacts and assemble the current verified bundle. Build fixtures from approved outcomes, rejected outcomes, and previous incidents.

### 2. Automate release evidence

Separate deterministic checks from subjective evaluation, then issue a single promotion receipt containing the candidate, baseline, thresholds, evaluators, and cohort.

### 3. Operate staged releases

Configure ramps, containment thresholds, rollback authority, transparency notes, and a review cadence for rollbacks and near misses.

## Acceptance criteria

- Every production release can be reconstructed from one immutable manifest.
- Mandatory policy, schema, and tool-call contracts remain intact in the canary cohort.
- Rollback reaches the documented safe state inside the containment objective.
- Material changes and rollbacks have an accountable public-facing summary where appropriate.

## Handoff pack

- Release manifest schema and change-classification rules
- Baseline fixture library with regression ownership
- Canary scorecard, threshold register, and rollback runbook
- Transparency-log template and post-incident follow-up checklist
