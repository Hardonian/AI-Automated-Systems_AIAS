# AI Governance Readiness Checklist

Use this checklist to assess whether your team is ready to scale AI-enabled workflows responsibly. It is a starting point for internal alignment, not a buying decision tool.

## How to score
For each question, assign:
- **0 — Not in place**
- **1 — Partially in place**
- **2 — Consistently in place**

### Score interpretation
- **0–10:** High structural risk. Pause scaling and establish basic controls.
- **11–20:** Emerging capability. Prioritize consistency and ownership clarity.
- **21–30:** Strong baseline. Focus on optimization and resilience under change.

## 15 Readiness Questions

### Decision and ownership clarity
1. Do we explicitly define which decisions are deterministic, AI-assisted, or human-owned?
2. Is ownership clear for each production workflow and escalation path?
3. Are high-impact actions gated behind policy checks or human approval?

### Constraints and controls
4. Have we documented regulatory, legal, and contractual constraints that affect AI behavior?
5. Do we have clear quality thresholds that block releases when unmet?
6. Are rollback procedures tested for model, prompt, and workflow updates?

### Reliability and failure handling
7. Do we track failure modes and classify their business impact?
8. Are exception queues monitored with defined response-time expectations?
9. Can we replay incidents with enough telemetry to identify root causes?

### Evaluation integrity
10. Do our evaluations reflect real business scenarios rather than synthetic-only tests?
11. Are regressions checked before deployment when prompts, tools, or models change?
12. Do we monitor drift in output quality over time?

### Cost and operational discipline
13. Do we measure cost per workflow stage and set guardrails for overspend?
14. Is model selection tied to task requirements (quality, latency, cost), not default preference?
15. Do leadership reviews include reliability, risk, and cost tradeoffs together?

## Recommended next step
Share scores across product, operations, and governance stakeholders, then align on the top three gaps to address in the next 30–60 days.
