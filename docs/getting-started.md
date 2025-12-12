# Getting Started

This guide will help you get the AIAS Platform running locally and start developing.

## Prerequisites

- **Node.js**: 20.18.0+ or 22.0.0+ ([Download](https://nodejs.org/))
- **pnpm**: 8.15.0+ (Install: `npm install -g pnpm`)
- **Git**: [Download](https://git-scm.com/)

Optional:
- **Docker**: For local development
- **VS Code**: Recommended editor

## Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/shardie-github/aias.git
cd aias
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This installs all required dependencies. If you encounter issues:

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### Step 3: Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure at minimum:

```bash
# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration (required)
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database

# Application Configuration (required)
NEXTAUTH_SECRET=generate-a-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See [`.env.local.example`](../.env.local.example) for all available options.

### Step 4: Set Up Database

#### Option A: Supabase (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Wait for provisioning (~2 minutes)
3. Get credentials from Settings → API
4. Set `DATABASE_URL` and `DIRECT_URL` in `.env.local`
5. Migrations run automatically in CI/CD, or manually:

```bash
pnpm supa:link
pnpm supa:migrate:apply
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb aias_platform

# Set DATABASE_URL in .env.local
DATABASE_URL=postgresql://localhost:5432/aias_platform

# Apply migrations manually
# See supabase/migrations/ directory
```

### Step 5: Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verify Setup

1. **Check homepage**: Navigate to `http://localhost:3000`
2. **Test API**: `http://localhost:3000/api/healthz` should return `{"ok": true}`
3. **Check console**: No critical errors

## Common Tasks

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:coverage     # Run with coverage
pnpm test:e2e          # Run E2E tests
```

### Type Checking

```bash
pnpm typecheck
```

### Linting and Formatting

```bash
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues
pnpm format            # Format code
pnpm format:check      # Check formatting
```

### Database Operations

```bash
pnpm db:push           # Push schema changes
pnpm db:migrate        # Run migrations
pnpm db:seed           # Seed database
pnpm db:studio         # Open Prisma Studio
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Environment Variables Not Loading

1. Ensure `.env.local` exists (not `.env`)
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

## Next Steps

- Read [Architecture Guide](architecture/ARCHITECTURE.md)
- Explore [API Documentation](api/overview.md)
- Review [Contributing Guidelines](../CONTRIBUTING.md)
- Check [Operations Documentation](operations/)

## Getting Help

- **Documentation**: Check the [docs](/) folder
- **Issues**: [GitHub Issues](https://github.com/shardie-github/aias/issues)
- **Email**: support@aiautomatedsystems.ca

---

**Welcome to AIAS Platform! 🚀**
