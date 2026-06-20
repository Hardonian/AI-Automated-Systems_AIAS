# AIAS Deployment Models

AIAS supports multiple deployment models while preserving deterministic governance.

## 1) Self-Hosted

Best for organizations requiring strict infrastructure and data residency control.

- Client retains full platform ownership.
- AIAS provides architecture, implementation guidance, and controls framework.
- Suitable for regulated environments and bespoke compliance requirements.

## 2) Managed

Best for teams that need speed with clear governance outcomes.

- AIAS and ecosystem partners manage implementation operations.
- Service expectations are documented with explicit accountability boundaries.
- Includes handoff paths if clients later transition to self-managed operations.

## 3) Federated

Best for multi-team or multi-entity operations with shared governance needs.

- Policy inheritance across business units.
- Shared control model with role-based responsibilities.
- Deterministic interfaces for cross-team automation workflows.

## Cross-Model Invariants

- Deterministic policy enforcement before automation execution.
- Human review on high-impact transitions.
- Auditable operation logs and handoff artifacts.
- Graceful degradation when optional dependencies are unavailable.
