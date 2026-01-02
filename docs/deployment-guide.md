# AIAS Reality Mode Hardening - Deployment Guide

**Status:** ✅ Ready for Production  
**Last Updated:** 2025-01-31

## Quick Start

### 1. Apply Database Migration

**Option A: Supabase SQL Editor (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of: `supabase/migrations/000000000000_consolidated_reality_mode_hardening.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Verify: Check that all tables are created (webhook_endpoints, artifacts, etc.)

**Option B: Supabase CLI**
```bash
supabase db push
```

### 2. Verify Environment Variables

Ensure these are set in your environment:
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (for Stripe webhooks)
- `STRIPE_SECRET_KEY` (for Stripe operations)

### 3. Install Dependencies & Verify

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
```

### 4. Test Webhook Pipeline

```bash
# 1. Create a tenant (via UI or API)
# 2. Create a workflow/system
# 3. Create a webhook endpoint: POST /api/webhook-endpoints
# 4. Trigger webhook: POST /api/webhooks/{tenant_id}/{secret}
# 5. Check artifact: GET /api/artifacts/{artifact_id}
# 6. View diagnostics: GET /dashboard/diagnostics
```

## What Was Fixed

### Critical Blockers Resolved

1. ✅ Stripe webhook now uses POST (was PUT)
2. ✅ Webhook endpoints table created with RLS
3. ✅ Artifacts table created with RLS
4. ✅ External webhook route created
5. ✅ Enhanced executor creates artifacts and logs
6. ✅ Server-side entitlement gates enforce limits
7. ✅ Middleware hardened against crashes
8. ✅ Runtime correctness verified (Node.js vs Edge)
9. ✅ Integration status fixed (Coming Soon badges)
10. ✅ Per-step logging implemented

### New Features

- **Webhook Endpoints API:** Create and manage tenant-scoped webhooks
- **Artifacts API:** View and download execution outputs
- **Diagnostics Page:** Tenant-admin dashboard for system health
- **Server-Side Entitlement Gates:** Enforce paid tier limits
- **Enhanced Logging:** Per-step execution logs

## API Endpoints

### Webhook Endpoints
- `POST /api/webhook-endpoints` - Create webhook endpoint
- `GET /api/webhook-endpoints?tenant_id=...` - List webhook endpoints

### External Webhooks
- `POST /api/webhooks/{tenant_id}/{secret}` - Trigger workflow execution

### Artifacts
- `GET /api/artifacts/{id}` - Get artifact
- `GET /api/artifacts/{id}/download` - Download artifact

### Diagnostics
- `GET /dashboard/diagnostics` - View system diagnostics (admin only)

## Database Schema

### New Tables
- `webhook_endpoints` - Tenant-scoped webhook URLs with secrets
- `artifacts` - Deterministic execution outputs
- Enhanced `workflow_execution_logs` - Per-step logging

### RLS Policies
All tables have Row Level Security enabled:
- Users can only access data in their tenant
- System operations use service role
- Cross-tenant access is blocked

## Verification Checklist

- [ ] Migration applied successfully
- [ ] All tables exist (check Supabase Dashboard)
- [ ] RLS policies enabled (check Supabase Dashboard)
- [ ] Environment variables set
- [ ] Lint passes: `pnpm lint`
- [ ] Typecheck passes: `pnpm typecheck`
- [ ] Build succeeds: `pnpm build`
- [ ] Webhook endpoint creation works
- [ ] Webhook trigger works
- [ ] Artifact creation works
- [ ] Diagnostics page loads

## Troubleshooting

### Migration Fails
- Check Supabase connection
- Verify you have admin access
- Check for existing tables (migration is idempotent)

### Webhook Not Triggering
- Verify webhook secret matches
- Check tenant_id is correct
- Verify workflow is enabled
- Check entitlement limits

### Artifacts Not Created
- Verify workflow execution completed successfully
- Check run_id exists in workflow_executions table
- Verify executor-with-logs is being used

### RLS Blocking Access
- Verify user is member of tenant
- Check tenant_members table
- Verify RLS policies are enabled

## Support

For issues or questions:
1. Check `docs/reality-map-v1.md` for architecture overview
2. Check `docs/blockers-list.md` for known issues
3. Check `docs/verification-pack.md` for testing commands
4. Review `docs/final-summary.md` for complete status

## Next Steps

1. **Production Queue:** Set up BullMQ for background execution
2. **Monitoring:** Add alerting for failed runs
3. **Rate Limiting:** Enhance rate limiting for webhooks
4. **Caching:** Add caching for entitlement checks
5. **Testing:** Expand test coverage

---

**All phases complete. System is production-ready.** ✅
