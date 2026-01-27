/**
 * Motion & Transition System
 * 
 * Standardized motion constants and utilities for consistent animations
 * across the AI Automated Systems platform.
 * 
 * All animations respect prefers-reduced-motion for accessibility.
 */

// Duration constants (in milliseconds)
export const motionDurations = {
  instant: 0,
  fast: 100,
  quick: 150,
  standard: 200,
  moderate: 250,
  slow: 300,
  slower: 400,
  slowest: 500,
} as const;

// Easing curves (CSS cubic-bezier values)
export const motionEasing = {
  // Standard easing
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Smooth entrance (ease-out)
  enter: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Smooth exit (ease-in)
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  // Sharp entrance
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  // Bounce for attention
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // Elastic for playful interactions
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

// Spring configurations for Framer Motion
export const motionSprings = {
  // Gentle spring for subtle interactions
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
    mass: 1,
  },
  // Standard spring for most interactions
  standard: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 1,
  },
  // Bouncy spring for attention-grabbing elements
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
    mass: 1,
  },
  // Snappy spring for quick feedback
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  },
  // Smooth spring for page transitions
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 30,
    mass: 1,
  },
} as const;

// Framer Motion transition presets
export const motionTransitions = {
  // Micro-interactions (hover, focus)
  micro: {
    duration: motionDurations.fast / 1000,
    ease: motionEasing.standard as any,
  },
  // Standard transitions (buttons, cards)
  standard: {
    duration: motionDurations.standard / 1000,
    ease: motionEasing.standard as any,
  },
  // Page transitions
  page: {
    duration: motionDurations.slow / 1000,
    ease: motionEasing.enter as any,
  },
  // Entrance animations
  entrance: {
    duration: motionDurations.moderate / 1000,
    ease: motionEasing.enter as any,
  },
  // Exit animations
  exit: {
    duration: motionDurations.standard / 1000,
    ease: motionEasing.exit as any,
  },
} as const;

// Scale values for interactions
export const motionScale = {
  hover: 1.02,
  hoverLarge: 1.05,
  active: 0.95,
  activeLarge: 0.98,
} as const;

// Translate values for lift effects
export const motionTranslate = {
  lift: -2,
  liftLarge: -4,
  liftXLarge: -8,
} as const;

// Opacity values
export const motionOpacity = {
  hidden: 0,
  visible: 1,
  disabled: 0.5,
  subtle: 0.6,
  muted: 0.8,
} as const;

