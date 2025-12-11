# Build Process Documentation

## Overview

This document describes the build process for the AIAS platform, including validation steps, error handling, and troubleshooting.

## Build Scripts

### Main Build Commands

- `pnpm run build` - Standard Next.js build
- `pnpm run vercel-build` - Vercel-optimized build with Prisma setup
- `pnpm run build:safe` - Enhanced build with comprehensive validation
- `pnpm run build:validate` - Validate build setup without building
- `pnpm run build:verify` - Verify build artifacts after build

### Pre-Build Validation

Before building, the system runs several validation checks:

1. **Package Manager Check** - Verifies pnpm is installed and correct version
2. **Lockfile Sync** - Ensures `pnpm-lock.yaml` matches `package.json`
3. **Workspace Dependencies** - Validates workspace protocol dependencies
4. **Required Files** - Checks for essential configuration files
5. **TypeScript Config** - Validates all TypeScript configurations

### Build Steps

The `vercel-build` script executes in this order:

1. **Pre-build Checks** (`build:pre-check`)
   - Validates environment and dependencies
   - Checks lockfile sync

2. **Workspace Package Build** (`build:packages`)
   - Builds `packages/config`
   - Builds `packages/lib`
   - Fails fast if any package fails

3. **Build Diagnostics** (`build:diagnostic`)
   - Non-blocking diagnostic checks
   - Provides build insights

4. **Prisma Setup**
   - Generates Prisma Client
   - Runs migrations (if DATABASE_URL is set)
   - Handles missing database gracefully

5. **Next.js Build**
   - Full production build
   - Type checking enabled
   - Optimized for Vercel deployment

## Vercel Configuration

### Install Command

```json
"installCommand": "pnpm install --frozen-lockfile"
```

- Uses `--frozen-lockfile` to ensure reproducible builds
- Fails if lockfile is out of sync (prevents inconsistent builds)

### Build Command

```json
"buildCommand": "pnpm run vercel-build"
```

- Runs comprehensive build process
- Includes all validation steps
- Handles Prisma setup automatically

### Environment Variables

Required for full build:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (optional)
- `UPSTASH_POSTGRES_URL` - Alternative database URL (optional)

Build will succeed without database, but migrations will be skipped.

## Troubleshooting

### Lockfile Out of Sync

**Error**: `ERR_PNPM_OUTDATED_LOCKFILE`

**Solution**:
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

### Workspace Dependency Errors

**Error**: `Unsupported URL Type "workspace:"`

**Solution**: Ensure you're using pnpm, not npm:
```bash
# Check package manager
cat package.json | grep packageManager

# Use corepack to ensure correct version
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

### Build Failures

1. **Run validation**:
   ```bash
   pnpm run build:validate
   ```

2. **Check pre-build checks**:
   ```bash
   pnpm run build:pre-check
   ```

3. **Use safe build**:
   ```bash
   pnpm run build:safe
   ```

### Type Errors

TypeScript errors will fail the build. To check types locally:

```bash
pnpm run type-check
```

## Best Practices

1. **Always commit lockfile** - `pnpm-lock.yaml` should be committed
2. **Use frozen lockfile in CI** - Prevents drift
3. **Run validation before committing** - Catch issues early
4. **Keep workspace dependencies in sync** - Use `workspace:*` protocol
5. **Test builds locally** - Use `pnpm run build:safe` before pushing

## Build Optimization

- Memory limit: `--max-old-space-size=4096` (4GB)
- Type checking: Enabled (fail on errors)
- ESLint: Warnings allowed, errors fail build
- Source maps: Disabled in production
- Image optimization: Enabled with AVIF/WebP

## CI/CD Integration

The build process is designed to work seamlessly in CI/CD:

- All validation steps are automated
- Clear error messages for debugging
- Non-blocking diagnostics
- Graceful handling of missing dependencies

## Related Files

- `vercel.json` - Vercel deployment configuration
- `.npmrc` - pnpm configuration
- `pnpm-workspace.yaml` - Workspace definition
- `scripts/validate-build-setup.ts` - Build validation
- `scripts/pre-build-check.sh` - Pre-build checks
- `scripts/verify-build.ts` - Post-build verification
