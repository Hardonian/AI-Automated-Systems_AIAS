/**
 * AIAS Design System - Consistent spacing, typography, and layout tokens
 * Use these constants across all homepage sections for visual consistency
 */

// Container widths - use these for consistent content width
export const CONTAINER_WIDTHS = {
  narrow: 'max-w-4xl', // For text-heavy sections (testimonials, FAQ)
  default: 'max-w-6xl', // For most sections (hero, features)
  wide: 'max-w-7xl', // For data-heavy sections (stats, trust badges)
  full: 'max-w-none', // For full-width visual sections
} as const;

// Section padding - consistent vertical spacing
export const SECTION_PADDING = {
  small: 'py-12 md:py-16', // Compact sections
  default: 'py-16 md:py-20 lg:py-24', // Standard sections
  large: 'py-20 md:py-24 lg:py-32', // Hero sections
  extraLarge: 'py-24 md:py-32 lg:py-40', // Major hero sections
} as const;

// Typography scale - consistent font sizes
export const TYPOGRAPHY = {
  // Headings
  h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1]',
  h2: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]',
  h3: 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.2]',
  h4: 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-[1.25]',

  // Body text
  bodyLarge: 'text-lg sm:text-xl md:text-2xl leading-relaxed',
  body: 'text-base sm:text-lg leading-relaxed',
  bodySmall: 'text-sm sm:text-base leading-relaxed',

  // Special
  eyebrow: 'text-sm sm:text-base font-semibold uppercase tracking-wider',
  badge: 'text-xs sm:text-sm font-bold',
  stat: 'text-3xl sm:text-4xl md:text-5xl font-extrabold',
} as const;

// Gradient backgrounds for sections
export const SECTION_BACKGROUNDS = {
  default: '', // No background
  gradient: 'bg-gradient-to-b from-transparent via-primary/5 to-transparent',
  gradientReverse:
    'bg-gradient-to-b from-primary/5 via-transparent to-primary/5',
  muted: 'bg-muted/30',
  card: 'bg-card',
} as const;

// Grid gaps - consistent spacing
export const GRID_GAPS = {
  small: 'gap-4 md:gap-6',
  default: 'gap-6 md:gap-8',
  large: 'gap-8 md:gap-12',
} as const;

// Animation defaults
export const ANIMATION = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  },
  stagger: {
    staggerChildren: 0.1,
  },
} as const;

// Common section wrapper class - USE THIS for all sections
export const getSectionClasses = (
  padding: keyof typeof SECTION_PADDING = 'default',
  background: keyof typeof SECTION_BACKGROUNDS = 'default',
  extraClasses?: string
) => {
  return `${SECTION_PADDING[padding]} ${SECTION_BACKGROUNDS[background]} ${extraClasses || ''}`.trim();
};

// Common container class - USE THIS for all content containers
export const getContainerClasses = (
  width: keyof typeof CONTAINER_WIDTHS = 'default',
  extraClasses?: string
) => {
  return `w-full ${CONTAINER_WIDTHS[width]} mx-auto px-4 sm:px-6 lg:px-8 ${extraClasses || ''}`.trim();
};
