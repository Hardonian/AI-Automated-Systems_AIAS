# UX Interaction Specification

## Purpose

This document defines how interactions should work across the application, ensuring consistency, accessibility, and intentional motion. Every interaction surface should follow these guidelines.

## Motion Rules

### When Motion is Allowed

Motion is **allowed** for:
1. **State transitions**: When UI state changes (step changes, form submission, page navigation)
2. **Feedback**: Success, error, loading states
3. **Progressive disclosure**: Revealing content (modals, dropdowns, accordions)
4. **Micro-interactions**: Button hovers, card lifts, focus states
5. **List animations**: Staggered reveals for lists, grids

### When Motion is Forbidden

Motion is **forbidden** for:
1. **Decorative purposes**: Motion that doesn't reflect state
2. **Constant animation**: Infinite loops (except loading spinners)
3. **Layout shifts**: Motion that causes content reflow
4. **Performance-critical areas**: High-frequency updates (scrolling, typing)
5. **Accessibility conflicts**: When `prefers-reduced-motion` is set

### Motion Principles

1. **Motion reflects state**: Animation should always represent a real state change
2. **Calm and intentional**: No animation spam; every motion has purpose
3. **Performance-first**: No layout thrash, use transforms/opacity
4. **Accessibility-respecting**: Always check `prefers-reduced-motion`

## Interaction Surfaces

### 1. Navigation

**Location**: `components/layout/header.tsx`, `components/layout/mobile-nav.tsx`

**Current State**:
- Basic navigation without motion
- Mobile menu toggle

**Target State**:
- Smooth page transitions using `PageTransition`
- Mobile menu slide-in animation
- Active state indicators with subtle pulse

**Motion**:
- Page transitions: `pageTransition` variant (200ms)
- Menu open/close: `slideInLeft` variant (250ms)
- Active link: Subtle underline animation

**Accessibility**:
- Keyboard navigation preserved
- Focus indicators visible
- ARIA labels for menu states

### 2. Forms and Inputs

**Location**: `components/ui/form.tsx`, various form components

**Current State**:
- Basic form inputs
- No validation feedback animation
- No loading states

**Target State**:
- Input focus animations (subtle scale)
- Validation error shake animation
- Success checkmark animation
- Loading spinner during submission

**Motion**:
- Input focus: `scaleIn` variant (150ms)
- Error: `error.shake` variant (250ms)
- Success: `success.celebrate` variant (300ms)
- Loading: Spinner rotation (continuous, but respects reduced motion)

**Accessibility**:
- ARIA invalid states
- Error messages in live regions
- Focus management on errors

### 3. Onboarding / Setup Wizards

**Location**: 
- `components/onboarding/OnboardingWizard.tsx`
- `components/integrations/setup-wizard.tsx`
- `src/components/platform/TenantOnboarding.tsx`

**Current State**:
- Uses `useState` for step management
- No step transition animations
- Basic progress indicator

**Target State**:
- XState machine for flow control
- `StepTransition` for step changes
- Progress indicator with animation
- Success celebration on completion

**Motion**:
- Step transitions: `stepTransition` variant (200ms)
- Progress bar: Smooth fill animation
- Step indicators: Scale animation on completion
- Success: `success.celebrate` variant

**States** (XState):
- `idle`: Initial state
- `validating`: Validating current step
- `invalid`: Step validation failed
- `transitioning`: Moving between steps
- `submitting`: Submitting step data
- `success`: Step completed
- `error`: Step failed

**Accessibility**:
- Step announcements (ARIA live regions)
- Keyboard navigation (Tab, Enter, Arrow keys)
- Focus management on step change
- Progress announced to screen readers

### 4. Dashboards

**Location**: `app/dashboard/`, `components/dashboard/`

**Current State**:
- Static cards
- No loading states
- No empty states animation

**Target State**:
- Card entrance animations (staggered)
- Loading skeleton animations
- Empty state fade-in
- Data update animations

