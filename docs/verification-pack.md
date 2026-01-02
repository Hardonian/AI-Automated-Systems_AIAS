# AIAS Verification Pack

**Generated:** 2025-01-31  
**Purpose:** Exact commands and expected outputs for verifying the hardened system

## Prerequisites

```bash
# Ensure dependencies are installed
pnpm install

# Ensure environment variables are set
# Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_WEBHOOK_SECRET
```

## Phase 1: Code Quality Checks

### Lint Check
```bash
pnpm lint
```
**Expected:** No errors, warnings acceptable if documented

### Type Check
```bash
pnpm typecheck
```
**Expected:** No type errors

### Build Check
```bash
pnpm build
```
**Expected:** Successful build, no errors

## Phase 2: Database Migrations

### Apply Migrations
```bash
# If using Supabase CLI
supabase db push

# Or manually apply
psql $DATABASE_URL -f supabase/migrations/20250131000001_webhook_endpoints_and_artifacts.sql
```

**Expected:** Migration applies successfully, tables created

### Verify Tables Exist
```sql
-- Check webhook_endpoints table
SELECT COUNT(*) FROM webhook_endpoints;

-- Check artifacts table
SELECT COUNT(*) FROM artifacts;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('webhook_endpoints', 'artifacts');
```

**Expected:** Tables exist, RLS enabled

## Phase 3: Stripe Webhook Verification

### Test Stripe Webhook (Local)
```bash
# Install Stripe CLI if not installed
# brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

**Expected:** 
- Webhook received (check server logs)
- Event processed successfully
- Database updated (check `subscriptions` or `subscription_tiers` table)

### Verify Webhook Route Method
```bash
# Check route accepts POST (not PUT)
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"test": "data"}'
```

**Expected:** 400 or 401 (signature verification will fail, but method should be accepted)

## Phase 4: Webhook Endpoint Creation

### Create Webhook Endpoint (Requires Auth)
```bash
# First, get auth token (sign in via UI or API)
TOKEN="your-auth-token"

# Create webhook endpoint
curl -X POST http://localhost:3000/api/webhook-endpoints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "your-tenant-id",
    "system_id": "your-workflow-id",
    "name": "Test Webhook",
    "description": "Test webhook endpoint"
  }'
```

**Expected:** 
- 201 Created
- Response includes `webhook_url` and `secret`
- Database record created in `webhook_endpoints` table

### List Webhook Endpoints
```bash
curl -X GET "http://localhost:3000/api/webhook-endpoints?tenant_id=your-tenant-id" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 
- 200 OK
- Array of webhook endpoints (without secrets)

## Phase 5: External Webhook Trigger

### Trigger Webhook (No Auth Required)
```bash
# Use the webhook URL from previous step
WEBHOOK_URL="http://localhost:3000/api/webhooks/{tenant_id}/{secret}"

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "test": "payload",
    "data": {"key": "value"}
  }'
```

**Expected:**
- 202 Accepted
- Response includes `run_id`
- Workflow execution started (check `workflow_executions` table)
- Artifact created (check `artifacts` table)
- Logs populated (check `workflow_execution_logs` table)

### Verify Run Status
```sql
-- Check run was created
SELECT id, status, input, output, error 
FROM workflow_executions 
WHERE id = 'run-id-from-response'
ORDER BY started_at DESC 
LIMIT 1;

-- Check artifact was created
SELECT id, artifact_type, content, content_text 
FROM artifacts 
WHERE run_id = 'run-id-from-response';

-- Check logs were populated
SELECT step_id, step_type, status, output, error 
FROM workflow_execution_logs 
WHERE execution_id = 'run-id-from-response';
```

**Expected:** 
- Run exists with status "completed" or "running"
- Artifact exists with output data
- At least one log entry exists

## Phase 6: Entitlement Gates

### Test Free Tier Limit (System Creation)
```bash
# Try to create system when at limit
curl -X POST http://localhost:3000/api/workflows \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test System",
    "tenant_id": "free-tier-tenant-id",
    "steps": []
  }'
```

**Expected:** 
- If at limit: 403 Forbidden with error message
- If under limit: 201 Created

### Test Free Tier Limit (Webhook Creation)
```bash
# Try to create webhook when at limit
curl -X POST http://localhost:3000/api/webhook-endpoints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "free-tier-tenant-id",
    "system_id": "system-id"
  }'
```

**Expected:** 
- If at limit: 403 Forbidden with error message
- If under limit: 201 Created

### Test Free Tier Limit (Run Execution)
```bash
# Trigger webhook when monthly limit reached
WEBHOOK_URL="http://localhost:3000/api/webhooks/{tenant_id}/{secret}"

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Expected:** 
- If at limit: 403 Forbidden with error message
- If under limit: 202 Accepted

## Phase 7: Tenant Isolation

### Test Cross-Tenant Access (Should Fail)
```bash
# User A tries to access Tenant B's artifact
ARTIFACT_ID="tenant-b-artifact-id"

