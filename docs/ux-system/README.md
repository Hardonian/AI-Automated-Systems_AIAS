# Interactive UX System Foundation

## Overview

This directory contains documentation and implementation of the production-grade interactive UX system built on Framer Motion and XState.

## Status

### ✅ Phase 1: Foundation (COMPLETE)
- **Motion System**: Enhanced tokens, variants, springs, and primitives
- **State Machine System**: XState conventions, utilities, hooks, and demo machine
- **Playground**: Internal verification route at `/playground`

### ✅ Phase 2: Interaction Inventory & UX Spec (COMPLETE)
- **Audit**: Comprehensive audit of all interaction surfaces
- **UX Spec**: Complete interaction specification document

### ✅ Phase 3: State-Driven Core Flows (COMPLETE)
- **Onboarding Machine**: Full XState machine for onboarding flow
- **Refactored Wizard**: New component using state machine and motion

### ⏳ Phase 4-7: Pending
- Phase 4: Gamified feedback components
- Phase 5: System-wide polish
- Phase 6: Hardening and error handling
- Phase 7: Measurement and instrumentation

## Files Created

### Motion System
- `lib/style/motion.ts` - Enhanced with springs and new variants
- `components/motion/animated-button.tsx` - Animated button primitive
- `components/motion/animated-card.tsx` - Animated card primitive
- `components/motion/reveal.tsx` - Reveal wrapper component
- `components/motion/page-transition.tsx` - Page transition wrapper
- `components/motion/step-transition.tsx` - Step transition wrapper
- `components/motion/index.ts` - Centralized exports

### State Machine System
- `lib/xstate/conventions.ts` - XState conventions and types
- `lib/xstate/utils.ts` - Utility functions (guards, retry, etc.)
- `lib/xstate/hooks.ts` - React hooks for state machines
- `lib/xstate/demo-machine.ts` - Reference state machine
- `lib/xstate/onboarding-machine.ts` - Onboarding flow machine
- `lib/xstate/index.ts` - Centralized exports

### Components
- `components/onboarding/OnboardingWizardRefactored.tsx` - Refactored wizard using XState

### Routes
- `app/playground/page.tsx` - Internal playground for verification

### Documentation
- `docs/ux-system/00-phase1-foundation.md` - Phase 1 documentation
- `docs/ux-system/01-ux-interaction-spec.md` - UX Interaction Specification
- `docs/ux-system/README.md` - This file

## Usage

### Motion Primitives

```tsx
import { AnimatedButton, AnimatedCard, Reveal, StepTransition } from "@/components/motion";

// Animated button
<AnimatedButton animationVariant="bouncy" onClick={handleClick}>
  Click me
</AnimatedButton>

// Animated card
<AnimatedCard variant="fadeInUp" staggerDelay={0.1}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
</AnimatedCard>

// Reveal with delay
<Reveal variant="fadeInUp" delay={0.2}>
  <div>Content</div>
</Reveal>

// Step transition
<StepTransition step={currentStep}>
  <div>Step content</div>
</StepTransition>
```

### State Machines

```tsx
import { useMachine } from "@xstate/react";
import { onboardingMachine } from "@/lib/xstate/onboarding-machine";

function MyComponent() {
  const [state, send] = useMachine(onboardingMachine);
  
  const isPending = state.matches("connectingIntegration") || 
                    state.matches("creatingWorkflowAsync");
  const hasError = state.matches("error");
  
  return (
    <div>
      {state.matches("welcome") && <WelcomeStep />}
      {state.matches("choosingIntegration") && <IntegrationStep />}
      {/* ... */}
    </div>
  );
}
```

## Next Steps

1. **Integrate Refactored Wizard**: Replace `OnboardingWizard` with `OnboardingWizardRefactored` or create migration path
2. **Phase 4**: Create feedback components (progress, success, error, achievements)
3. **Phase 5**: Apply system across app with restraint
4. **Phase 6**: Harden error handling and retry logic
5. **Phase 7**: Instrument UX events for measurement

## Testing

Visit `/playground` to see the system in action:
- Motion primitives demonstration
- State machine demo with form
- Success and error handling

## Principles

1. **Motion reflects state**: Animation always represents real state changes
2. **Calm and intentional**: No animation spam
3. **Accessibility-first**: Respects `prefers-reduced-motion`
4. **State-driven**: XState machines govern all multi-step flows
5. **Performance-focused**: Uses transforms/opacity, no layout thrash

## Dependencies

- `framer-motion`: ^12.23.24
- `xstate`: ^5.25.0
- `@xstate/react`: ^6.0.0
