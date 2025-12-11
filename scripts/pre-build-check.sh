#!/bin/bash
set -euo pipefail

# Pre-build validation script
# Ensures all prerequisites are met before starting the build

echo "🔍 Running pre-build checks..."

# Check pnpm is available
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed or not in PATH"
  exit 1
fi

# Check pnpm version matches package.json
REQUIRED_PNPM=$(node -p "require('./package.json').packageManager?.replace('pnpm@', '') || '8.0.0'")
CURRENT_PNPM=$(pnpm --version)
if [ "$CURRENT_PNPM" != "$REQUIRED_PNPM" ]; then
  echo "⚠️  pnpm version mismatch: required $REQUIRED_PNPM, found $CURRENT_PNPM"
  echo "   Consider using: corepack enable && corepack prepare pnpm@$REQUIRED_PNPM --activate"
fi

# Check lockfile exists
if [ ! -f "pnpm-lock.yaml" ]; then
  echo "❌ pnpm-lock.yaml not found"
  exit 1
fi

# Check lockfile is not empty
if [ ! -s "pnpm-lock.yaml" ]; then
  echo "❌ pnpm-lock.yaml is empty"
  exit 1
fi

# Verify lockfile exists and is not empty
echo "📦 Verifying lockfile..."
if [ ! -s "pnpm-lock.yaml" ]; then
  echo "❌ pnpm-lock.yaml is missing or empty"
  exit 1
fi

# Check workspace packages exist
if [ ! -d "packages/config" ] || [ ! -d "packages/lib" ]; then
  echo "❌ Required workspace packages not found"
  exit 1
fi

# Check required files exist
REQUIRED_FILES=("package.json" "pnpm-workspace.yaml" ".npmrc" "next.config.mjs" "tsconfig.json")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Required file not found: $file"
  fi
done

echo "✅ Pre-build checks passed!"
exit 0
