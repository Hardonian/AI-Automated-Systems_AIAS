# Backend & Database Strategy

**Last Updated:** 2025-01-XX  
**Status:** Canonical Backend Confirmed

---

## Executive Summary

**Canonical Backend:** Supabase (PostgreSQL)  
**Legacy/Unused:** Prisma schema exists but is not actively used  
**Decision:** Supabase is the single source of truth for all database operations

---

## Backend Architecture

### Primary: Supabase

**Why Supabase:**
1. **BaaS Integration:** Provides auth, storage, realtime, and edge functions out of the box
2. **Cost-Effective:** Free tier suitable for MVP/demo, scales predictably
3. **Developer Experience:** Excellent TypeScript support, auto-generated types
4. **CI/CD Friendly:** CLI works well in GitHub Actions (no local setup required)
5. **Multi-Tenant Ready:** Built-in RLS (Row Level Security) for tenant isolation
6. **Production Proven:** Used by thousands of production apps

**What Supabase Provides:**
- ✅ PostgreSQL database (managed)
- ✅ Authentication (email, OAuth, magic links)
- ✅ Storage (file uploads, images)
- ✅ Realtime subscriptions (live updates)
- ✅ Edge Functions (serverless functions)
- ✅ Auto-generated TypeScript types
- ✅ Database migrations (SQL-based)
- ✅ RLS policies (security at DB level)

**Current Usage:**
- Database: All tables defined in `supabase/migrations/`
- Auth: Supabase Auth used throughout (`lib/supabase/client.ts`)
- Storage: Referenced in codebase
- Edge Functions: 17 functions in `supabase/functions/`
- Client: `@supabase/supabase-js` used directly (no ORM wrapper)

---

## Legacy: Prisma

### Current State

**Location:** `apps/web/prisma/schema.prisma`

**Status:** ⚠️ **Legacy/Unused**

**Evidence:**
1. Codebase uses `@supabase/supabase-js` client directly
2. No Prisma client imports found in active code
3. Database operations go through Supabase client, not Prisma
4. Migrations are in `supabase/migrations/`, not `prisma/migrations/`
5. Package.json has Prisma scripts but they reference `apps/web/prisma/` which may not be used

**Why It Exists:**
- Likely from an earlier iteration of the project
- May have been used for local development before Supabase
- Could be a backup/alternative schema definition

### Recommendation

**Option 1: Remove (Recommended)**
- Delete `apps/web/prisma/schema.prisma`
- Remove Prisma dependencies from `package.json`
- Remove Prisma scripts from `package.json`
- Clean up any Prisma-related CI steps

**Option 2: Archive**
- Move to `docs/archive/prisma-schema.prisma`
- Document as "legacy schema - not used"
- Keep for reference if needed

**Option 3: Keep as Documentation**
- If schema represents intended structure, keep it but mark as "reference only"
- Don't run Prisma migrations in CI
- Use Supabase migrations as source of truth

**Decision:** We'll archive it for now (Option 2) to avoid breaking anything, but mark it clearly as legacy.

---

## Database Migrations

### Current Approach: Supabase Migrations

**Location:** `supabase/migrations/`

**Format:** SQL files with timestamped names

**Examples:**
- `20250120000000_privacy_security_automation.sql`
- `20250121000000_guardian_trust_ledger.sql`
- `99999999999999_master_consolidated_schema.sql`

**Migration Workflow:**
1. Developer creates SQL migration file
2. Commits to `supabase/migrations/`
3. CI applies migrations via Supabase CLI (`apply-supabase-migrations.yml`)
4. Migrations run on push to `main` or manual trigger

**CI Integration:**
- Workflow: `.github/workflows/apply-supabase-migrations.yml`
- Trigger: Push to `main` with migration changes, manual, daily schedule
- Method: Supabase CLI (`supabase db push`)
- Fallback: Direct `psql` if CLI fails

### Migration Best Practices

**✅ Current Practices:**
- Timestamped migration files
- SQL-based (explicit, version-controlled)
- CI-applied (no local CLI required)
- Dry-run capability (`supabase db remote commit --dry-run`)

**⚠️ Areas for Improvement:**
1. **Consolidation:** 27 migration files - some may be redundant
2. **Validation:** No automated schema validation after migrations
3. **Rollback:** No documented rollback strategy
4. **Testing:** Migrations not tested in CI before production

### Recommended Migration Workflow

```mermaid
graph LR
    A[Developer creates migration] --> B[Commit to supabase/migrations/]
    B --> C[CI: Validate migration syntax]
    C --> D[CI: Apply to staging DB]
    D --> E[CI: Run schema validation]
    E --> F[CI: Apply to production]
    F --> G[CI: Verify production schema]
```

**Implementation:**
1. Add migration validation script (`scripts/db-validate-migrations.ts`)
2. Add schema validation script (`scripts/db-validate-schema.ts`)
3. Update CI to run validation before applying
4. Document rollback procedures

---

## Database Connection

### Connection Strings

**Current Setup:**
- `DATABASE_URL`: Primary connection (used by Prisma if it were active)
- `DIRECT_URL`: Direct connection (for migrations)
- Supabase client uses `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`