**Motion**:
- Card entrance: `fadeInUp` with stagger (100ms delay)
- Loading: Skeleton pulse (respects reduced motion)
- Empty state: `fadeInUp` variant (250ms)
- Data updates: Subtle scale pulse (150ms)

**Accessibility**:
- Loading states announced
- Empty states have clear messaging
- Data updates don't disrupt focus

### 5. Lists and Cards

**Location**: Various list/card components

**Current State**:
- Static rendering
- No hover effects
- No loading states

**Target State**:
- Staggered list animations
- Card hover lift effect
- Loading placeholder animations
- Empty state animations

**Motion**:
- List items: `fadeInUp` with `staggerConfigs.standard`
- Card hover: Lift effect (`motionTranslate.lift`, 200ms)
- Loading: Skeleton shimmer (respects reduced motion)
- Empty: `fadeInUp` variant

**Accessibility**:
- List announcements
- Loading states announced
- Empty states have clear CTAs

### 6. Loading States

**Current State**:
- Basic spinners
- No skeleton screens
- No progress indicators

**Target State**:
- Skeleton screens for content
- Progress indicators for operations
- Loading spinners with reduced motion support

**Motion**:
- Skeleton: Pulse animation (respects reduced motion)
- Progress: Smooth fill animation
- Spinner: Rotation (disabled if reduced motion)

**Accessibility**:
- Loading announcements (ARIA live regions)
- Progress announced to screen readers
- Timeout warnings for long operations

### 7. Empty States

**Current State**:
- Static empty state messages
- No animations

**Target State**:
- Fade-in animation
- Subtle icon animation
- Clear CTAs

**Motion**:
- Container: `fadeInUp` variant (250ms)
- Icon: `scaleIn` variant (300ms, delay 100ms)
- CTA: `fadeInUp` variant (350ms, delay 200ms)

**Accessibility**:
- Clear messaging
- Focusable CTAs
- Screen reader announcements

### 8. Success States

**Current State**:
- Basic success messages
- No celebration

**Target State**:
- Success toast with animation
- Celebration for milestones
- Progress acknowledgment

**Motion**:
- Toast: `success` variant (300ms)
- Celebration: `success.celebrate` variant (400ms)
- Progress: Smooth fill animation

**Accessibility**:
- Success announcements (ARIA live regions)
- Non-intrusive celebrations
- Dismissible toasts

### 9. Error States

**Current State**:
- Basic error messages
- No retry feedback

**Target State**:
- Error shake animation
- Retry button with feedback
- Clear error messages

**Motion**:
- Error: `error.shake` variant (250ms)
- Retry button: Hover scale animation
- Error message: `fadeInUp` variant (200ms)

**Accessibility**:
- Error announcements (ARIA live regions)
- Focus on error message
- Retry button clearly labeled

### 10. Modals and Dialogs

**Location**: `components/ui/dialog.tsx` (if exists)

**Current State**:
- Basic modal rendering
- No entrance/exit animations

**Target State**:
- Smooth open/close animations
- Backdrop fade
- Content scale-in

**Motion**:
- Backdrop: Fade (150ms)
- Content: `scaleIn` variant (200ms)
- Exit: Reverse animation

**Accessibility**:
- Focus trap
- Escape key handling
- ARIA modal attributes
- Focus return on close

## Feedback Loops

### Progress Feedback

**When**: Multi-step flows, long operations, data loading

**Components**:
- Progress bar with smooth fill
- Step indicators with completion animation
- Percentage display

**Motion**:
- Progress fill: Smooth transition (200ms)
- Step completion: Scale animation (150ms)
- Percentage: Count-up animation (respects reduced motion)

### Success Feedback

**When**: Form submission, step completion, achievement unlock

**Components**:
- Success toast
- Checkmark animation
- Celebration (optional, tasteful)

**Motion**:
- Toast: `success` variant (300ms)
- Checkmark: Draw animation (400ms)
- Celebration: Subtle confetti (optional, respects reduced motion)

### Error Feedback

