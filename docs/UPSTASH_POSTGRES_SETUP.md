# UpStash Postgres Setup Guide for Prisma

## Overview

This guide explains how to configure Prisma to use UpStash Postgres, leveraging your existing UpStash subscription for both Redis and PostgreSQL.

## Why UpStash Postgres?

- ✅ **Serverless PostgreSQL** - Pay only for what you use
- ✅ **Global Edge Network** - Low latency worldwide
- ✅ **Automatic Scaling** - No infrastructure management
- ✅ **Unified Platform** - Use same account for Redis and Postgres
- ✅ **Prisma Compatible** - Works seamlessly with Prisma ORM

## Prerequisites

- UpStash account with active subscription
- Existing UpStash Redis database (optional, but recommended)

## Setup Steps

### 1. Create UpStash Postgres Database

1. **Log in to UpStash Console:**
   - Go to https://console.upstash.com
   - Sign in with your account

2. **Create Postgres Database:**
   - Click "Create Database"
   - Select "Postgres" as database type
   - Choose a name (e.g., `aias-production`)
   - Select region closest to your deployment
   - Choose database size based on your needs

3. **Get Connection Strings:**
   - After creation, go to Database → Details
   - Copy the connection strings:
     - **REST API URL** (for serverless functions)
     - **Direct Connection URL** (for Prisma migrations)

### 2. Configure Environment Variables

#### For Vercel Deployment

1. **Go to Vercel Dashboard:**
   - Navigate to your project
   - Go to Settings → Environment Variables

2. **Add UpStash Postgres Variables:**
   ```bash
   # Primary connection (for Prisma client)
   UPSTASH_POSTGRES_URL=postgresql://default:password@host.upstash.io:5432/defaultdb
   
   # Direct connection (for migrations)
   UPSTASH_POSTGRES_DIRECT_URL=postgresql://default:password@host.upstash.io:5432/defaultdb
   ```

3. **Fallback to Standard PostgreSQL:**
   - If you prefer to use Supabase or another PostgreSQL provider, you can still use:
     ```bash
     DATABASE_URL=postgresql://...
     DIRECT_URL=postgresql://...
     ```
   - The system will automatically use `UPSTASH_POSTGRES_URL` if available, otherwise falls back to `DATABASE_URL`

#### For Local Development

Add to `.env.local`:
```bash
# UpStash Postgres (recommended for production)
UPSTASH_POSTGRES_URL=postgresql://default:password@host.upstash.io:5432/defaultdb
UPSTASH_POSTGRES_DIRECT_URL=postgresql://default:password@host.upstash.io:5432/defaultdb

# Or use Supabase/local PostgreSQL
DATABASE_URL=postgresql://localhost:5432/aias_platform
DIRECT_URL=postgresql://localhost:5432/aias_platform
```

### 3. Prisma Configuration

The Prisma schema is already configured to work with UpStash Postgres. No changes needed!

The schema uses:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

The build process automatically:
- Uses `UPSTASH_POSTGRES_URL` if available, otherwise `DATABASE_URL`
- Sets `DIRECT_URL` from `UPSTASH_POSTGRES_DIRECT_URL` or falls back to `DATABASE_URL`

### 4. Run Migrations

```bash
# Generate Prisma Client
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Or push schema (for development)
pnpm run db:push
```

### 5. Verify Connection

Test the connection:
```bash
# Check Prisma connection
pnpm run db:studio

# Or test via API
curl http://localhost:3000/api/healthz
```

## Architecture

### Database Access Layers

1. **Prisma (UpStash Postgres):**
   - Server-side operations
   - Type-safe queries
   - Migration management
   - Used in: `packages/lib/`, `ops/`, seed scripts

2. **Supabase Client:**
   - Client-side operations
   - Real-time subscriptions
   - Auth integration
   - Used in: `app/` directory, API routes

3. **Redis (UpStash):**
   - Caching
   - Queue management (BullMQ)
   - Rate limiting
   - Session storage