**Recommendation:**
- Use Supabase connection strings directly
- `DATABASE_URL` can be constructed from Supabase credentials:
  ```
  postgresql://postgres:{service-role-key}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require
  ```
- Keep `DATABASE_URL` for any legacy code that might need it
- Primary access should be via Supabase client, not direct Postgres connection

---

## Scaling Considerations

### Current Scale
- **Free Tier Suitable:** For MVP/demo
- **Limits:** 
  - Supabase Free: 500MB database, 2GB bandwidth
  - Vercel Free: 100GB bandwidth, serverless functions

### When to Scale Up

**Supabase Pro ($25/month):**
- 8GB database
- 50GB bandwidth
- Daily backups
- **Trigger:** When hitting free tier limits

**Supabase Team ($599/month):**
- 32GB database
- 250GB bandwidth
- Point-in-time recovery
- **Trigger:** When Pro tier limits are reached

**Self-Hosted Postgres (Future):**
- Consider if Supabase costs exceed $1000/month
- Requires DevOps expertise
- More control, more complexity

### Migration Path (If Needed)

If we need to migrate away from Supabase:

1. **Export Schema:** Supabase provides SQL dump
2. **Export Data:** `pg_dump` from Supabase
3. **Import to New DB:** Standard PostgreSQL import
4. **Update Connection Strings:** Environment variables
5. **Replace Auth:** Implement custom auth or use Auth0/Firebase
6. **Replace Storage:** Use S3, Cloudflare R2, or similar
7. **Replace Realtime:** Use PostgreSQL LISTEN/NOTIFY or external service

**Recommendation:** Stay on Supabase until costs justify migration (likely $500+/month).

---

## Cost Analysis

### Current Costs (Free Tier)

**Supabase:**
- Database: Free (up to 500MB)
- Auth: Free (unlimited users)
- Storage: Free (1GB)
- Edge Functions: Free (2M invocations/month)
- **Total: $0/month**

**Vercel:**
- Hosting: Free (hobby plan)
- Bandwidth: Free (100GB)
- Serverless Functions: Free (100GB-hours)
- **Total: $0/month**

### Projected Costs (Growth)

**At 1000 Active Users:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- **Total: ~$45/month**

**At 10,000 Active Users:**
- Supabase Team: $599/month
- Vercel Pro: $20/month
- **Total: ~$619/month**

**At 100,000 Active Users:**
- Supabase Enterprise: Custom pricing
- Vercel Enterprise: Custom pricing
- **Total: $2000-5000/month** (estimate)

---

## Security Considerations

### Database Security

**Current:**
- ✅ RLS (Row Level Security) policies in migrations
- ✅ Service role key used server-side only
- ✅ Anon key used client-side (with RLS enforcement)
- ✅ Connection strings use SSL (`sslmode=require`)

**Recommendations:**
1. **Review RLS Policies:** Audit all tables for proper tenant isolation
2. **Rotate Keys:** Regularly rotate Supabase service role key
3. **Backup Strategy:** Ensure Supabase backups are enabled (Pro tier)
4. **Audit Logging:** Use Supabase audit logs or custom `audit_logs` table

### Access Control

**Multi-Tenant Isolation:**
- Implemented via middleware (`middleware.ts`)
- Tenant ID extracted from headers/subdomain/query params
- Tenant membership validated against `tenant_members` table
- RLS policies enforce at database level

**Admin Access:**
- Basic Auth for admin dashboard (non-Vercel)
- Vercel Access Controls for Vercel deployments
- Service role key for server-side admin operations

---

## Backup & Recovery

### Current State

**Supabase Free Tier:**
- No automated backups
- Manual exports available
- **Risk:** Data loss if database corrupted

**Supabase Pro Tier:**
- Daily automated backups
- 7-day retention
- **Cost:** $25/month

**Recommendation:**
- Upgrade to Pro tier before production launch
- Document manual backup procedure
- Test restore procedure

### Backup Strategy

1. **Automated:** Supabase Pro daily backups
2. **Manual:** Weekly `pg_dump` exports (store in S3/GCS)
3. **Point-in-Time Recovery:** Supabase Team tier ($599/month)

---

## Monitoring & Observability

### Database Monitoring

**Supabase Dashboard:**
- Query performance
- Connection pool usage
- Database size
- API usage

**Custom Monitoring:**
- Add database query logging
- Monitor slow queries
- Track connection pool exhaustion
- Alert on database size limits

**Recommendations:**
1. Set up Supabase alerts for database size
2. Monitor query performance via Supabase dashboard
3. Add custom telemetry for critical queries
4. Set up alerts for connection pool exhaustion

---

## Conclusion

**Canonical Backend:** Supabase (PostgreSQL)  
**Status:** ✅ Confirmed and in use  
**Legacy:** Prisma schema archived (not used)  
**Cost:** Free tier suitable for MVP, Pro tier ($25/month) for production  
**Scaling:** Supabase scales well up to ~10K users, then consider alternatives  

**Next Steps:**
1. Archive Prisma schema
2. Add migration validation
3. Document backup procedures
4. Set up database monitoring