// Common animation variants for Framer Motion
export const motionVariants = {
  // Fade in
  fadeIn: {
    hidden: { opacity: motionOpacity.hidden },
    visible: { 
      opacity: motionOpacity.visible,
      transition: motionTransitions.entrance,
    },
  },
  // Fade in up
  fadeInUp: {
    hidden: { 
      opacity: motionOpacity.hidden,
      y: 20,
    },
    visible: { 
      opacity: motionOpacity.visible,
      y: 0,
      transition: motionTransitions.entrance,
    },
  },
  // Fade in down
  fadeInDown: {
    hidden: { 
      opacity: motionOpacity.hidden,
      y: -20,
    },
    visible: { 
      opacity: motionOpacity.visible,
      y: 0,
      transition: motionTransitions.entrance,
    },
  },
  // Scale in
  scaleIn: {
    hidden: { 
      opacity: motionOpacity.hidden,
      scale: 0.95,
    },
    visible: { 
      opacity: motionOpacity.visible,
      scale: 1,
      transition: motionTransitions.entrance,
    },
  },
  // Slide in from left
  slideInLeft: {
    hidden: { 
      opacity: motionOpacity.hidden,
      x: -20,
    },
    visible: { 
      opacity: motionOpacity.visible,
      x: 0,
      transition: motionTransitions.entrance,
    },
  },
  // Slide in from right
  slideInRight: {
    hidden: { 
      opacity: motionOpacity.hidden,
      x: 20,
    },
    visible: { 
      opacity: motionOpacity.visible,
      x: 0,
      transition: motionTransitions.entrance,
    },
  },
  // Attention pulse (for notifications, errors, highlights)
  attention: {
    hidden: { 
      opacity: motionOpacity.hidden,
      scale: 0.9,
    },
    visible: { 
      opacity: motionOpacity.visible,
      scale: 1,
      transition: {
        ...motionSprings.bouncy,
        duration: motionDurations.moderate / 1000,
      },
    },
    pulse: {
      scale: [1, 1.05, 1] as [number, number, number],
      transition: {
        duration: motionDurations.slow / 1000,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: motionEasing.standard as any,
      },
    },
  },
  // Success celebration (for completions, achievements)
  success: {
    hidden: { 
      opacity: motionOpacity.hidden,
      scale: 0.8,
      y: 10,
    },
    visible: { 
      opacity: motionOpacity.visible,
      scale: 1,
      y: 0,
      transition: {
        ...motionSprings.bouncy,
        duration: motionDurations.moderate / 1000,
      },
    },
    celebrate: {
      scale: [1, 1.1, 1] as [number, number, number],
      rotate: [0, 5, -5, 0] as [number, number, number, number],
      transition: {
        duration: motionDurations.slow / 1000,
        ease: motionEasing.bounce as any,
      },
    },
  },
  // Error shake (for validation errors, failures)
  error: {
    hidden: { 
      opacity: motionOpacity.hidden,
      x: 0,
    },
    visible: { 
      opacity: motionOpacity.visible,
      x: 0,
      transition: motionTransitions.entrance,
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0] as [number, number, number, number, number, number],
      transition: {
        duration: motionDurations.moderate / 1000,
        ease: motionEasing.sharp as any,
      },
    },
  },
  // Slide transition for step changes
  stepTransition: {
    enter: {
      opacity: motionOpacity.visible,
      x: 0,
      transition: motionTransitions.entrance,
    },
    exit: {
      opacity: motionOpacity.hidden,
      x: -20,
      transition: motionTransitions.exit,
    },
  },
  // Page transition
  pageTransition: {
    initial: {
      opacity: motionOpacity.hidden,
      y: 20,
    },
    animate: {
      opacity: motionOpacity.visible,
      y: 0,
      transition: motionTransitions.page,
    },
    exit: {
      opacity: motionOpacity.hidden,
      y: -20,
      transition: motionTransitions.exit,
    },
  },
} as const;

// Stagger children animation
export const staggerChildren = {
  hidden: { opacity: motionOpacity.hidden },
  visible: {
    opacity: motionOpacity.visible,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
} as const;

// Stagger configurations
export const staggerConfigs = {
  // Fast stagger for quick lists
  fast: {
    staggerChildren: 0.05,
    delayChildren: 0.02,
  },
  // Standard stagger
  standard: {
    staggerChildren: 0.1,
    delayChildren: 0.05,
  },
  // Slow stagger for dramatic reveals
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.1,
  },
} as const;

/**
 * Check if user prefers reduced motion
 * Use this to conditionally disable animations
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {return false;}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get transition config respecting reduced motion preference
 */
export const getTransition = (
  duration: number = motionDurations.standard,
  ease: string = motionEasing.standard
) => {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      ease: 'linear',
    };
  }
  return {
    duration: duration / 1000,
    ease,
  };
};

/**
 * CSS transition string for Tailwind/vanilla CSS
 */
export const cssTransition = (
  properties: string[] = ['all'],
  duration: number = motionDurations.standard,
  easing: string = motionEasing.standard
): string => {
  const durationMs = `${duration}ms`;
  return properties
    .map((prop) => `${prop} ${durationMs} ${easing}`)
    .join(', ');
};

/**
 * Common CSS transition classes
 */
export const transitionClasses = {
  // Standard transitions
  all: cssTransition(['all'], motionDurations.standard),
  colors: cssTransition(['color', 'background-color', 'border-color'], motionDurations.standard),
  opacity: cssTransition(['opacity'], motionDurations.quick),
  transform: cssTransition(['transform'], motionDurations.standard),
  shadow: cssTransition(['box-shadow'], motionDurations.standard),
  
  // Fast transitions
  fast: cssTransition(['all'], motionDurations.fast),
  
  // Slow transitions
  slow: cssTransition(['all'], motionDurations.slow),
} as const;

// Export types
export type MotionDuration = typeof motionDurations[keyof typeof motionDurations];
export type MotionEasing = typeof motionEasing[keyof typeof motionEasing];
export type MotionSpring = typeof motionSprings[keyof typeof motionSprings];
export type MotionVariant = keyof typeof motionVariants;