### Connection Flow

```
┌─────────────────┐
│   Application   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────┐
│ Prisma │  │ Supabase │
│ (UpStash│  │  Client  │
│ Postgres)│  │          │
└────────┘  └──────────┘
    │
    ▼
┌─────────────┐
│ UpStash     │
│ Postgres    │
└─────────────┘
```

## Environment Variable Priority

The system checks environment variables in this order:

1. **For Prisma Client:**
   - `UPSTASH_POSTGRES_URL` (if set)
   - `DATABASE_URL` (fallback)

2. **For Migrations:**
   - `UPSTASH_POSTGRES_DIRECT_URL` (if set)
   - `DIRECT_URL` (if set)
   - `UPSTASH_POSTGRES_URL` or `DATABASE_URL` (fallback)

## Build Process

The Vercel build automatically:
1. Sets `DATABASE_URL` from `UPSTASH_POSTGRES_URL` if available
2. Sets `DIRECT_URL` from `UPSTASH_POSTGRES_DIRECT_URL` or uses `DATABASE_URL`
3. Generates Prisma Client
4. Runs migrations (if database is available)
5. Builds Next.js application

## Migration from Supabase Postgres

If you're currently using Supabase Postgres and want to migrate to UpStash:

1. **Create UpStash Postgres database**
2. **Export data from Supabase:**
   ```bash
   pg_dump $SUPABASE_DATABASE_URL > backup.sql
   ```
3. **Import to UpStash:**
   ```bash
   psql $UPSTASH_POSTGRES_URL < backup.sql
   ```
4. **Update environment variables**
5. **Test thoroughly**
6. **Switch over**

## Cost Optimization

### UpStash Postgres Pricing
- **Free Tier:** 10K reads/day, 10K writes/day
- **Pay-as-you-go:** $0.20 per 100K reads, $0.20 per 100K writes
- **Typical Usage:** ~1M requests/month = ~$2-4/month

### Combined with Redis
- Use same UpStash account for both Redis and Postgres
- Unified billing and management
- Better cost efficiency

## Security Best Practices

1. **Never commit credentials** to git
2. **Use environment variables** for all connection strings
3. **Enable SSL/TLS** for production connections
4. **Rotate credentials** regularly
5. **Use connection pooling** (handled automatically by Prisma)
6. **Restrict database access** to only your application IPs

## Troubleshooting

### Connection Issues

**Issue:** `Prisma schema validation - Environment variable not found`

**Solution:**
- Verify `UPSTASH_POSTGRES_URL` or `DATABASE_URL` is set
- Check environment variables in Vercel dashboard
- Ensure variable names are correct (case-sensitive)

### Migration Failures

**Issue:** `prisma migrate deploy` fails

**Solution:**
- Verify `UPSTASH_POSTGRES_DIRECT_URL` or `DIRECT_URL` is set
- Check database credentials are correct
- Ensure database is accessible from build environment
- Check network/firewall settings

### Build Timeouts

**Issue:** Build times out during Prisma generation

**Solution:**
- UpStash Postgres is serverless and may have cold starts
- Consider using connection pooling
- Check UpStash dashboard for connection limits
- Verify region matches deployment region

## Monitoring

### UpStash Dashboard
- Monitor database usage
- Track query performance
- View connection metrics
- Set up alerts

### Application Logs
- Check Prisma query logs (in development)
- Monitor connection errors
- Track migration status

## Support

For issues or questions:
- UpStash Documentation: https://docs.upstash.com/postgres
- Prisma Documentation: https://www.prisma.io/docs
- Check application logs for detailed error messages
- Verify environment variables are set correctly

## Next Steps

1. ✅ Set up UpStash Postgres database
2. ✅ Configure environment variables
3. ✅ Run migrations
4. ✅ Test connection
5. ✅ Monitor usage and performance
6. ✅ Optimize queries as needed
