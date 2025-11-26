# Local Setup Guide

**Purpose:** Get the app running locally from a fresh clone  
**Time:** ~10 minutes  
**Prerequisites:** Node.js 20+, pnpm 8.15.0+, Git

---

## Step 1: Clone Repository

```bash
git clone https://github.com/your-org/aias-platform.git
cd aias-platform
```

---

## Step 2: Install Dependencies

```bash
pnpm install
```

**Note:** Uses `pnpm-lock.yaml` for deterministic installs. If install fails, try:
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

---

## Step 3: Set Up Environment Variables

```bash
cp .env.example .env.local
```

**Edit `.env.local` and fill in REQUIRED variables:**

### Minimum Required (App won't run without these):

```bash
# Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_PROJECT_REF={project-ref}

# Construct from Supabase credentials
DATABASE_URL=postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### Optional (For full features):

```bash
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Email (for notifications)
RESEND_API_KEY=re_...
```

**TODO:** Get Supabase credentials from [supabase.com](https://supabase.com) → Create project → Settings → API

---

## Step 4: Set Up Database

### Option A: Using Supabase (Recommended)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait ~2 minutes for provisioning

2. **Get Credentials:**
   - Settings → API → Copy URL and keys
   - Settings → General → Copy Project Reference

3. **Apply Migrations:**
   ```bash
   # Link Supabase project (requires SUPABASE_ACCESS_TOKEN)
   pnpm run supa:link
   
   # Apply migrations via Supabase CLI
   pnpm run supa:migrate:apply
   ```
   
   **OR:** Migrations are applied automatically in CI/CD when you push to `main`

**TODO:** If you don't have `SUPABASE_ACCESS_TOKEN`, migrations will be applied in CI/CD. For local dev, you can skip migrations if using Supabase's hosted database.

### Option B: Local PostgreSQL (Advanced)

```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb aias_platform

# Set DATABASE_URL in .env.local
DATABASE_URL=postgresql://localhost:5432/aias_platform

# Apply migrations manually
psql aias_platform < supabase/migrations/000000000800_upsert_functions.sql
# ... apply all migrations in order
```

---

## Step 5: Start Development Server

```bash
pnpm dev
```

**Server runs on:** `http://localhost:3000`

**If port 3000 is in use:**
```bash
PORT=3001 pnpm dev
```

---

## Step 6: Verify Setup

1. **Open browser:** `http://localhost:3000`
2. **Check console:** No critical errors
3. **Test API:** `http://localhost:3000/api/healthz` should return `{"status":"ok"}`

---

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # TypeScript type checking
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run unit tests
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests (requires dev server)

# Database
pnpm regenerate-types # Regenerate Supabase types
pnpm db:validate-schema # Validate database schema

# Smoke Tests
pnpm smoke            # Run smoke tests
```

---

## Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Environment Variables Not Loading
1. Check `.env.local` exists (not `.env`)
2. Restart dev server
3. Verify variable names match exactly (case-sensitive)

### Database Connection Fails
1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is active
3. Verify `DATABASE_URL` format is correct

### Type Errors
```bash
pnpm regenerate-types
rm -rf .next
# Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Next Steps

- **Read:** [Local Development Guide](./local-dev.md) for detailed workflow
- **Deploy:** See [Deployment Guide](./DEPLOYMENT.md) for production setup
- **Explore:** Check `app/page.tsx` (homepage) and `components/` directory

---

## Quick Reference

| Item | Value |
|------|-------|
| Dev Server | `http://localhost:3000` |
| Package Manager | pnpm 8.15.0 |
| Node Version | 20.x LTS |
| Database | Supabase (PostgreSQL) |
| Framework | Next.js 14 |

---

**Setup Complete! 🚀**
