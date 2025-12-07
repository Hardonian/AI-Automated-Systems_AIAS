#!/bin/bash
# Remove duplicate logger imports

find app components -name "*.tsx" -o -name "*.ts" | while read file; do
  # Count logger imports
  count=$(grep -c "^import.*logger.*from.*structured-logger" "$file" 2>/dev/null || echo "0")
  
  if [ "$count" -gt 1 ]; then
    echo "Fixing duplicates in: $file"
    # Keep only first import, remove rest
    awk '/^import.*logger.*from.*structured-logger/ {if (!seen++) print; next} 1' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
done

echo "Done removing duplicate imports"
