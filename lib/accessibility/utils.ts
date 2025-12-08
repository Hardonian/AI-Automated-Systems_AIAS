/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliance helpers
 */

/**
 * Calculate contrast ratio between two colors
 * Returns ratio from 1 (no contrast) to 21 (maximum contrast)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color (0-1)
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const r = (rgb.r / 255);
  const g = (rgb.g / 255);
  const b = (rgb.b / 255);
  const rLum = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLum = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLum = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3] ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * Returns true if ratio >= 4.5 for normal text or >= 3 for large text
 */
export function meetsWCAGAA(foreground: string, background: string, largeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 * Returns true if ratio >= 7 for normal text or >= 4.5 for large text
 */
export function meetsWCAGAAA(foreground: string, background: string, largeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Generate accessible color variants
 */
export function generateAccessibleColors(baseColor: string, _backgroundColor: string): {
  accessible: string;
  highContrast: string;
} {
  // This is a simplified version - in production, use a color library
  return {
    accessible: baseColor, // Would adjust based on contrast
    highContrast: '#000000', // Would calculate optimal high contrast color
  };
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check aria-label or aria-labelledby exists for interactive elements
  if (element.hasAttribute('aria-label') && element.hasAttribute('aria-labelledby')) {
    errors.push('Cannot have both aria-label and aria-labelledby');
  }
  
  // Check aria-describedby references exist
  const describedBy = element.getAttribute('aria-describedby');
  if (describedBy) {
    const ids = describedBy.split(' ');
    ids.forEach(id => {
      if (!document.getElementById(id)) {
        errors.push(`aria-describedby references non-existent id: ${id}`);
      }
    });
  }
  
  // Check aria-labelledby references exist
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(' ');
    ids.forEach(id => {
      if (!document.getElementById(id)) {
        errors.push(`aria-labelledby references non-existent id: ${id}`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate skip link HTML
 */
export function generateSkipLink(targetId: string, label = 'Skip to main content'): string {
  return `<a href="#${targetId}" class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-fg focus:rounded">${label}</a>`;
}

/**
 * Ensure focus trap for modals
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTab);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTab);
  };
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
