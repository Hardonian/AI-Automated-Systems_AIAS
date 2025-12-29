# 🚀 LAUNCH CHECKLIST

**Last Updated:** 2025-01-31  
**Use this checklist before deploying to production**

---

## Pre-Launch (Day Before)

### Database
- [ ] Run migration verification: `tsx scripts/verify-migration-dependencies.ts`
- [ ] Apply database migration: `supabase db push`
- [ ] Verify base tables exist (tenants, profiles, tenant_members)
- [ ] Test RLS policies work correctly
- [ ] Create database backup

### Code
- [ ] Run type check: `pnpm typecheck`
- [ ] Run linter: `pnpm lint`
- [ ] Run build: `pnpm build`
- [ ] Verify no TypeScript errors
- [ ] Verify no linting errors
- [ ] Review all recent changes

### Testing
- [ ] Test signup flow end-to-end
- [ ] Test login flow
- [ ] Test dashboard loads with real user data
- [ ] Test workflow creation
- [ ] Test workflow list displays correctly
- [ ] Test workflow execution
- [ ] Test billing checkout flow
- [ ] Test subscription activation
- [ ] Test feature gating (workflow limits)
- [ ] Test session expiry handling
- [ ] Test tenant isolation (create 2 tenants, verify isolation)

### Configuration
- [ ] Verify all environment variables set in Vercel
- [ ] Verify Stripe webhook URL configured
- [ ] Verify email service (Resend) configured
- [ ] Verify Supabase connection strings correct
- [ ] Test health check endpoint: `/api/healthz`

### Monitoring
- [ ] Set up error alerts (Sentry or similar)
- [ ] Set up performance monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alert thresholds
- [ ] Test alerting works

### Documentation
- [ ] Review operator playbook
- [ ] Review rollback procedure
- [ ] Ensure team knows how to access logs
- [ ] Ensure team knows emergency contacts

---

## Launch Day

### Pre-Deploy
- [ ] Notify team of deployment
- [ ] Have rollback plan ready
- [ ] Have monitoring dashboard open
- [ ] Be ready to respond quickly

### Deploy
- [ ] Deploy to production
- [ ] Monitor deployment logs
- [ ] Verify deployment succeeded
- [ ] Check health check endpoint

### Post-Deploy (First 15 Minutes)
- [ ] Monitor error rates (should be < 1%)
- [ ] Monitor response times (should be < 500ms)
- [ ] Check database connection pool
- [ ] Verify Stripe webhooks are delivering
- [ ] Test critical user flows manually
- [ ] Check for any error spikes

### Post-Deploy (First Hour)
- [ ] Continue monitoring metrics
- [ ] Check user signups are working
- [ ] Verify workflows can be created
- [ ] Verify billing flow works
- [ ] Check for any user-reported issues

---

## Post-Launch (First 72 Hours)

### Hourly Checks
- [ ] Error rate < 1%
- [ ] Response time P95 < 500ms
- [ ] Database latency < 100ms
- [ ] Webhook success rate > 99%
- [ ] No critical errors

### Daily Checks
- [ ] Review error logs
- [ ] Review performance metrics
- [ ] Check user feedback
- [ ] Review support tickets
- [ ] Check database growth
- [ ] Verify backups are running

### Week 1 Tasks
- [ ] Load test critical paths
- [ ] Security audit
- [ ] Performance optimization
- [ ] Fix any discovered issues
- [ ] Update documentation

---

## Emergency Procedures

### If Errors Spike (> 5%)
1. Check recent deployments
2. Check error logs
3. Identify root cause
4. Rollback if needed (see `docs/operations/ROLLBACK_PROCEDURE.md`)
5. Notify team

### If System Down
1. Check Vercel status
2. Check Supabase status
3. Check external services
4. Notify team immediately
5. Post status update
6. Begin rollback if needed

### If Data Issue
1. Stop affected operations
2. Assess scope of issue
3. Restore from backup if needed
4. Fix root cause
5. Verify data integrity
6. Resume operations

---

## Success Criteria

### Launch is Successful If:
- ✅ Error rate < 1% for first 24 hours
- ✅ No critical bugs discovered
- ✅ All critical user flows working
- ✅ Performance meets targets
- ✅ No data loss or corruption

### Launch Needs Attention If:
- ⚠️ Error rate 1-5% (investigate)
- ⚠️ Performance degradation (optimize)
- ⚠️ Minor bugs discovered (hotfix)

### Launch Failed If:
- ❌ Error rate > 5% (rollback)
- ❌ Critical bugs affecting users (rollback)
- ❌ Data loss or corruption (rollback)
- ❌ System unavailable (rollback)

---

## Contacts

- **On-Call Engineer:** [Set in monitoring]
- **Database Admin:** [Set in monitoring]
- **Support Email:** support@aiautomatedsystems.ca

---

**Last Updated:** 2025-01-31  
**Next Review:** After launch
