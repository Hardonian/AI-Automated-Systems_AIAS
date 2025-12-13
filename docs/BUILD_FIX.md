# Build Fix: Lockfile Sync Issue

**Issue:** Build failing with `ERR_PNPM_OUTDATED_LOCKFILE`  
**Cause:** Added `@vercel/og` dependency but lockfile wasn't committed  
**Status:** ✅ Fixed locally, needs commit

## Solution

The `pnpm-lock.yaml` file has been updated locally to include `@vercel/og@0.6.8`. 

### Required Action

**Commit the updated lockfile:**

```bash
git add pnpm-lock.yaml
git commit -m "chore: update lockfile with @vercel/og dependency"
git push
```

### Verification

After committing, verify the build works:

```bash
# Local verification
pnpm install --frozen-lockfile

# Should complete without errors
```

### Alternative (Temporary)

If you need to deploy immediately without committing the lockfile, you can temporarily modify `vercel.json`:

```json
{
  "installCommand": "pnpm install --no-frozen-lockfile"
}
```

**⚠️ Warning:** This is not recommended for production. Always commit the lockfile for reproducible builds.

## Root Cause

When `@vercel/og` was added to `package.json` for OG image generation, the `pnpm-lock.yaml` file needed to be updated. The lockfile has been updated locally but needs to be committed to the repository.

## Prevention

Always run `pnpm install` after modifying `package.json` and commit both files together:

```bash
# After modifying package.json
pnpm install
git add package.json pnpm-lock.yaml
git commit -m "chore: add dependency"
```