curl -X GET "http://localhost:3000/api/artifacts/$ARTIFACT_ID" \
  -H "Authorization: Bearer user-a-token"
```

**Expected:** 
- 403 Forbidden
- Error: "Not authorized to view this artifact"

### Verify RLS Policies
```sql
-- As user A, try to select Tenant B's data
SET ROLE authenticated;
SET request.jwt.claim.sub = 'user-a-id';

-- Should return 0 rows
SELECT COUNT(*) FROM workflows WHERE tenant_id = 'tenant-b-id';
SELECT COUNT(*) FROM artifacts WHERE tenant_id = 'tenant-b-id';
SELECT COUNT(*) FROM webhook_endpoints WHERE tenant_id = 'tenant-b-id';
```

**Expected:** 0 rows (RLS blocks access)

## Phase 8: Error Handling

### Test Middleware Error Handling
```bash
# Send malformed request
curl -X GET http://localhost:3000/dashboard \
  -H "Cookie: invalid-cookie"
```

**Expected:** 
- No 500 error
- Graceful redirect to signin or error page
- Error logged but request continues

### Test API Error Handling
```bash
# Send invalid webhook payload
curl -X POST "http://localhost:3000/api/webhooks/invalid-tenant/invalid-secret" \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

**Expected:** 
- 400 Bad Request (not 500)
- Error message in response
- No stack trace exposed

## Phase 9: Artifact Access

### Get Artifact
```bash
ARTIFACT_ID="artifact-id-from-run"

curl -X GET "http://localhost:3000/api/artifacts/$ARTIFACT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 
- 200 OK
- JSON response with artifact content

### Download Artifact
```bash
curl -X GET "http://localhost:3000/api/artifacts/$ARTIFACT_ID/download" \
  -H "Authorization: Bearer $TOKEN" \
  -o artifact.json
```

**Expected:** 
- 200 OK
- File downloaded with correct content type
- File content matches artifact data

## Phase 10: Smoke Test (End-to-End)

### Complete Flow Test
```bash
# 1. Create workflow/system
WORKFLOW_RESPONSE=$(curl -X POST http://localhost:3000/api/workflows \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smoke Test Workflow",
    "tenant_id": "test-tenant-id",
    "steps": [{
      "id": "step1",
      "type": "transform",
      "config": {"type": "transform", "mapping": {"output": "input.value"}}
    }],
    "start_step_id": "step1"
  }')

WORKFLOW_ID=$(echo $WORKFLOW_RESPONSE | jq -r '.workflow.id')

# 2. Create webhook endpoint
WEBHOOK_RESPONSE=$(curl -X POST http://localhost:3000/api/webhook-endpoints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tenant_id\": \"test-tenant-id\",
    \"system_id\": \"$WORKFLOW_ID\",
    \"name\": \"Smoke Test Webhook\"
  }")

WEBHOOK_URL=$(echo $WEBHOOK_RESPONSE | jq -r '.webhook_url')
SECRET=$(echo $WEBHOOK_RESPONSE | jq -r '.secret')

# 3. Trigger webhook
RUN_RESPONSE=$(curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"input": {"value": "test"}}')

RUN_ID=$(echo $RUN_RESPONSE | jq -r '.run_id')

# 4. Wait for execution (poll or check DB)
sleep 2

# 5. Check run status
curl -X GET "http://localhost:3000/api/workflows/$WORKFLOW_ID/executions/$RUN_ID" \
  -H "Authorization: Bearer $TOKEN"

# 6. Get artifact
ARTIFACT_ID=$(psql $DATABASE_URL -t -c "SELECT id FROM artifacts WHERE run_id = '$RUN_ID' LIMIT 1")

curl -X GET "http://localhost:3000/api/artifacts/$ARTIFACT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 
- All steps succeed
- Run completes successfully
- Artifact contains expected output
- No errors in logs

## Summary

After running all verification steps:

✅ **Code Quality:** Lint, typecheck, build pass  
✅ **Database:** Migrations applied, tables exist, RLS enabled  
✅ **Stripe Webhook:** Receives POST requests, processes events  
✅ **Webhook Endpoints:** Can create and list endpoints  
✅ **External Webhooks:** Trigger workflows, create artifacts  
✅ **Entitlement Gates:** Enforce limits server-side  
✅ **Tenant Isolation:** RLS prevents cross-tenant access  
✅ **Error Handling:** Graceful degradation, no 500s  
✅ **Artifacts:** Can view and download artifacts  
✅ **End-to-End:** Complete flow works

## Known Issues

- Background execution uses fire-and-forget (needs queue for production)
- Per-step logging not yet implemented (summary logs only)
- Some routes may need additional error boundaries

## Next Steps

1. Set up BullMQ queue for background execution
2. Implement per-step logging
3. Add route-specific error boundaries
4. Create integration tests
5. Set up monitoring/alerting
