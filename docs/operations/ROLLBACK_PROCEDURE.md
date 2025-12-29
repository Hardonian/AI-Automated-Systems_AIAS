# Rollback Procedure

**Last Updated:** 2025-01-31

This document describes the rollback procedure for the AIAS Platform.

## Overview

Rollbacks may be necessary due to:
- Critical bugs discovered post-deployment
- Performance degradation
- Security vulnerabilities
- Data corruption issues

## Rollback Types

### 1. Code Rollback (Vercel)

**When to use:** Code changes causing issues

**Procedure:**
1. Go to Vercel Dashboard → Project → Deployments
2. Find the last known good deployment
3. Click "..." → "Promote to Production"
4. Verify deployment is live
5. Monitor for 15 minutes

**Time to rollback:** < 5 minutes

**Impact:** 
- ✅ Instant code changes
- ⚠️ Database changes remain (may need separate rollback)

### 2. Database Migration Rollback

**When to use:** Database schema changes causing issues

**Procedure:**

#### For Recent Migrations (Last 24 hours):

1. **Identify problematic migration:**
   ```bash
   # Check migration history
   supabase migration list
   ```

2. **Create rollback migration:**
   ```bash
   # Create reverse migration
   tsx scripts/create-rollback.ts <migration_name>
   ```

3. **Apply rollback:**
   ```bash
   # Apply rollback migration
   supabase db push
   ```

4. **Verify:**
   ```bash
   # Run verification script
   tsx scripts/verify-migration-dependencies.ts
   ```

#### For Critical Data Changes:

1. **Restore from backup** (if available):
   ```bash
   # Restore database backup
   tsx scripts/db-backup.ts restore <backup_id>
   ```

2. **Manual SQL rollback** (last resort):
   - Connect to production database
   - Run reverse SQL statements
   - Verify data integrity

**Time to rollback:** 15-60 minutes (depending on migration complexity)

**Impact:**
- ⚠️ May cause data loss if not careful
- ⚠️ Requires database access

### 3. Environment Variable Rollback

**When to use:** Configuration changes causing issues

**Procedure:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Revert changed variables to previous values
3. Redeploy (or wait for next deployment)
4. Verify configuration

**Time to rollback:** < 5 minutes

**Impact:** Minimal (if caught early)

### 4. Feature Flag Rollback

**When to use:** Feature causing issues

**Procedure:**
1. Go to Edge Config or feature flag service
2. Disable problematic feature flag
3. Verify feature is disabled
4. Monitor for issues

**Time to rollback:** < 1 minute

**Impact:** Instant feature disable

## Rollback Decision Matrix

| Issue Type | Severity | Rollback Type | Time | Risk |
|------------|----------|---------------|------|------|
| Critical bug | High | Code | 5 min | Low |
| Data corruption | Critical | Database | 30 min | Medium |
| Performance | High | Code | 5 min | Low |
| Security | Critical | Code + Config | 10 min | Low |
| Feature broken | Medium | Feature Flag | 1 min | Low |

## Pre-Rollback Checklist

- [ ] Identify root cause
- [ ] Determine rollback type
- [ ] Notify team
- [ ] Backup current state (if database rollback)
- [ ] Document rollback steps
- [ ] Verify rollback target is known good state

## Post-Rollback Checklist

- [ ] Verify system is stable
- [ ] Monitor error rates
- [ ] Check critical metrics
- [ ] Notify users (if needed)
- [ ] Document incident
- [ ] Plan fix for next deployment

## Emergency Contacts

- **On-Call Engineer:** [Set in monitoring system]
- **Database Admin:** [Set in monitoring system]
- **Vercel Support:** support@vercel.com

## Rollback Testing

**Frequency:** Quarterly

**Procedure:**
1. Create test deployment
2. Apply test migration
3. Test rollback procedure
4. Document any issues
5. Update procedure if needed

## Common Rollback Scenarios

### Scenario 1: Broken API Endpoint

1. Identify broken endpoint
2. Check deployment history
3. Rollback code to previous version
4. Verify endpoint works
5. Investigate root cause

### Scenario 2: Database Migration Failure

1. Check migration logs
2. Identify failed migration
3. Create rollback migration
4. Apply rollback
5. Fix migration
6. Re-apply fixed migration

### Scenario 3: Performance Degradation

1. Check deployment timeline
2. Identify recent changes
3. Rollback code if recent deployment
4. Check database queries
5. Optimize if needed

## Prevention

To minimize rollback needs:

1. **Staging Testing:** Always test in staging first
2. **Gradual Rollouts:** Use feature flags for gradual rollouts
3. **Database Backups:** Regular automated backups
4. **Monitoring:** Set up alerts for critical metrics
5. **Canary Deployments:** Test with small user group first

## Documentation Updates

After each rollback:
1. Document what was rolled back
2. Document why
3. Document lessons learned
4. Update this procedure if needed

---

**Last Rollback:** [Date]  
**Last Reviewed:** 2025-01-31  
**Next Review:** 2025-04-30
