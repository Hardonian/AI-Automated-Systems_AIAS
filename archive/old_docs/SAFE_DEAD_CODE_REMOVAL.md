# Safe Dead Code Removal Guide

## ⚠️ Important Notes

Some files in `src/` are **still imported** and should NOT be removed:
- `src/lib/errors.ts` - Imported by `lib/errors.ts`
- `src/lib/monitoring.ts` - Imported by `guardian/middleware.ts`

These files will be preserved.

---

## ✅ Safe to Remove (No Imports Found)

### 1. Legacy React Router Pages

These have Next.js equivalents in `app/`:

```bash
# Remove legacy pages
rm -rf src/pages/
```

**Files removed:**
- `src/pages/Admin.tsx`
- `src/pages/Auth.tsx`
- `src/pages/CaseStudies.tsx`
- `src/pages/Index.tsx`
- `src/pages/NotFound.tsx`
- `src/pages/Platform.tsx`
- `src/pages/Services.tsx`
- `src/pages/ROICalculator.tsx`
- `src/pages/Health.tsx`
- `src/pages/GuardianOnboarding.tsx`
- `src/pages/TrustDashboard.tsx`

### 2. Duplicate UI Components

All files in `src/components/ui/` are duplicates of `components/ui/`:

```bash
# Remove duplicate UI components
rm -rf src/components/ui/
```

**Files removed:** ~40 duplicate UI component files

### 3. Unused Entry Files

```bash
# Remove unused entry files (after verifying styles migrated)
rm src/App.tsx src/App.css src/index.css
```

**Note:** Verify that styles from `src/App.css` and `src/index.css` are migrated to `app/globals.css` before removing.

### 4. Other Safe Removals

```bash
# Remove unused hooks (duplicates exist)
rm src/hooks/use-mobile.tsx
rm src/hooks/use-toast.ts

# Remove unused components (check if Next.js equivalents exist)
rm src/components/AutomationNetworkMap.tsx
rm src/components/ErrorBoundary.tsx  # We have components/error-boundary/ErrorBoundary.tsx
rm src/components/SecurityShowcase.tsx
```

---

## ❌ DO NOT Remove (Still Imported)

- `src/lib/errors.ts` - Imported by `lib/errors.ts`
- `src/lib/monitoring.ts` - Imported by `guardian/middleware.ts`
- `src/lib/analytics.ts` - May be used
- `src/lib/billing.ts` - May be used
- `src/lib/flags.ts` - May be used
- `src/lib/i18n.ts` - May be used
- `src/lib/rate-limiter.ts` - May be used
- `src/lib/security-headers.ts` - May be used
- `src/lib/security.ts` - May be used
- `src/lib/seo.ts` - May be used
- `src/lib/utils.ts` - May be used
- `src/lib/validation.ts` - May be used
- `src/integrations/supabase/types.ts` - May be used
- `src/types/platform.ts` - May be used

**Action:** Review these files individually before removing.

---

## 🚀 Execution Steps

### Step 1: Verify Build Works

```bash
npm run build
```

If build fails, fix issues first.

### Step 2: Remove Safe Files

```bash
# Remove legacy pages
rm -rf src/pages/

# Remove duplicate UI components
rm -rf src/components/ui/

# Remove unused hooks
rm src/hooks/use-mobile.tsx src/hooks/use-toast.ts

# Remove unused components (verify first)
rm src/components/AutomationNetworkMap.tsx
rm src/components/ErrorBoundary.tsx
rm src/components/SecurityShowcase.tsx

# Remove entry files (after verifying styles migrated)
rm src/App.tsx src/App.css src/index.css
```

### Step 3: Verify Build Still Works

```bash
npm run build
npm run dev
```

### Step 4: Test Application

- Navigate through pages
- Check UI components render correctly
- Verify no broken imports

---

## 📊 Estimated Impact

**Files Removed:** ~55-60 files
- Pages: ~11 files
- UI components: ~40 files
- Hooks: 2 files
- Components: 3 files
- Entry files: 3 files

**Bundle Size Reduction:** ~10-15% (conservative estimate)

**Risk:** Low (files confirmed unused, no imports found)

---

## 🔄 Rollback Plan

If issues arise:

```bash
# Restore removed files
git checkout HEAD -- src/pages/
git checkout HEAD -- src/components/ui/
git checkout HEAD -- src/hooks/
git checkout HEAD -- src/components/AutomationNetworkMap.tsx
git checkout HEAD -- src/components/ErrorBoundary.tsx
git checkout HEAD -- src/components/SecurityShowcase.tsx
git checkout HEAD -- src/App.tsx src/App.css src/index.css
```

---

## ✅ Completion Checklist

- [ ] Verify build works before removal
- [ ] Remove `src/pages/`
- [ ] Remove `src/components/ui/`
- [ ] Remove unused hooks
- [ ] Remove unused components
- [ ] Remove entry files (after style migration check)
- [ ] Verify build works after removal
- [ ] Test application functionality
- [ ] Commit changes

---

**Status:** Ready for execution
**Estimated Time:** 10-15 minutes
**Risk Level:** Low
