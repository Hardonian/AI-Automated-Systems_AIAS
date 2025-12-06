# Prisma Migrations Setup

This document describes how to set up and run Prisma migrations for the AIAS platform.

## Local Development

### Environment Configuration

The `DATABASE_URL` is stored in `.env` (which is gitignored for security). 

**Format:**
```bash
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="${DATABASE_URL}"
```

**Note:** The `.env` file is gitignored and should never be committed to the repository.

### Running Migrations Locally

1. **Check migration status:**
   ```bash
   cd apps/web
   pnpm prisma migrate status
   ```

2. **Apply pending migrations:**
   ```bash
   pnpm run db:migrate
   # or directly:
   cd apps/web && pnpm prisma migrate deploy
   ```

3. **Create a new migration:**
   ```bash
   cd apps/web
   pnpm prisma migrate dev --name your_migration_name
   ```

## GitHub Actions Workflow

### Setup

1. **Add GitHub Secrets:**
   - Go to Repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DATABASE_URL`: Your Supabase PostgreSQL connection string
     - `DIRECT_URL`: (Optional) Direct connection URL, defaults to DATABASE_URL if not set

2. **Workflow Triggers:**
   The `prisma-migrations.yml` workflow runs automatically on:
   - Push to `main`/`master` when migrations or schema files change
   - Manual trigger via `workflow_dispatch`
   - Daily schedule at 3 AM UTC

### Workflow Steps

The workflow performs the following steps:

1. **Check migration status (before)** - Records current state
2. **Apply Prisma migrations** - Runs `pnpm run db:migrate`
3. **Verify migration status (after)** - Confirms all migrations applied
4. **Verify database schema** - Tests database connectivity
5. **Archive applied migrations** - Copies migrations to `prisma/_archive/`
6. **Update MIGRATION_LOG.md** - Logs the migration run
7. **Upload artifacts** - Saves migration logs for 90 days

### Workflow Output

- **Success State:** `GO-LIVE VERIFIED` - All migrations applied, schema verified
- **Partial State:** `PARTIAL – MANUAL ACTION REQUIRED` - Migrations applied but verification unclear
- **Failed State:** `FAILED – SEE ERRORS ABOVE` - Migration failed

### Viewing Migration Logs

Migration logs are stored in:
- `MIGRATION_LOG.md` at the repository root
- GitHub Actions artifacts (retained for 90 days)
- Workflow run summary

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use GitHub Secrets** - Store `DATABASE_URL` as a repository secret
3. **Rotate credentials** - Update secrets if credentials are compromised
4. **IP Whitelisting** - Ensure GitHub Actions IPs are whitelisted in Supabase if required

## Troubleshooting

### Connection Errors

If you see `P1001: Can't reach database server`:
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure IP whitelist allows connections (if enabled)
- Verify SSL mode is set to `require`

### Migration Conflicts

If migrations fail due to conflicts:
1. Check `MIGRATION_LOG.md` for previous runs
2. Verify database state matches expected schema
3. Consider using `prisma migrate resolve` to mark migrations as applied

### Schema Drift

If Prisma reports schema drift:
1. Run `pnpm prisma migrate status` to see differences
2. Use `pnpm prisma db pull` to inspect current database schema
3. Create a new migration to align schema: `pnpm prisma migrate dev --name fix_drift`

## Related Documentation

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Supabase Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
