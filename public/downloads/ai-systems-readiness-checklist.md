# AIAS Governance Checklist

## Control-Plane Foundations
- [ ] Deterministic policy checks run before high-impact actions.
- [ ] AI outputs cannot directly mutate system-of-record state.
- [ ] Human escalation paths exist for low-confidence events.

## Agent Infrastructure
- [ ] Agent and tool contracts are versioned and testable.
- [ ] Retry/fallback behavior is deterministic.
- [ ] Incident replay logs are available for postmortems.

## Evaluation Integrity
- [ ] Benchmark suite covers the critical customer journeys.
- [ ] Regression checks run before model or prompt changes.
- [ ] Retrieval grounding quality is measured.

## Multi-Model FinOps
- [ ] Routing policy chooses model class per workload.
- [ ] Cost limits prevent uncontrolled inference drift.
- [ ] Accuracy/cost tradeoffs are reviewed on a cadence.

## Enterprise Readiness
- [ ] Governance maturity is tracked (Ad hoc → Controlled).
- [ ] Security and compliance obligations map to controls.
- [ ] Ownership and rollback responsibility are explicit.
