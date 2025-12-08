# Required Environment Variables

This document lists all environment variables required for the application to build and run properly.

## Supabase Configuration (Required)

These variables are available in GitHub repository secrets and should be set in your deployment environment:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)

## Database Configuration (Required)

- `DATABASE_URL` - PostgreSQL connection string (or `UPSTASH_POSTGRES_URL` for UpStash)
- `DIRECT_URL` - Direct database connection URL (optional, or `UPSTASH_POSTGRES_DIRECT_URL`)

## Build Configuration

The build process will automatically use environment variables from:
- GitHub Actions: Repository secrets
- Vercel: Environment variables in dashboard
- Local: `.env.local` file

**Note**: During build, if `SKIP_ENV_VALIDATION=true` is set AND you're not in GitHub Actions or Vercel, the build will use placeholder values. This is only for local development builds without proper env setup.

## Verification

To verify your environment variables are set correctly:

```bash
# Check if variables are accessible
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
echo $DATABASE_URL
```

## GitHub Actions Setup

In your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL` (if using direct connection)

The build will automatically use these secrets when running in GitHub Actions.
