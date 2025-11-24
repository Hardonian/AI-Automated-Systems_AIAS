# Local Development Guide

**Last Updated:** 2025-01-XX  
**Purpose:** Complete guide to setting up and running the AIAS Platform locally

---

## Prerequisites

### Required

- **Node.js:** 20.x LTS (check with `node --version`)
- **pnpm:** 8.15.0 or higher (check with `pnpm --version`)
- **Git:** Latest version
- **Supabase Account:** Free account at [supabase.com](https://supabase.com)

### Optional

- **Docker:** For local database (if not using Supabase)
- **VS Code:** Recommended IDE
- **GitHub CLI:** For easier GitHub operations

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/aias-platform.git
cd aias-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

**Note:** Uses `pnpm-lock.yaml` for deterministic installs.

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

**Edit `.env.local` and fill in:**

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase Dashboard → Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase Dashboard → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase Dashboard → Settings → API
- `SUPABASE_PROJECT_REF` - From Supabase Dashboard → Settings → General
- `DATABASE_URL` - Construct from Supabase credentials (see `.env.example`)

**Optional (for full features):**
- `STRIPE_SECRET_KEY` - For payment features
- `OPENAI_API_KEY` - For AI features
- `RESEND_API_KEY` - For email features

### 4. Start Development Server

```bash
pnpm dev
```

**Server runs on:** `http://localhost:3000`

---

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start development server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting

# Testing
pnpm test             # Run unit tests (Vitest)
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm test:ui          # Run tests with UI

# Database
pnpm db:validate-schema    # Validate database schema
pnpm db:validate-migrations # Validate migrations
pnpm regenerate-types     # Regenerate Supabase types

# Smoke Tests
pnpm smoke            # Run smoke tests

# CI Checks
pnpm ci               # Run all CI checks (lint, typecheck, format, test, build)
```

---

## Project Structure

```
aias-platform/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── api/                # API routes
├── components/             # React components
├── lib/                    # Utilities and business logic
│   ├── env.ts             # Environment variable management
│   ├── supabase/          # Supabase client
│   └── ...
├── supabase/              # Supabase configuration
│   ├── migrations/        # Database migrations
│   └── functions/        # Edge functions
├── scripts/               # Utility scripts
├── tests/                 # Test files
├── .github/workflows/     # CI/CD workflows
└── docs/                  # Documentation
```

---

## Database Setup

### Using Supabase (Recommended)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for project to be ready (~2 minutes)

2. **Get Credentials:**
   - Go to Settings → API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
   - Go to Settings → General
   - Copy Project Reference → `SUPABASE_PROJECT_REF`

3. **Apply Migrations:**
   ```bash
   # Link Supabase project
   pnpm run supa:link
   
   # Apply migrations (if using Supabase CLI locally)
   pnpm run supa:migrate:apply
   ```
   
   **Or:** Migrations are applied automatically in CI/CD

### Using Local PostgreSQL (Advanced)

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu
   sudo apt-get install postgresql
   ```

2. **Create Database:**
   ```bash
   createdb aias_platform
   ```

3. **Set DATABASE_URL:**
   ```bash
   DATABASE_URL=postgresql://localhost:5432/aias_platform
   ```

4. **Apply Migrations:**
   ```bash
   # Manually apply migrations from supabase/migrations/
   psql aias_platform < supabase/migrations/000000000800_upsert_functions.sql
   # ... apply all migrations
   ```

---

## Common Tasks

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests (requires dev server running)
pnpm dev &  # In one terminal
pnpm test:e2e  # In another terminal
```

### Type Checking

```bash
# Check types
pnpm typecheck

# Watch mode (if supported)
pnpm typecheck --watch
```

### Linting

```bash
# Check linting
pnpm lint

# Fix issues
pnpm lint:fix
```

### Formatting

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check
```

---

## Troubleshooting

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Dependencies Installation Fails

**Error:** `pnpm install` fails

**Solution:**
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install
```

### Environment Variables Not Loading

**Error:** `Missing required environment variable`

**Solution:**
1. Check `.env.local` exists
2. Verify variable names match exactly (case-sensitive)
3. Restart development server
4. Check `lib/env.ts` for expected variable names

### Database Connection Fails

**Error:** `Database connection failed`

**Solution:**
1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is active
3. Verify `DATABASE_URL` is correctly formatted
4. Check network connectivity

### Type Errors

**Error:** TypeScript errors

**Solution:**
```bash
# Regenerate Supabase types
pnpm regenerate-types

# Clear TypeScript cache
rm -rf .next

# Restart TypeScript server (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")
```

---

## IDE Setup

### VS Code

**Recommended Extensions:**
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prisma (if using Prisma)

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Git Workflow

### Branch Naming

- `main` - Production branch
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `fix/bug-name` - Bug fix branches

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add AI agent marketplace
fix: resolve authentication issue
docs: update local development guide
chore: update dependencies
```

### Pre-commit Hooks

**Husky** is configured to run:
- ESLint on staged files
- Prettier on staged files

**To skip hooks:**
```bash
git commit --no-verify
```

---

## Debugging

### Debug in VS Code

**`.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Debug API Routes

Add `debugger` statement in API route:
```typescript
export async function GET() {
  debugger; // VS Code will break here
  // ...
}
```

---

## Performance

### Development Performance

- **Fast Refresh:** Enabled by default
- **TypeScript:** Incremental compilation
- **ESLint:** Only runs on changed files (with Husky)

### Build Performance

- **Incremental Builds:** `.next` cache
- **Parallel Jobs:** CI runs jobs in parallel
- **Caching:** pnpm cache, Node cache

---

## Next Steps

1. **Read Documentation:**
   - [Stack Discovery](./stack-discovery.md)
   - [Backend Strategy](./backend-strategy.md)
   - [CI/CD Overview](./ci-overview.md)

2. **Explore Codebase:**
   - Start with `app/page.tsx` (homepage)
   - Check `components/` for reusable components
   - Review `lib/` for utilities

3. **Make Changes:**
   - Create feature branch
   - Make changes
   - Run tests and linting
   - Submit PR

---

## Getting Help

- **Documentation:** Check `docs/` directory
- **Issues:** [GitHub Issues](https://github.com/your-org/aias-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/aias-platform/discussions)

---

## Conclusion

**Setup Time:** ~10 minutes  
**Development Server:** `http://localhost:3000`  
**Package Manager:** pnpm 8.15.0  
**Node Version:** 20.x LTS  

**Happy Coding! 🚀**
