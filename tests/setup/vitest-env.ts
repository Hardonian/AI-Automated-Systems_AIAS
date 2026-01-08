// Test-only environment defaults.
//
// Goal: allow running unit tests without requiring production secrets.
// This keeps CI and local workflows fast while preserving runtime strictness in production.

process.env.SKIP_ENV_VALIDATION = process.env.SKIP_ENV_VALIDATION ?? "true";
process.env.NODE_ENV = process.env.NODE_ENV ?? "test";

