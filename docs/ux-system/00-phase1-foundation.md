# Phase 1: Foundation - Motion & State Machine System

## Overview

Phase 1 establishes the foundational systems for interactive UX: motion tokens, primitives, and state machine conventions. These systems provide the building blocks for all future interaction work.

## Motion System

### Location
- **Tokens & Variants**: `lib/style/motion.ts`
- **Primitives**: `components/motion/`
- **Index**: `components/motion/index.ts`

### Motion Tokens

**Durations** (`motionDurations`):
- `instant`: 0ms
- `fast`: 100ms
- `quick`: 150ms
- `standard`: 200ms
- `moderate`: 250ms
- `slow`: 300ms
- `slower`: 400ms
- `slowest`: 500ms

**Easing** (`motionEasing`):
- `standard`: Standard easing
- `enter`: Smooth entrance (ease-out)
- `exit`: Smooth exit (ease-in)
- `sharp`: Sharp entrance
- `bounce`: Bounce for attention
- `elastic`: Elastic for playful interactions

**Springs** (`motionSprings`):
- `gentle`: Subtle interactions (stiffness: 200, damping: 20)
- `standard`: Most interactions (stiffness: 300, damping: 25)
- `bouncy`: Attention-grabbing (stiffness: 400, damping: 15)
- `snappy`: Quick feedback (stiffness: 500, damping: 30)
- `smooth`: Page transitions (stiffness: 200, damping: 30)

### Motion Variants

Available variants (`motionVariants`):
- `fadeIn`: Simple fade
- `fadeInUp`: Fade with upward motion
- `fadeInDown`: Fade with downward motion
- `scaleIn`: Scale entrance
- `slideInLeft`: Slide from left
- `slideInRight`: Slide from right
- `attention`: Attention pulse (for notifications)
- `success`: Success celebration
- `error`: Error shake
- `stepTransition`: Step-by-step transitions
- `pageTransition`: Page/route transitions

### Motion Primitives

**AnimatedButton** (`components/motion/animated-button.tsx`):
- Hover and active scale animations
- Respects `prefers-reduced-motion`
- Variants: `standard`, `subtle`, `bouncy`

**AnimatedCard** (`components/motion/animated-card.tsx`):
- Entrance animations
- Hover lift effect
- Stagger delay support

**Reveal** (`components/motion/reveal.tsx`):
- Wrapper for entrance animations
- Configurable delay and variant
- Immediate mode for skipping animation

**PageTransition** (`components/motion/page-transition.tsx`):
- Smooth page/route transitions
- Forward/backward direction support
- AnimatePresence integration

**StepTransition** (`components/motion/step-transition.tsx`):
- Step-by-step flow transitions
- Forward/backward direction support
- AnimatePresence integration

### Accessibility

All motion components:
- Check `prefers-reduced-motion` automatically
- Disable animations when reduced motion is preferred
- Maintain functionality without motion

## State Machine System

### Location
- **Conventions**: `lib/xstate/conventions.ts`
- **Utilities**: `lib/xstate/utils.ts`
- **Hooks**: `lib/xstate/hooks.ts`
- **Demo Machine**: `lib/xstate/demo-machine.ts`
- **Index**: `lib/xstate/index.ts`

### Conventions

**Async States** (`AsyncState`):
- `idle`: Initial state
- `pending`: Operation in progress
- `success`: Operation completed successfully
- `error`: Operation failed

**Standard Context Shapes**:
- `AsyncContext<TData, TError>`: For async operations
- `StepFlowContext`: For multi-step flows
- `MachineError`: Standardized error shape

**Standard Events**:
- `AsyncEvents<TInput>`: Submit, retry, reset, cancel
- `StepFlowEvents`: Next, previous, go to step, reset, complete

### Utilities

**Guards**:
- `createValidationGuard`: Form/input validation
- `createFieldGuard`: Single field validation
- `createRetryGuard`: Retry limit checking
- `createStepGuard`: Step validity checking
- `createStepCompletionGuard`: Step completion validation

**Helpers**:
- `createMachineError`: Convert exceptions to MachineError
- `delay`: Promise-based delay
- `retry`: Retry utility with exponential backoff

### Hooks

**useTypedMachine**: Type-safe machine hook
**useMachineSelector**: Select specific values from state
**useIsInState**: Check if machine is in specific state
**useCurrentState**: Get current state value
**useMachineContext**: Get machine context
**useIsPending**: Check if machine is pending
**useHasError**: Check if machine has error
**useMachineError**: Get error from context

### Demo Machine

**Location**: `lib/xstate/demo-machine.ts`

**Purpose**: Reference implementation demonstrating:
- Form validation
- Async operations
- Error handling
- Retry logic
- State transitions

**States**:
- `idle`: Ready for input
- `validating`: Validating form
- `invalid`: Validation failed
- `submitting`: Submitting form
- `success`: Submission successful
- `error`: Submission failed

## Playground

### Location
`app/playground/page.tsx`

### Purpose
Internal verification route demonstrating:
- Motion primitives in action
- State machine integration
- Success and error handling
- Accessibility (reduced motion)

### Sections
1. **Motion Primitives**: Animated cards, buttons, reveals, transitions
2. **State Machine Demo**: Interactive form with state machine

## Usage Examples

### Motion Primitives

```tsx
import { AnimatedButton, AnimatedCard, Reveal } from "@/components/motion";

// Animated button
<AnimatedButton animationVariant="bouncy" onClick={handleClick}>
  Click me
</AnimatedButton>

// Animated card with stagger
<AnimatedCard variant="fadeInUp" staggerDelay={0.1}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
</AnimatedCard>

// Reveal with delay
<Reveal variant="fadeInUp" delay={0.2}>
  <div>Content</div>
</Reveal>
```

### State Machines

```tsx
import { useMachine } from "@xstate/react";
import { demoFormMachine } from "@/lib/xstate/demo-machine";

function MyComponent() {
  const [state, send] = useMachine(demoFormMachine);
  
  const isPending = state.matches("submitting");
  const isSuccess = state.matches("success");
  
  return (
    <form onSubmit={() => send({ type: "SUBMIT" })}>
      {/* form fields */}
    </form>
  );
}
```

## Next Steps

Phase 1 provides the foundation. Next phases will:
- Audit existing interactions (Phase 2)
- Refactor core flows (Phase 3)
- Add feedback components (Phase 4)
- Apply system-wide (Phase 5)
- Harden error handling (Phase 6)
- Instrument events (Phase 7)
