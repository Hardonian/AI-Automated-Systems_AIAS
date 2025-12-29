# Operator Playbook

**Last Updated:** 2025-01-31

Common operational tasks and troubleshooting procedures for AIAS Platform.

## Table of Contents

1. [Health Checks](#health-checks)
2. [Common Issues](#common-issues)
3. [Monitoring](#monitoring)
4. [Database Operations](#database-operations)
5. [User Support](#user-support)

---

## Health Checks

### Quick Health Check

```bash
# Check API health
curl https://aiautomatedsystems.ca/api/healthz

# Expected: {"ok": true, ...}
```

### Full System Check

1. **API Health:**
   ```bash
   curl https://aiautomatedsystems.ca/api/healthz
   ```

2. **Database:**
   - Check Supabase dashboard
   - Verify connection pool usage
   - Check query performance

3. **Vercel:**
   - Check deployment status
   - Verify function execution times
   - Check error rates

4. **External Services:**
   - Stripe: Check webhook delivery
   - Resend: Check email delivery
   - Supabase: Check API status

---

## Common Issues

### Issue: High Error Rate

**Symptoms:**
- Error rate > 1% in monitoring
- Users reporting issues

**Diagnosis:**
1. Check error logs in Vercel
2. Check Sentry (if configured)
3. Check database logs
4. Check external service status

**Resolution:**
1. Identify error pattern
2. Check recent deployments
3. Rollback if needed (see [Rollback Procedure](./ROLLBACK_PROCEDURE.md))
4. Fix root cause

### Issue: Database Connection Errors

**Symptoms:**
- "Database connection failed" errors
- High latency on database queries

**Diagnosis:**
1. Check Supabase dashboard
2. Check connection pool usage
3. Check query performance

**Resolution:**
1. Check if Supabase is down (status page)
2. Increase connection pool if needed
3. Optimize slow queries
4. Check for connection leaks

### Issue: Stripe Webhook Failures

**Symptoms:**
- Users not getting upgraded after payment
- Webhook delivery failures in Stripe dashboard

**Diagnosis:**
1. Check Stripe webhook logs
2. Check `/api/stripe/webhook` logs
3. Verify webhook secret is correct

**Resolution:**
1. Check webhook endpoint is accessible
2. Verify signature verification
3. Manually reconcile if needed:
   ```bash
   # Use reconciliation endpoint
   curl -X POST https://aiautomatedsystems.ca/api/billing/reconcile \
     -H "Authorization: Bearer <admin-token>"
   ```

### Issue: User Cannot Sign Up

**Symptoms:**
- Signup form not working
- Error messages on signup

**Diagnosis:**
1. Check `/api/auth/signup` logs
2. Check rate limiting
3. Check Supabase Auth status

**Resolution:**
1. Check if rate limit exceeded
2. Verify Supabase Auth is working
3. Check email service (Resend) status
4. Clear rate limit if needed

### Issue: Workflows Not Executing

**Symptoms:**
- Workflows stuck in "pending"
- Execution timeouts

**Diagnosis:**
1. Check workflow execution logs
2. Check function timeout settings
3. Check external API status

**Resolution:**
1. Increase function timeout if needed
2. Check external API availability
3. Retry failed executions
4. Check user's plan limits

---

## Monitoring

### Key Metrics to Monitor

1. **Error Rate:** Should be < 1%
2. **Response Time:** P95 < 500ms
3. **Database Latency:** P95 < 100ms
4. **Webhook Success Rate:** > 99%
5. **Signup Success Rate:** > 95%

### Alert Thresholds

- **Error Rate:** > 1% for 5 minutes → Alert
- **Response Time:** P95 > 1000ms for 5 minutes → Alert
- **Database Latency:** P95 > 500ms for 5 minutes → Alert
- **Webhook Failures:** > 5% in 5 minutes → Alert
- **Health Check Failure:** Immediate alert

### Monitoring Tools

1. **Vercel Analytics:** Function performance
2. **Supabase Dashboard:** Database metrics
3. **Stripe Dashboard:** Webhook delivery
4. **Sentry:** Error tracking (if configured)

---

## Database Operations

### Backup Database

```bash
# Create backup
tsx scripts/db-backup.ts create

# List backups
tsx scripts/db-backup.ts list

# Restore backup
tsx scripts/db-backup.ts restore <backup_id>
```

### Run Migrations

```bash
# Verify dependencies first
tsx scripts/verify-migration-dependencies.ts

# Apply migrations
supabase db push

# Or use script
tsx scripts/apply-all-migrations.ts
```

### Check Database Health

```bash
# Run health check
tsx scripts/db-sanity-check-production.ts

# Check migration status
supabase migration list
```

### Common Database Queries

```sql
-- Check active users
SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days';

-- Check subscription status
SELECT tier, COUNT(*) FROM subscription_tiers GROUP BY tier;

-- Check workflow usage
SELECT COUNT(*) FROM workflows WHERE created_at > NOW() - INTERVAL '7 days';

-- Check error logs
SELECT * FROM error_logs ORDER BY created_at DESC LIMIT 100;
```

---

## User Support

### Common User Issues

1. **"I can't sign up"**
   - Check rate limiting
   - Verify email service
   - Check Supabase Auth

2. **"My subscription didn't activate"**
   - Check Stripe webhook logs
   - Manually reconcile if needed
   - Verify subscription in database

3. **"Workflow not working"**
   - Check execution logs
   - Verify user's plan limits
   - Check external API status

4. **"I can't access my data"**
   - Check RLS policies
   - Verify tenant membership
   - Check user permissions

### Support Escalation

1. **Level 1:** Check logs, verify user account
2. **Level 2:** Check database, verify configuration
3. **Level 3:** Check code, verify deployments
4. **Level 4:** Escalate to engineering team

---

## Emergency Procedures

### System Down

1. Check Vercel status
2. Check Supabase status
3. Check external services
4. Notify team
5. Post status update

### Data Breach

1. Immediately revoke compromised credentials
2. Notify security team
3. Check access logs
4. Document incident
5. Notify affected users (if required)

### Payment Issues

1. Check Stripe status
2. Verify webhook delivery
3. Manually reconcile if needed
4. Notify affected users

---

## Maintenance Windows

### Scheduled Maintenance

- **Frequency:** Monthly (first Sunday, 2-4 AM EST)
- **Duration:** 2 hours
- **Notification:** 48 hours in advance

### Emergency Maintenance

- **Notification:** As soon as possible
- **Duration:** Minimize downtime
- **Communication:** Status page + email

---

## Useful Commands

```bash
# Health check
curl https://aiautomatedsystems.ca/api/healthz

# Verify migrations
tsx scripts/verify-migration-dependencies.ts

# Check build status
pnpm typecheck && pnpm lint

# Run database sanity check
tsx scripts/db-sanity-check-production.ts

# Check environment variables
tsx scripts/validate-env.ts
```

---

## Contact Information

- **On-Call:** [Set in PagerDuty/Opsgenie]
- **Engineering:** [Team Slack channel]
- **Support:** support@aiautomatedsystems.ca

---

**Last Updated:** 2025-01-31  
**Next Review:** 2025-04-30
