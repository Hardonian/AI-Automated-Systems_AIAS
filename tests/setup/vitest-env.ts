// Test-only environment defaults.
//
// Goal: allow running unit tests without requiring production secrets.
// This keeps CI and local workflows fast while preserving runtime strictness in production.

process.env.SKIP_ENV_VALIDATION = process.env.SKIP_ENV_VALIDATION ?? "true";
// NOTE: Some Node typings treat NODE_ENV as readonly; avoid assigning here.

