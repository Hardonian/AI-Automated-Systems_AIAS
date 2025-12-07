# Dead Code Removal Plan

## Overview

Based on knip analysis, ~100+ files are identified as unused. This document outlines a safe removal strategy.

## Safe to Remove (Legacy React Router Code)

The `src/` directory contains legacy React Router code that's been replaced by Next.js App Router equivalents.

### Pages (src/pages/ → app/)
- `src/pages/Admin.tsx` - Replaced by `app/admin/`
- `src/pages/Auth.tsx` - Replaced by Next.js auth
- `src/pages/CaseStudies.tsx` - Replaced by `app/case-studies/`
- `src/pages/Index.tsx` - Replaced by `app/page.tsx`
- `src/pages/NotFound.tsx` - Replaced by `app/error.tsx`
- `src/pages/Platform.tsx` - Replaced by `app/platform/`
- `src/pages/Services.tsx` - Replaced by `app/services/`
- `src/pages/ROICalculator.tsx` - Check if used
- `src/pages/Health.tsx` - Replaced by `app/api/healthz`
- `src/pages/GuardianOnboarding.tsx` - Check if used
- `src/pages/TrustDashboard.tsx` - Check if used

### Components (src/components/ → components/)
Most components in `src/components/` have Next.js equivalents in `components/`:
- `src/components/ui/*` - Duplicates of `components/ui/*`
- `src/components/platform/*` - Check if used in Next.js app
- `src/components/billing/*` - Check if used
- `src/components/audit/*` - Check if used

### App Entry
- `src/App.tsx` - Not used in Next.js (entry is `app/layout.tsx`)
- `src/App.css` - Check if styles are migrated
- `src/index.css` - Check if styles are migrated

## Needs Review

### Files with Imports
These files are imported somewhere and need manual review:
- `src/lib/errors.ts` - Imported by `lib/errors.ts` (re-export)
- `src/lib/monitoring.ts` - Imported by `guardian/middleware.ts`
- `src/integrations/supabase/types.ts` - May be used
- `src/types/platform.ts` - May be used

### Supabase Functions
All Supabase functions in `supabase/functions/` need manual review - they may be called but not detected by knip.

## Removal Strategy

### Phase 1: Safe Removals (Immediate)
1. Remove unused React Router pages
2. Remove duplicate UI components in `src/components/ui/`
3. Remove `src/App.tsx` and related entry files

### Phase 2: Review & Migrate (Next Sprint)
1. Review `src/lib/` files - migrate or remove
2. Review `src/components/` - migrate useful components to `components/`
3. Review `src/integrations/` - migrate or remove

### Phase 3: Cleanup (Final)
1. Remove entire `src/` directory if empty
2. Update imports that reference `src/`
3. Remove `react-router-dom` dependency if unused

## Execution

Run the removal script:
```bash
tsx scripts/remove-dead-code.ts
```

Or manually remove files listed in "Safe to Remove" section.

## Estimated Impact

- **Files Removed:** ~80-100 files
- **Bundle Size Reduction:** ~15-20%
- **Maintenance Burden:** Reduced significantly
- **Risk:** Low (files are unused)

## Rollback Plan

All removals are git-tracked. If issues arise:
```bash
git checkout HEAD -- src/
```