**When**: Validation errors, API failures, network errors

**Components**:
- Error message with shake
- Retry button
- Error details (expandable)

**Motion**:
- Error: `error.shake` variant (250ms)
- Retry button: Hover feedback
- Details: Smooth expand (200ms)

### Recovery Feedback

**When**: Retry operations, error recovery

**Components**:
- Retry button with loading state
- Progress indicator
- Success acknowledgment

**Motion**:
- Retry: Button scale on click (100ms)
- Loading: Spinner rotation
- Success: `success` variant (300ms)

## Accessibility Rules

### Focus Management

1. **Focus on state changes**: Move focus to new content on step/page changes
2. **Focus on errors**: Focus first error field on validation failure
3. **Focus trap**: Trap focus in modals/dialogs
4. **Focus return**: Return focus on modal/dialog close

### Keyboard Navigation

1. **Tab order**: Logical tab order throughout flows
2. **Arrow keys**: Navigate steps/lists with arrow keys
3. **Enter/Space**: Activate buttons, submit forms
4. **Escape**: Close modals, cancel operations

### Screen Reader Support

1. **ARIA live regions**: Announce state changes
2. **ARIA labels**: Label all interactive elements
3. **ARIA states**: Indicate loading, error, success states
4. **ARIA landmarks**: Use semantic HTML and landmarks

### Reduced Motion

1. **Always check**: Use `prefersReducedMotion()` utility
2. **Disable animations**: Set duration to 0.01ms when reduced motion
3. **Maintain functionality**: All interactions work without motion
4. **Respect preference**: Never override user preference

## Performance Rules

### No Layout Thrash

1. **Use transforms**: Use `transform` and `opacity` for animations
2. **Avoid layout properties**: Don't animate `width`, `height`, `top`, `left`
3. **Use `will-change`**: Hint browser for performance-critical animations
4. **Debounce rapid updates**: Debounce high-frequency state changes

### No Infinite Animations

1. **Loading spinners**: Only during actual loading
2. **No decorative loops**: No constant motion for decoration
3. **Respect reduced motion**: Disable loops when reduced motion

### Optimize Animations

1. **GPU acceleration**: Use transforms for GPU acceleration
2. **Batch updates**: Batch DOM updates
3. **Reduce complexity**: Simple animations perform better
4. **Test performance**: Monitor FPS, especially on low-end devices

## Measurement

### Events to Track

1. **Step viewed**: When user views a step in a flow
2. **Step completed**: When user completes a step
3. **Success**: When operation succeeds
4. **Failure**: When operation fails
5. **Retry**: When user retries after failure
6. **Time to complete**: Duration of flows
7. **Drop-off points**: Where users abandon flows

### Implementation

- Use existing `track()` function from `@/lib/telemetry/track`
- Log events locally in dev
- Stub for backend integration
- No PII, no secrets

## File Mapping

### Navigation
- `components/layout/header.tsx` → Add `PageTransition`
- `components/layout/mobile-nav.tsx` → Add slide animation

### Forms
- `components/ui/form.tsx` → Add validation animations
- Form components → Add error/success animations

### Onboarding
- `components/onboarding/OnboardingWizard.tsx` → Refactor to XState + `StepTransition`
- `components/integrations/setup-wizard.tsx` → Refactor to XState + `StepTransition`
- `src/components/platform/TenantOnboarding.tsx` → Refactor to XState + `StepTransition`

### Dashboards
- `app/dashboard/page.tsx` → Add card animations
- `components/dashboard/*.tsx` → Add loading/empty states

### Lists/Cards
- List components → Add stagger animations
- Card components → Add hover effects

### Loading/Empty/Success/Error
- Create reusable components in `components/feedback/`
- Integrate into flows

## Next Steps

1. **Phase 3**: Refactor onboarding wizard to XState
2. **Phase 4**: Create feedback components
3. **Phase 5**: Apply system across app
4. **Phase 6**: Harden error handling
5. **Phase 7**: Instrument events
