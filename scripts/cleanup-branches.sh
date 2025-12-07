#!/bin/bash
# Clean up merged git branches
# Run: bash scripts/cleanup-branches.sh

set -e

echo "Cleaning up merged branches..."

# Fetch latest from remote
git fetch --prune

# Get list of merged branches (excluding main/master)
MERGED_BRANCHES=$(git branch -r --merged main | grep -v "main\|HEAD\|master" | sed 's/origin\///')

if [ -z "$MERGED_BRANCHES" ]; then
  echo "No merged branches found."
  exit 0
fi

echo "Found merged branches:"
echo "$MERGED_BRANCHES"
echo ""
read -p "Delete these branches? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "$MERGED_BRANCHES" | while read branch; do
    if [ -n "$branch" ]; then
      echo "Deleting: $branch"
      git push origin --delete "$branch" || echo "  -> Failed to delete $branch (may not exist)"
    fi
  done
  echo "Done."
else
  echo "Cancelled."
fi
