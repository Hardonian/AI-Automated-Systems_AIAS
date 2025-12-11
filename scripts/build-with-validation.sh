#!/bin/bash
set -euo pipefail

# Enhanced build script with comprehensive validation
# This script ensures builds are reliable and failures are caught early

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

# Step 1: Pre-build validation
log_info "Step 1/5: Running pre-build checks..."
if ! pnpm run build:pre-check; then
  log_error "Pre-build checks failed"
  exit 1
fi

# Step 2: Build workspace packages
log_info "Step 2/5: Building workspace packages..."
if ! pnpm run build:packages; then
  log_error "Workspace package build failed"
  exit 1
fi

# Step 3: Run diagnostics (non-blocking)
log_info "Step 3/5: Running build diagnostics..."
pnpm run build:diagnostic || log_warn "Diagnostics completed with warnings"

# Step 4: Prisma setup
log_info "Step 4/5: Setting up Prisma..."
cd apps/web

export DATABASE_URL="${UPSTASH_POSTGRES_URL:-${DATABASE_URL:-}}"
export DIRECT_URL="${UPSTASH_POSTGRES_DIRECT_URL:-${DIRECT_URL:-${DATABASE_URL:-}}}"

if [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" =~ ^postgres ]]; then
  log_info "Generating Prisma Client and running migrations..."
  NODE_OPTIONS='--max-old-space-size=4096' pnpm exec prisma generate
  pnpm exec prisma migrate deploy || log_warn "Migrations skipped or failed"
else
  log_warn "DATABASE_URL not set or invalid, skipping migrations"
  NODE_OPTIONS='--max-old-space-size=4096' pnpm exec prisma generate || log_warn "Prisma generate skipped"
fi

cd ../..

# Step 5: Build Next.js application
log_info "Step 5/5: Building Next.js application..."
NODE_OPTIONS='--max-old-space-size=4096' pnpm exec next build

# Post-build verification
log_info "Verifying build artifacts..."
if pnpm exec tsx scripts/verify-build.ts; then
  log_info "✅ Build completed successfully!"
else
  log_error "Build verification failed"
  exit 1
fi

exit 0
