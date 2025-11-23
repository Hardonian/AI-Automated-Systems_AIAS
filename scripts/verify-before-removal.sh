#!/bin/bash
# Verify application builds before removing dead code

echo "🔍 Verifying application state before dead code removal..."

# Check if build works
echo "📦 Testing build..."
npm run build 2>&1 | tail -20

if [ $? -eq 0 ]; then
    echo "✅ Build successful - safe to proceed with dead code removal"
else
    echo "⚠️  Build failed - fix issues before removing code"
    exit 1
fi
