# Tech Due Diligence Checklist — AIAS Platform

**Purpose:** Minimal but sharp checklist for tests, security, infra, and data risks  
**Last Updated:** 2025-01-31  
**Status:** Living Document

---

## Tests

### Unit Tests
- ✅ **Status:** Infrastructure exists (`vitest` configured)
- ⚠️ **Coverage:** Need to verify test coverage
- **Files:** `tests/` directory, `package.json` scripts
- **Command:** `pnpm test`
- **TODO:** Run tests and verify coverage > 70%

### E2E Tests
- ✅ **Status:** Infrastructure exists (`playwright` configured)
- ⚠️ **Coverage:** Need to verify E2E test coverage
- **Files:** `tests/e2e/` directory
- **Command:** `pnpm test:e2e`
- **TODO:** Run E2E tests and verify critical paths are covered

### API Tests
- ✅ **Status:** API test files exist (`tests/api/`)
- ⚠️ **Coverage:** Need to verify API test coverage
- **Command:** `pnpm test:api`
- **TODO:** Run API tests and verify all endpoints are tested

### Critical Tests to Add Soonest
1. **Authentication flow:** Signup, login, logout
2. **Workflow creation:** Create, edit, delete workflow
3. **Payment flow:** Stripe integration, subscription management
4. **Multi-tenant isolation:** Tenant data isolation
5. **Rate limiting:** Verify rate limits work correctly

**Priority:** HIGH  
**Effort:** 1-2 weeks  
**Files:** `tests/api/auth.test.ts`, `tests/api/workflows.test.ts`, `tests/api/billing.test.ts`

---

## Security

### Authentication & Authorization
- ✅ **Status:** Supabase Auth integrated
- ✅ **Status:** Multi-tenant isolation implemented
- ✅ **Status:** RLS policies on database tables
- **TODO:** Verify RLS policies are correctly configured

### Security Headers
- ✅ **Status:** Comprehensive headers in `next.config.ts` and `middleware.ts`
- ✅ **Headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **TODO:** Verify headers are correctly set in production

### Rate Limiting
- ✅ **Status:** Rate limiter implemented (`lib/performance/rate-limiter.ts`)
- ✅ **Status:** Per-endpoint rate limits configured
- **TODO:** Test rate limiting in production

### Environment Variables
- ✅ **Status:** `.env.example` complete
- ✅ **Status:** No secrets in code
- ⚠️ **TODO:** Verify secrets are stored securely (Vercel, GitHub Secrets)

### Security Hotspots to Fix
1. **API endpoints:** Verify all API routes have authentication/authorization
2. **Database queries:** Verify all queries use RLS policies
3. **File uploads:** Verify file upload validation (if applicable)
4. **XSS prevention:** Verify user input is sanitized
5. **SQL injection:** Verify parameterized queries (Supabase handles this)

**Priority:** HIGH  
**Effort:** 1 week  
**Files:** `app/api/**/*.ts`, `middleware.ts`, `lib/security/`

---

## Infrastructure

### Hosting
- ✅ **Status:** Vercel configured (`vercel.json`)
- ✅ **Status:** CI/CD workflows exist (`.github/workflows/`)
- ✅ **Status:** Deployment docs complete (`docs/DEPLOYMENT.md`)
- **TODO:** Verify production deployment works

### Database
- ✅ **Status:** Supabase (PostgreSQL) configured
- ✅ **Status:** Migrations exist (`supabase/migrations/`)
- ⚠️ **TODO:** Apply migrations to production database
- **TODO:** Set up database backups (Supabase handles this, but verify)

### CDN & Performance
- ✅ **Status:** Vercel Edge Network (automatic CDN)
- ✅ **Status:** Image optimization (Next.js Image component)
- ✅ **Status:** Code splitting (Next.js automatic)
- **TODO:** Verify performance metrics (LCP, FID, CLS)

### Monitoring & Logging
- ✅ **Status:** Metrics infrastructure exists
- ✅ **Status:** Health check endpoint (`/api/healthz`)
- ⚠️ **TODO:** Set up external monitoring (Sentry, Datadog) — Optional
- **TODO:** Configure log aggregation (if needed)

### Infrastructure Risks
1. **Database migrations:** Migrations need to be applied (but path is clear)
2. **Environment variables:** Need to be set in Vercel (but documented)
3. **Scaling:** Vercel auto-scales, but monitor costs
4. **Backups:** Supabase handles backups, but verify retention policy

**Priority:** MEDIUM  
**Effort:** 1 week  
**Files:** `vercel.json`, `.github/workflows/`, `supabase/config.toml`

---

## Data

### Schema
- ✅ **Status:** Comprehensive schema (users, tenants, workflows, etc.)
- ✅ **Status:** Migrations exist (30+ migration files)
- ⚠️ **TODO:** Validate schema after migration
- **Command:** `pnpm db:validate-schema`

### Data Integrity
- ✅ **Status:** RLS policies enforce data isolation
- ✅ **Status:** Foreign key constraints exist
- ⚠️ **TODO:** Verify data integrity checks (if any)

### Data Migration
- ✅ **Status:** Migration files exist
- ⚠️ **TODO:** Apply migrations to production
- ⚠️ **TODO:** Test rollback procedures (if needed)
- **Command:** `pnpm run supa:migrate:apply`

### Data Risks
1. **Migration failures:** Test migrations in staging first
2. **Data loss:** Verify backups before migrations
3. **Schema changes:** Test schema changes in staging
4. **Data validation:** Verify user input validation

**Priority:** MEDIUM  
**Effort:** 1 week  
**Files:** `supabase/migrations/`, `scripts/db-schema-validator.ts`

---

## Summary

### Critical (Fix Before Launch)
1. ✅ **Tests:** Run tests and verify coverage
2. ✅ **Security:** Verify authentication/authorization on all endpoints
3. ✅ **Infrastructure:** Verify production deployment works
4. ✅ **Data:** Apply migrations to production database

### Important (Fix Soon)
1. ⚠️ **Security audit:** Run security audit (if needed)
2. ⚠️ **Performance:** Verify performance metrics
3. ⚠️ **Monitoring:** Set up external monitoring (optional)

### Nice to Have (Later)
1. **Penetration testing:** If targeting enterprise customers
2. **SOC 2 compliance:** If targeting enterprise customers
3. **Load testing:** If expecting high traffic

---

## Quick Commands

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Validate database schema
pnpm db:validate-schema

# Check security
pnpm security:check

# Run smoke tests
pnpm smoke

# Check environment variables
pnpm env:doctor
```

---

## Related Documentation

- **[Project Readiness Report](./PROJECT_READINESS_REPORT.md)** — Overall status
- **[Founder Manual](./FOUNDER_MANUAL.md)** — Step-by-step guide
- **[Security Audit](./security-audit.md)** — Detailed security analysis (if exists)

---

**Last Updated:** 2025-01-31  
**Next Review:** Before production launch, then monthly
