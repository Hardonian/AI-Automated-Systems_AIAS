#!/bin/bash
# Batch replace console.log/error/warn with structured logger
# Run: bash scripts/batch-replace-console.sh

set -e

echo "Replacing console statements with structured logger..."

# Find all TypeScript/TSX files
find app components lib -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  # Skip if already has logger import
  if grep -q "from \"@/lib/logging/structured-logger\"" "$file"; then
    continue
  fi

  # Check if file has console statements
  if grep -q "console\.\(log\|error\|warn\|info\|debug\)" "$file"; then
    echo "Processing: $file"
    
    # Add logger import (after last import statement)
    sed -i '/^import .* from .*;$/a\
import { logger } from "@/lib/logging/structured-logger";' "$file"
    
    # Note: Actual replacement would require more sophisticated sed/awk
    # For now, this script identifies files that need manual review
    echo "  -> Added logger import, manual replacement needed for console statements"
  fi
done

echo "Done. Review files and replace console statements manually or use a more sophisticated tool."
