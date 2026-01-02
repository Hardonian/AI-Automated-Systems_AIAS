# AIAS Reality Map v1 - Discovery Phase

**Generated:** 2025-01-31  
**Status:** PHASE 0 Complete - Discovery

## Executive Summary

This document maps the **actual** (not assumed) flow of data and execution through the AIAS platform. It identifies blockers, disconnects, and missing wiring that prevent the core pipeline from working in reality.

## Core Pipeline (Target State)

```
External Webhook
  ↓
Webhook Endpoint (tenant-scoped, secret-verified)
  ↓
System/Workflow Execution (deterministic)
  ↓
Artifact Creation (JSON/text output)
  ↓
Run Logs (structured, append-only)
  ↓
UI Display (runs list, detail view, artifact preview)
```

## Current Reality Map

### 1. Authentication & Middleware

**Location:** `middleware.ts`, `lib/middleware/session-handler.ts`

**Flow:**
- Middleware checks admin guards → session → rate limiting → security headers
- Session handler validates Supabase auth tokens
- Protected routes: `/dashboard`, `/workflows`, `/billing`, `/settings`, `/admin`

**Status:** ✅ Functional but needs hardening
**Issues:**
- No error boundaries for middleware failures
- Missing env var guards could cause 500s
- Session refresh logic may fail silently

### 2. Tenant Model

**Location:** `supabase/migrations/` (tenants, tenant_members tables)

**Tables:**
- `tenants` - workspace definitions
- `tenant_members` - user ↔ tenant relationships with roles
- `user_tenants` - VIEW (backward compatibility, maps to tenant_members)

**RLS Status:** ✅ Fixed in migration `20250131000000_fix_rls_policies_tenant_reference.sql`
**Issues:**
- Original migration `20250130000000_agents_and_workflows.sql` still references `user_tenants` directly (view exists, so works)
- Need to verify all domain tables have `tenant_id`

### 3. Systems/Workflows Model

**Location:** `supabase/migrations/20250130000000_agents_and_workflows.sql`

**Tables:**
- `agents` - agent definitions (has tenant_id ✅)
- `agent_executions` - agent run instances (has tenant_id ✅)
- `workflows` - workflow definitions (has tenant_id ✅)
- `workflow_executions` - workflow run instances (has tenant_id ✅)

**RLS:** ✅ Policies exist, reference tenant_members correctly

**Execution Logic:**
- `lib/workflows/executor.ts` - Node-based executor (in-memory, no persistence)
- `lib/workflows/executor-enhanced.ts` - Enhanced executor with integrations
- `app/api/workflows/execute/route.ts` - API endpoint
- `app/api/workflows/[id]/execute/route.ts` - API endpoint with ID

**Status:** ⚠️ Partial
**Issues:**
- No deterministic artifact storage
- No run_logs table population during execution
- Execution results stored in `workflow_executions.output` (JSONB) but not as separate artifacts
- No webhook trigger mechanism

### 4. Webhook Ingestion

**Location:** `supabase/functions/webhook-ingest/index.ts`

**Status:** ❌ WRONG PURPOSE
**Issue:** This function logs API requests, NOT webhook ingestion for system triggers

**Missing:**
- No `webhook_endpoints` table (tenant-scoped webhook URLs + secrets)
- No external webhook route (`/api/webhooks/[tenant_id]/[secret]`)
- No webhook → system execution wiring

### 5. Artifacts

**Location:** NONE

**Status:** ❌ MISSING
**Missing:**
- No `artifacts` table
- No artifact storage (JSON/text outputs)
- No artifact → run linking
- No artifact preview/download endpoints

### 6. Billing & Entitlements

**Location:** 
- `supabase/migrations/20250130000001_billing_and_usage.sql`
- `app/api/stripe/webhook/route.ts`
- `app/api/entitlements/check/route.ts`

**Tables:**
- `subscriptions` - user subscriptions (has tenant_id ✅)
- `usage_metrics` - usage tracking (has tenant_id ✅)
- `billing_events` - billing event log

**Stripe Webhook:**
- **CRITICAL BUG:** Uses `PUT` method, but Stripe sends `POST` ❌
- Uses Node.js runtime ✅
- Has raw body verification ✅
- Has idempotency ✅

