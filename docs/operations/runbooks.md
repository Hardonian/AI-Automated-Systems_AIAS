# Operational Runbooks

**Last Updated:** 2025-01-XX

## Table of Contents

1. [Deployment](#deployment)
2. [Monitoring](#monitoring)
3. [Incident Response](#incident-response)
4. [Database Operations](#database-operations)
5. [Security Incidents](#security-incidents)
6. [Performance Optimization](#performance-optimization)

## Deployment

### Pre-Deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Environment variables configured
- [ ] Database migrations reviewed
- [ ] Security audit completed

### Deployment Process

1. **Create Release Branch**
   ```bash
   git checkout -b release/vX.Y.Z
   ```

2. **Run Pre-Deployment Checks**
   ```bash
   pnpm ci
   pnpm build
   ```

3. **Deploy to Staging**
   ```bash
   vercel deploy --prebuilt --env=staging
   ```

4. **Verify Staging**
   - Check health endpoint
   - Run smoke tests
   - Verify critical workflows

5. **Deploy to Production**
   ```bash
   vercel deploy --prebuilt --prod
   ```

6. **Post-Deployment Verification**
   - Monitor error rates
   - Check performance metrics
   - Verify user-facing features

### Rollback Procedure

1. **Identify Issue**
   - Check error logs
   - Review monitoring dashboards
   - Confirm user reports

2. **Quick Rollback**
   ```bash
   vercel rollback
   ```

3. **Database Rollback** (if needed)
   ```bash
   pnpm db:rollback
   ```

## Monitoring

### Key Metrics to Monitor

- **Error Rate:** < 0.1%
- **Response Time:** P95 < 500ms
- **Uptime:** > 99.9%
- **API Success Rate:** > 99.5%

### Monitoring Tools

- **Vercel Analytics:** Performance and errors
- **Supabase Dashboard:** Database metrics
- **Sentry:** Error tracking
- **Custom Dashboards:** Business metrics

### Alert Thresholds

- Error rate > 1%
- Response time P95 > 1000ms
- Database connections > 80%
- API rate limit exceeded

## Incident Response

### Severity Levels

1. **Critical (P1):** Service down, data loss
2. **High (P2):** Major feature broken, performance degradation
3. **Medium (P3):** Minor feature issues, non-critical bugs
4. **Low (P4):** Cosmetic issues, minor improvements

### Response Process

1. **Acknowledge** - Within 15 minutes
2. **Assess** - Determine severity and impact
3. **Mitigate** - Apply temporary fixes if needed
4. **Resolve** - Fix root cause
5. **Post-Mortem** - Document and prevent recurrence

### Communication

- **Internal:** Slack #incidents channel
- **External:** Status page updates
- **Users:** Email for critical issues

## Database Operations

### Backup

- **Frequency:** Daily automated backups
- **Retention:** 30 days
- **Location:** Supabase managed backups

### Restore

```bash
# List backups
supabase backups list

# Restore from backup
supabase backups restore <backup-id>
```

### Migration

```bash
# Create migration
pnpm db:migrate:create <name>

# Apply migrations
pnpm db:migrate

# Rollback last migration
pnpm db:rollback
```

## Security Incidents

### Response Steps

1. **Contain** - Isolate affected systems
2. **Assess** - Determine scope and impact
3. **Remediate** - Fix vulnerabilities
4. **Notify** - Inform affected users if required
5. **Document** - Create incident report

### Common Issues

- **SQL Injection:** Review queries, use parameterized statements
- **XSS:** Sanitize all user input
- **Rate Limiting:** Check rate limit configuration
- **Authentication:** Verify JWT validation

## Performance Optimization

### Optimization Checklist

- [ ] Database queries optimized
- [ ] API responses cached
- [ ] Images optimized
- [ ] Code split and lazy loaded
- [ ] CDN configured
- [ ] Compression enabled

### Performance Targets

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

### Optimization Tools

- Lighthouse CI
- Web Vitals
- Bundle analyzer
- Database query analyzer

---

**Document Owner:** DevOps Team  
**Review Frequency:** Quarterly  
**Next Review:** 2025-04-XX
