#!/bin/bash
# Complete console.log replacement script
# This script replaces all console statements with structured logger

set -e

echo "Replacing console statements with structured logger..."

# List of files with console statements
FILES=(
  "app/dashboard/revenue/page.tsx"
  "app/dashboard/dashboard-client.tsx"
  "app/dashboard/analytics/page.tsx"
  "app/dashboard/analytics/funnel/page.tsx"
  "app/api/audit/me/route.ts"
  "app/api/billing/subscription-status/route.ts"
  "app/api/auth/admin/check/route.ts"
  "app/api/cost/alerts/route.ts"
  "app/api/cost/metrics/route.ts"
  "app/api/cost/thresholds/route.ts"
  "app/api/monetization/affiliate/click/route.ts"
  "app/api/content/ai/seo/route.ts"
  "app/api/content/ai/generate/route.ts"
  "app/api/content/auth/route.ts"
  "app/api/content/aias/route.ts"
  "app/api/content/settler/route.ts"
  "app/api/content/upload/route.ts"
  "app/api/analytics/track/route.ts"
  "app/api/ingest/route.ts"
  "app/api/telemetry/ingest/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Replace console.error with logger.error
    sed -i 's/console\.error("\([^"]*\)", \(error\|err\))/logger.error("\1", \2 instanceof Error ? \2 : new Error(String(\2)), { component: "'"$(basename "$file" .tsx | sed 's/\.ts$//')"'", action: "unknown" })/g' "$file"
    
    # Replace console.error with just message
    sed -i 's/console\.error("\([^"]*\)")/logger.error("\1", undefined, { component: "'"$(basename "$file" .tsx | sed 's/\.ts$//')"'", action: "unknown" })/g' "$file"
    
    # Replace console.warn
    sed -i 's/console\.warn("\([^"]*\)", \(.*\))/logger.warn("\1", { component: "'"$(basename "$file" .tsx | sed 's/\.ts$//')"'", ...\2 })/g' "$file"
    sed -i 's/console\.warn("\([^"]*\)")/logger.warn("\1", { component: "'"$(basename "$file" .tsx | sed 's/\.ts$//')"'", action: "unknown" })/g' "$file"
    
    # Replace .catch(console.error)
    sed -i 's/\.catch(console\.error)/.catch((err) => logger.error("Unhandled error", err instanceof Error ? err : new Error(String(err)), { component: "'"$(basename "$file" .tsx | sed 's/\.ts$//')"'", action: "unknown" }))/g' "$file"
  fi
done

echo "Done! Review files for any manual adjustments needed."
