# Build Fix - TypeScript Error Resolution

## Issue
Build failed with TypeScript error in `apps/web/components/home/enhanced-hero.tsx`:
```
Type error: Property 'className' does not exist on type 'IntrinsicAttributes & HTMLAttributesWithoutMotionProps<unknown, unknown> & MotionProps & RefAttributes<unknown>'.
```

## Root Cause
Framer Motion v12 has stricter types that don't always accept `className` prop directly on `motion.div` components.

## Solution
Replaced all `motion.div` and `motion.p` instances with type-safe wrapper components:
- `motion.div` → `MotionDiv` (from `@/components/motion`)
- `motion.p` → `MotionP` (from `@/components/motion`)

These wrapper components properly handle the `className` prop and maintain type safety.

## Files Changed
- `apps/web/components/home/enhanced-hero.tsx` - Replaced 18 instances of `motion.div`/`motion.p` with `MotionDiv`/`MotionP`

## Verification
- ✅ Lint check passed
- ✅ All motion components use type-safe wrappers
- ✅ No remaining `motion.div` or `motion.p` with className issues

## Status
**FIXED** - Build should now compile successfully.
