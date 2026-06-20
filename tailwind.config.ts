import type { Config } from 'tailwindcss';

/**
 * AIAS Tailwind Configuration - Canonical Token System
 *
 * All colors, spacing, and visual values reference CSS custom properties
 * defined in app/globals.css. This ensures:
 *
 * 1. Single source of truth for visual values
 * 2. Easy theme customization via CSS variables
 * 3. Consistent component styling across the application
 * 4. Type-safe Tailwind intellisense support
 *
 * To extend: Add semantic color variants here, new base colors in globals.css
 */

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      /* ========================================
         COLORS - All reference CSS variables
         ======================================== */
      colors: {
        // Core semantic colors
        background: 'hsl(var(--bg))',
        foreground: 'hsl(var(--text))',

        // Surface hierarchy
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          muted: 'hsl(var(--surface-muted))',
        },

        // Text hierarchy
        text: {
          DEFAULT: 'hsl(var(--text))',
          muted: 'hsl(var(--text-muted))',
          inverse: 'hsl(var(--text-inverse))',
        },

        // Primary brand
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          subtle: 'hsl(var(--primary-subtle))',
        },

        // Secondary/Accent
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Muted/disabled states
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Cards and popovers
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Feedback colors
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },

        // UI elements
        border: 'hsl(var(--border))',
        'border-subtle': 'hsl(var(--border-subtle))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Data visualization
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
          6: 'hsl(var(--chart-6))',
        },
      },

      /* ========================================
         BORDER RADIUS - Referencing CSS vars
         ======================================== */
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        DEFAULT: 'var(--radius)',
      },

      /* ========================================
         BOX SHADOWS - Referencing CSS vars
         ======================================== */
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-card)',
        focus: 'var(--shadow-focus)',
      },

      /* ========================================
         TYPOGRAPHY
         ======================================== */
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'display-xl': [
          '4rem',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' },
        ],
        'display-lg': [
          '3rem',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' },
        ],
        'display-md': [
          '2.25rem',
          { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        'display-sm': [
          '1.875rem',
          { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
      },

      /* ========================================
         ANIMATION
         ======================================== */
      keyframes: {
        'in-fade': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'in-slide-up': {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'in-scale': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'hero-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        'hero-glow-delayed': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1) translate(0, 0)' },
          '50%': { opacity: '0.6', transform: 'scale(1.15) translate(10px, -10px)' },
        },
      },

      animation: {
        'in-fade': 'in-fade 160ms ease-out both',
        'in-slide-up': 'in-slide-up 220ms ease-out both',
        'in-scale': 'in-scale 200ms ease-out both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hero-glow': 'hero-glow 8s ease-in-out infinite',
        'hero-glow-delayed': 'hero-glow-delayed 10s ease-in-out infinite 2s',
      },

      /* ========================================
         SPACING
         ======================================== */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      /* ========================================
         TRANSITIONS
         ======================================== */
      transitionDuration: {
        '400': '400ms',
      },

      /* ========================================
         Z-INDEX SCALE
         ======================================== */
      zIndex: {
        behind: '-1',
        dropdown: '100',
        sticky: '200',
        fixed: '300',
        overlay: '400',
        modal: '500',
        popover: '600',
        toast: '700',
      },
    },
  },

  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
} satisfies Config;
