/**
 * Focus Visible Styles
 * Ensures keyboard navigation is visible
 */

"use client";

import { useEffect } from "react";

export function FocusVisibleStyles() {
  useEffect(() => {
    // Add focus-visible polyfill if needed
    // Modern browsers support :focus-visible natively
    const style = document.createElement("style");
    style.textContent = `
      /* Ensure focus is visible for keyboard navigation */
      *:focus-visible {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }
      
      /* Remove focus outline for mouse users */
      *:focus:not(:focus-visible) {
        outline: none;
      }
      
      /* Skip link styling */
      .skip-link {
        position: absolute;
        left: -9999px;
        z-index: 999;
      }
      
      .skip-link:focus {
        left: 1rem;
        top: 1rem;
        padding: 0.5rem 1rem;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        border-radius: 0.375rem;
        text-decoration: none;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
