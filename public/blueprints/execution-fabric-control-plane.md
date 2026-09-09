# Execution Fabric Control Plane — Delivery Specification

## Purpose and operating boundary

Use this blueprint when AI-assisted planning touches systems of record. The model can propose a typed plan, but it never receives direct write authority. A deterministic orchestrator validates commands, checks policy, calls bounded adapters, and writes an immutable receipt for each consequential transition.

## Authority model

| Layer | May do | Must not do |
| --- | --- | --- |
| AI advisor | Propose a typed plan and cite evidence | Write to a system of record or select an undeclared tool |
| Plan validator | Enforce schema, allowed commands, and preconditions | Infer missing authority from prose |
| Policy gate | Allow, deny, or escalate each command | Mutate business state |
| Orchestrator | Execute approved idempotent commands | Skip a policy decision or suppress a failed step |
| Adapter | Translate a narrow typed command to one external system | Accept raw model output |

## Required contracts

- **Advisor to validator:** intent, candidate commands, evidence references, and confidence metadata in a versioned schema. Unparseable proposals are discarded.
- **Validator to orchestrator:** approved command graph, idempotency keys, preconditions, execution deadline, and owning policy pack. Partial graphs never begin execution.
- **Orchestrator to adapter:** a typed command and correlation ID. Retries are bounded to declared transient errors; other failures create an operator task or run a compensating command.
- **Orchestrator to ledger:** command lifecycle, input and output hashes, policy and schema versions, actor, timestamps, and links to any compensation.

## Control points

| Control | Enforcement | Evidence |
| --- | --- | --- |
| Typed plan validation | Rejects unsupported fields and undeclared commands | Validated plan ID and rejection report |
| Policy decision gate | Checks scope, data class, authorization, and preconditions before each write | Allow, deny, or escalate receipt with rule IDs |
| Immutable ledger | Records every command, retry, and compensation | Correlated event stream with version identifiers |
| Deterministic fallback | Moves failed work to a defined safe state | Operator task or compensating-action receipt |

## Delivery sequence

### 1. Define authority

Inventory systems of record, data classes, owners, and allowed state transitions. Publish a command registry with idempotency and precondition rules.

### 2. Build one bounded workflow

Implement plan validation, policy enforcement, one or two narrow adapters, and ledger correlation before adding more tools. Test duplicate, timeout, denial, and partial-failure paths.

### 3. Harden operations

Set service objectives, replay procedures, escalation ownership, and expansion gates. Add commands only after their error and compensation semantics are proven.

## Acceptance criteria

- Every authoritative write has an associated policy decision and ledger receipt.
- A sampled execution can be reconstructed with its original inputs and artifact versions.
- Failed multi-step work reaches a documented safe state inside the service objective.
- No adapter accepts untyped model text.

## Handoff pack

- Authority-boundary map and command registry
- Versioned policy pack and decision-trace schema
- Event ledger schema, replay procedure, and incident runbook
- Failure-mode fixture suite and expansion readiness checklist
