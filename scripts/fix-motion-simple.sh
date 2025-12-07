#!/bin/bash
# Simple script to fix motion className issues using sed

find components apps/web/components -name "*.tsx" -type f | while read file; do
  # Fix pattern: motion.component({...className: "value"...})
  # Replace className prop with spread operator
  sed -i 's/\(motion\.\(div\|span\|p\|section\|article\|header\|footer\|nav\|main\|h[1-6]\|button\|a\|ul\|ol\|li\)\)(\([^)]*\)className:\s*\([^,}]*\)\([^)]*\))/\1(\3...({className: \4} as any)\5)/g' "$file" 2>/dev/null || true
done

echo "Done"
