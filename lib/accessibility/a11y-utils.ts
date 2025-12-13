/**
 * Accessibility Utilities
 * Helper functions for accessibility improvements
 */

/**
 * Generate accessible ID from text
 */
export function generateA11yId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get ARIA label for icon-only buttons
 */
export function getIconButtonLabel(action: string, context?: string): string {
  if (context) {
    return `${action} ${context}`;
  }
  return action;
}

/**
 * Format number for screen readers
 */
export function formatForScreenReader(value: number | string): string {
  if (typeof value === "number") {
    return value.toLocaleString("en-US");
  }
  return value;
}

/**
 * Get live region announcement
 */
export function createLiveRegion(level: "polite" | "assertive" = "polite"): {
  announce: (message: string) => void;
  cleanup: () => void;
} {
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", level);
  region.setAttribute("aria-atomic", "true");
  region.className = "sr-only";
  document.body.appendChild(region);

  return {
    announce: (message: string) => {
      region.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        region.textContent = "";
      }, 1000);
    },
    cleanup: () => {
      document.body.removeChild(region);
    },
  };
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    element.getAttribute("aria-hidden") !== "true"
  );
}

/**
 * Get accessible color contrast ratio
 * Returns ratio between 1 and 21
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  // Simplified contrast calculation
  // In production, use a library like `color-contrast`
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 1;

  const luminance1 = getLuminance(fg);
  const luminance2 = getLuminance(bg);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    return null;
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const rLum = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLum = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLum = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
} as const;

/**
 * Handle keyboard navigation for custom components
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  options: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
  }
): void {
  switch (event.key) {
    case KeyboardKeys.Enter:
    case KeyboardKeys.Space:
      event.preventDefault();
      options.onEnter?.();
      break;
    case KeyboardKeys.Escape:
      options.onEscape?.();
      break;
    case KeyboardKeys.ArrowUp:
      event.preventDefault();
      options.onArrowUp?.();
      break;
    case KeyboardKeys.ArrowDown:
      event.preventDefault();
      options.onArrowDown?.();
      break;
    case KeyboardKeys.ArrowLeft:
      event.preventDefault();
      options.onArrowLeft?.();
      break;
    case KeyboardKeys.ArrowRight:
      event.preventDefault();
      options.onArrowRight?.();
      break;
    case KeyboardKeys.Home:
      event.preventDefault();
      options.onHome?.();
      break;
    case KeyboardKeys.End:
      event.preventDefault();
      options.onEnd?.();
      break;
  }
}
