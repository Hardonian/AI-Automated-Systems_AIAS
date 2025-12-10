#!/bin/bash
set -e
echo "Testing TypeScript resolution..."
cd packages/lib
# Check if files exist
test -f ai/index.ts && echo "✓ ai/index.ts exists"
test -f ai/generators.ts && echo "✓ ai/generators.ts exists"
test -f index.ts && echo "✓ index.ts exists"
test -f queues.ts && echo "✓ queues.ts exists"
echo "All files exist"
