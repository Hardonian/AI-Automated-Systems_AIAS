#!/bin/bash
# Simple mock for docs-tidy.sh
if [ "$1" == "--plan" ]; then
  echo "Dry run plan: No changes needed."
else
  echo "Tidying docs..."
fi
