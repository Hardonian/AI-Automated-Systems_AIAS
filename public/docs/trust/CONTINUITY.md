# Operational Continuity

Last reviewed: September 10, 2026

## Objective

AIAS engagements are designed so a client can operate, recover, and extend delivered systems without permanent dependency on one individual or consultancy account.

## Required handoff baseline

The exact artifact set is scoped per engagement. A production handoff should cover:

- client-controlled source repositories and deployment destinations;
- an inventory of environments, connectors, credentials, and named owners;
- architecture and decision records describing system boundaries;
- runbooks for normal operation, degradation, rollback, and recovery;
- acceptance tests and known limitations;
- dependency and license inventory;
- operator training and a recorded knowledge-transfer checkpoint;
- an open-risk register with owners and next review dates.

## Credential and access continuity

Production identities should be owned by the client wherever practical. Personal accounts must not be the only path to production. Break-glass access, credential rotation, and revocation steps belong in the client runbook and are tested according to the signed scope.

## Key-person risk

Each managed scope identifies a primary owner, backup contact, escalation owner, and authoritative artifact location. If coverage cannot be provided, the continuity plan prioritizes safe degradation, client notification, and transfer of current records.

## Recovery objectives

Recovery-time and recovery-point objectives depend on workflow criticality, hosting architecture, data stores, and client obligations. They are not inferred from this document. Where required, the signed plan names the objective, evidence source, test cadence, last exercise, and remediation owner.

## Exit and transition

At engagement close, AIAS provides the contracted artifacts, confirms client access, records unresolved risks, and removes or transfers consultancy-controlled credentials according to the agreed schedule. Any extended transition support is explicitly scoped.
