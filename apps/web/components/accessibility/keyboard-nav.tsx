"use client";

import { useEffect } from "react";

/**
 * Keyboard Navigation Enhancement
 * Improves keyboard navigation experience for accessibility
 */
export function KeyboardNavEnhancement() {
  useEffect(() => {
    // Skip to main content on Tab key press
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content with 'M' key
      if (e.key === "m" || e.key === "M") {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const main = document.getElementById("main");
          if (main) {
            main.focus();
            main.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }

      // Close modals/dialogs with Escape key
      if (e.key === "Escape") {
        const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
        openDialogs.forEach((dialog) => {
          const closeButton = dialog.querySelector('[aria-label*="close" i], [aria-label*="Close" i]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