**Entitlements:**
- `lib/entitlements/check.ts` - feature access checking
- Server-side enforcement: ⚠️ Partial (exists but not enforced in execution paths)

**Status:** ⚠️ Partial
**Issues:**
- Stripe webhook method mismatch (PUT vs POST)
- Entitlement gates not enforced in workflow execution
- No server-side limits on system creation, webhook count, etc.

### 7. Run Logs

**Location:** `supabase/migrations/20250130000002_observability.sql`

**Tables:**
- `workflow_execution_logs` - detailed logs for workflow runs
- `agent_execution_logs` - detailed logs for agent runs

**Status:** ✅ Tables exist
**Issues:**
- Not populated during execution
- No structured logging during step execution

### 8. Background Execution

**Location:** NONE

**Status:** ❌ MISSING
**Missing:**
- No queue system (BullMQ installed but not configured)
- No async execution for webhooks
- No retry mechanism for failed runs
- No duplicate run prevention

## Critical Blockers

### BLOCKER #1: Stripe Webhook Method Mismatch
**File:** `app/api/stripe/webhook/route.ts`
**Issue:** Uses `PUT`, Stripe sends `POST`
**Impact:** Stripe webhooks will never be received
**Fix:** Change to `POST` method

### BLOCKER #2: No Webhook Endpoints Table
**Missing:** `webhook_endpoints` table
**Impact:** Cannot create tenant-scoped webhook URLs
**Fix:** Create migration with table + RLS

### BLOCKER #3: No External Webhook Route
**Missing:** `/api/webhooks/[tenant_id]/[secret]` route
**Impact:** External systems cannot trigger workflows
**Fix:** Create route with secret verification → workflow execution

### BLOCKER #4: No Artifacts Table
**Missing:** `artifacts` table
**Impact:** Cannot store deterministic outputs
**Fix:** Create migration with table + RLS + linking to runs

### BLOCKER #5: No Deterministic Execution
**Issue:** Executor doesn't produce artifacts, logs not populated
**Impact:** Cannot verify same input → same output
**Fix:** Enhance executor to create artifacts, populate logs

### BLOCKER #6: No Server-Side Entitlement Gates
**Issue:** Entitlements checked but not enforced in execution
**Impact:** Free users can exceed limits
**Fix:** Add gates in workflow creation, execution, webhook creation

### BLOCKER #7: No Background Execution
**Issue:** Webhooks would execute synchronously (timeout risk)
**Impact:** Long-running workflows will fail
**Fix:** Add queue system or async execution

## Domain Model Mapping

| Concept | Table | Status | tenant_id | RLS |
|---------|-------|--------|-----------|-----|
| tenants | `tenants` | ✅ | N/A | ✅ |
| memberships | `tenant_members` | ✅ | N/A | ✅ |
| systems | `workflows` | ✅ | ✅ | ✅ |
| system_steps | `workflows.steps` (JSONB) | ✅ | ✅ | ✅ |
| webhook_endpoints | ❌ MISSING | ❌ | ❌ | ❌ |
| runs | `workflow_executions` | ✅ | ✅ | ✅ |
| run_logs | `workflow_execution_logs` | ✅ | ✅ | ✅ |
| artifacts | ❌ MISSING | ❌ | ❌ | ❌ |
| entitlements | `subscriptions` + `usage_metrics` | ✅ | ✅ | ✅ |

## Next Steps

1. Fix Stripe webhook method (BLOCKER #1)
2. Create webhook_endpoints table (BLOCKER #2)
3. Create external webhook route (BLOCKER #3)
4. Create artifacts table (BLOCKER #4)
5. Enhance executor for artifacts + logs (BLOCKER #5)
6. Add server-side entitlement gates (BLOCKER #6)
7. Add background execution (BLOCKER #7)

## Verification Commands

```bash
# Lint check
pnpm lint

# Type check
pnpm typecheck

# Build check
pnpm build

# Database migration check
# (verify migrations apply cleanly)

# Webhook test (after fixes)
curl -X POST https://your-domain.com/api/webhooks/{tenant_id}/{secret} \
  -H "Content-Type: application/json" \
  -d '{"test": "payload"}'
```
