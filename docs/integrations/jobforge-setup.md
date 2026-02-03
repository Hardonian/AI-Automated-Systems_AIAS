# JobForge Integration

This guide documents the JobForge adapter, admin console, and CLI workflows for AIAS.

## Overview

The JobForge integration uses the JobForge TypeScript SDK when available (`@jobforge/sdk-ts`). If the SDK is not installed, the adapter falls back to Supabase RPC calls so the same job queue can be used without additional dependencies.

Key behaviors:

- **Disabled by default** (`JOBFORGE_INTEGRATION_ENABLED=0`).
- **No side effects by default**; bundle execution is gated behind `JOBFORGE_EXECUTION_ENABLED=1` and explicit confirmation.
- **Explicit tenant/project mapping** is enforced per request and can be validated via `JOBFORGE_TENANT_PROJECT_MAP`.
- **Safe logging** with token/secret redaction.

## Environment Variables

Add the following to `.env.local` or your deployment environment (see `.env.example` for defaults):

```bash
JOBFORGE_INTEGRATION_ENABLED=0
JOBFORGE_EXECUTION_ENABLED=0
JOBFORGE_ADMIN_TOKEN=your-jobforge-admin-token
JOBFORGE_SUPABASE_URL=https://your-jobforge.supabase.co
JOBFORGE_SUPABASE_SERVICE_ROLE_KEY=your-jobforge-service-role-key
JOBFORGE_TENANT_PROJECT_MAP={"tenant-id":"project-id"}
JOBFORGE_DEFAULT_TENANT_ID=your-tenant-id
JOBFORGE_DEFAULT_PROJECT_ID=your-project-id
```

### Tenant/Project Mapping

Set `JOBFORGE_TENANT_PROJECT_MAP` to pin tenant IDs to project IDs. Requests that do not match this mapping are rejected.

```json
{
  "tenant-uuid-1": "project-uuid-1",
  "tenant-uuid-2": "project-uuid-2"
}
```

## Admin Console

The JobForge admin console lives at:

```
/app/admin/jobforge
```

Use the bearer token input to call the admin API. The console supports:

- Submit event
- Run module (dry-run only)
- View report
- Request bundle execution (gated)

## Admin API

All admin API calls are served from:

```
POST /api/admin/jobforge
```

Include the `Authorization: Bearer <token>` header if `JOBFORGE_ADMIN_TOKEN` is set.

### Submit Event

```bash
curl -X POST \
  -H "Authorization: Bearer $JOBFORGE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "submitEvent",
    "tenantId": "tenant-uuid",
    "projectId": "project-uuid",
    "eventName": "event.sample",
    "payload": {"sample": true}
  }' \
  http://localhost:3000/api/admin/jobforge
```

### Run Module (Dry-Run)

```bash
curl -X POST \
  -H "Authorization: Bearer $JOBFORGE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "runModuleDryRun",
    "tenantId": "tenant-uuid",
    "projectId": "project-uuid",
    "moduleName": "module.sample",
    "inputs": {"sample": true}
  }' \
  http://localhost:3000/api/admin/jobforge
```

### View Report

```bash
curl -X POST \
  -H "Authorization: Bearer $JOBFORGE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "viewReport",
    "tenantId": "tenant-uuid",
    "projectId": "project-uuid",
    "reportId": "report-uuid"
  }' \
  http://localhost:3000/api/admin/jobforge
```

### Request Bundle Execution (Gated)

```bash
curl -X POST \
  -H "Authorization: Bearer $JOBFORGE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "requestBundleExecution",
    "tenantId": "tenant-uuid",
    "projectId": "project-uuid",
    "bundleId": "bundle-uuid",
    "confirmExecution": true,
    "reason": "manual_request"
  }' \
  http://localhost:3000/api/admin/jobforge
```

## CLI

Use the CLI to enqueue jobs without the admin UI:

```bash
pnpm jobforge:admin submit-event \
  --tenant tenant-uuid \
  --project project-uuid \
  --event event.sample \
  --payload '{"sample":true}'
```

```bash
pnpm jobforge:admin run-module \
  --tenant tenant-uuid \
  --project project-uuid \
  --module module.sample \
  --inputs '{"sample":true}'
```

```bash
pnpm jobforge:admin view-report \
  --tenant tenant-uuid \
  --project project-uuid \
  --report report-uuid
```

```bash
pnpm jobforge:admin request-bundle-execution \
  --tenant tenant-uuid \
  --project project-uuid \
  --bundle bundle-uuid \
  --reason manual_request \
  --confirm
```

## Smoke Test & Verification Commands

Run these commands after configuring env vars and starting the app locally:

```bash
# Verify admin status (requires JOBFORGE_ADMIN_TOKEN)
curl -H "Authorization: Bearer $JOBFORGE_ADMIN_TOKEN" http://localhost:3000/api/admin/jobforge
```

```bash
# Dry-run module enqueue (safe)
curl -X POST \
  -H "Authorization: Bearer $JOBFORGE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "runModuleDryRun",
    "tenantId": "tenant-uuid",
    "projectId": "project-uuid",
    "moduleName": "module.sample",
    "inputs": {"sample": true}
  }' \
  http://localhost:3000/api/admin/jobforge
```

```bash
# CLI dry-run module
pnpm jobforge:admin run-module \
  --tenant tenant-uuid \
  --project project-uuid \
  --module module.sample \
  --inputs '{"sample":true}'
```
