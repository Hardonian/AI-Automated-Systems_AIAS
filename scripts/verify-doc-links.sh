#!/bin/bash
# Verify all documentation links work
# Run: bash scripts/verify-doc-links.sh

set -e

echo "Verifying documentation links..."

ERRORS=0

# Find all markdown files
find docs -type f -name "*.md" | while read file; do
  echo "Checking: $file"
  
  # Extract markdown links [text](path)
  grep -o '\[.*\]([^)]*)' "$file" | sed 's/.*(\(.*\))/\1/' | while read link; do
    # Skip external links
    if [[ "$link" == http* ]]; then
      continue
    fi
    
    # Skip anchor links
    if [[ "$link" == \#* ]]; then
      continue
    fi
    
    # Resolve relative path
    dir=$(dirname "$file")
    target="$dir/$link"
    
    # Check if file exists
    if [ ! -f "$target" ] && [ ! -d "$target" ]; then
      echo "  ERROR: Broken link: $link (in $file)"
      ERRORS=$((ERRORS + 1))
    fi
  done
done

if [ $ERRORS -eq 0 ]; then
  echo "All links verified successfully!"
else
  echo "Found $ERRORS broken links."
  exit 1
fi
