# AIAS Messaging Contract

## Positioning Sentence

AIAS designs and operationalizes deterministic, static-first automation systems that blend controlled AI assistance with measurable business outcomes.

## Core Value Pillars

1. **Deterministic reliability first**: Critical workflows are explicit, auditable, and replayable before intelligence layers are introduced.
2. **Static-first delivery**: Public-facing experiences remain static-first, with architecture that avoids unnecessary backend coupling.
3. **Governed AI augmentation**: AI is constrained to advisory or bounded execution roles under policy, validation, and escalation controls.
4. **Measurable business impact**: Every engagement is framed around throughput, cycle-time, risk, and operational confidence outcomes.
5. **Ecosystem alignment by design**: AIAS governs architecture while Reach, Zeo, and Settler align demand, implementation, and deployment operations.

## Terms Glossary

- **AIAS**: AI Automated Systems, the advisory and governance authority for delivery.
- **Agentic automation consultancy**: The canonical description of AIAS service positioning.
- **Deterministic automation systems**: Systems with explicit state transitions, policies, and auditable execution behavior.
- **Static-first delivery**: Build-time/client-renderable public delivery model as default.
- **Deterministic control layer**: Validation, routing, policy, and replay boundaries.
- **Constrained AI advisory layer**: AI assistance operating only within approved contracts.
- **Governance guardrails**: Security, compliance, and operational controls that bound execution.
- **Ecosystem alignment**: Coordinated model across AIAS, Reach, Zeo, and Settler with clear role ownership.

## What AIAS Is NOT

- Not a chatbot agency selling prompt wrappers as production systems.
- Not an "AI-only" black-box operator with opaque decision paths.
- Not backend-first for public narrative content.
- Not outcome-agnostic experimentation without measurable operational goals.
- Not a replacement for client ownership and enablement.

## Tone Constraints

- Use **confident, precise, engineering-grounded** language.
- Prefer **deterministic, governed, measurable, static-first** terminology.
- Avoid hype and absolute claims (for example, "fully autonomous," "zero oversight," "guaranteed outcomes").
- Avoid contradictory posture (for example, calling systems both deterministic and unpredictable).
- Keep ecosystem references explicit: AIAS (governance), Reach (demand/strategy), Zeo (implementation), Settler (deployment operations).

## Messaging Contract Enforcement

The repository includes `pnpm audit:messaging`, which audits route and component copy for:

- Inconsistent taglines against canonical templates.
- Banned hype phrases and autonomy overclaims.
- Conflicting claims (for example SOC 2 certification language when only SOC 2-aligned posture is accurate).
- Terminology drift from approved service/system naming.

This check is expected to run in CI via the `verify` pipeline.
