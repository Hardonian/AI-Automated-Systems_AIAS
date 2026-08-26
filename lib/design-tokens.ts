/**
 * AIAS Design System - Consistent spacing, typography, and layout tokens.
 */

export const CONTAINER_WIDTHS = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-none",
} as const;

export const SECTION_PADDING = {
  small: "py-12 md:py-16",
  default: "py-16 md:py-20 lg:py-24",
  large: "py-20 md:py-24 lg:py-32",
  extraLarge: "py-24 md:py-32 lg:py-40",
} as const;

export const SPACING_SCALE = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
} as const;

export const TYPOGRAPHY = {
  h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1]",
  h2: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]",
  h3: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.2]",
  h4: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-[1.25]",
  bodyLarge: "text-lg sm:text-xl md:text-2xl leading-relaxed",
  body: "text-base sm:text-lg leading-relaxed",
  bodySmall: "text-sm sm:text-base leading-relaxed",
  eyebrow: "text-sm sm:text-base font-semibold uppercase tracking-wider",
  badge: "text-xs sm:text-sm font-bold",
  stat: "text-3xl sm:text-4xl md:text-5xl font-extrabold",
} as const;

export const BORDER_RADIUS = {
  card: "rounded-2xl",
  pill: "rounded-full",
  soft: "rounded-xl",
} as const;

export const CARD_SHADOWS = {
  card: "shadow-sm",
  elevated: "shadow-lg",
  glow: "shadow-[0_0_35px_rgba(59,130,246,0.18)]",
} as const;

export const SECTION_BACKGROUNDS = {
  default: "",
  gradient: "bg-gradient-to-b from-transparent via-primary/5 to-transparent",
  gradientReverse:
    "bg-gradient-to-b from-primary/5 via-transparent to-primary/5",
  muted: "bg-muted/30",
  card: "bg-card",
} as const;

export const GRID_GAPS = {
  small: "gap-4 md:gap-6",
  default: "gap-6 md:gap-8",
  large: "gap-8 md:gap-12",
} as const;

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

export const getSectionClasses = (
  padding: keyof typeof SECTION_PADDING = "default",
  background: keyof typeof SECTION_BACKGROUNDS = "default",
  extraClasses?: string,
) =>
  `${SECTION_PADDING[padding]} ${SECTION_BACKGROUNDS[background]} ${extraClasses || ""}`.trim();

export const getContainerClasses = (
  width: keyof typeof CONTAINER_WIDTHS = "default",
  extraClasses?: string,
) =>
  `w-full ${CONTAINER_WIDTHS[width]} mx-auto px-4 sm:px-6 lg:px-8 ${extraClasses || ""}`.trim();
