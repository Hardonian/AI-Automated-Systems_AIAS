# Managed-Service Response Framework

Last reviewed: September 10, 2026

## Contract boundary

This is a reference framework for managed engagements, not a universal service-level agreement. A target becomes binding only when a signed statement of work or support schedule names the covered system, support window, measurement method, exclusions, and remedy.

The public AIAS site is a static information surface and is not sold as an always-on application platform.

## Severity model

| Severity | Example impact                                                                                  | Target acknowledgement                      | Communication target               |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------- |
| SEV-1    | Covered production workflow unavailable or creating material unsafe outcomes with no workaround | 1 hour during the contracted support window | Every 60 minutes while active      |
| SEV-2    | Major capability degraded; a documented workaround exists                                       | 4 business hours                            | Each business day until contained  |
| SEV-3    | Limited defect with no material production impact                                               | 1 business day                              | At agreed delivery checkpoints     |
| SEV-4    | Question, enhancement, or documentation request                                                 | 2 business days                             | Through the normal backlog cadence |

Acknowledgement means triage has started. It is not a promise of resolution within that window.

## Availability and performance objectives

Where an engagement includes managed operations, the signed schedule should define:

- the service boundary and measurement source;
- target availability and planned-maintenance treatment;
- latency and throughput indicators tied to the actual workflow;
- data freshness, queue depth, and error-budget thresholds;
- escalation contacts and support hours;
- service-credit or other remedy terms, if any.

No availability percentage, latency target, or service credit applies unless it appears in that signed schedule.

## Incident closeout

For material incidents within a managed scope, the delivery team records the timeline, impact, contributing conditions, recovery actions, evidence links, and follow-up controls. Post-incident timing is agreed according to severity and client reporting obligations.
