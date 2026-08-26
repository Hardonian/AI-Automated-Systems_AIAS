/**
 * Visual Test Utilities
 *
 * Provides helpers for deterministic, stable visual regression testing.
 * All utilities ensure consistent rendering across runs.
 */

import { Page, TestInfo, expect } from "@playwright/test";

/**
 * Injects CSS and JS to disable animations and ensure visual stability
 */
export async function disableAnimations(page: Page): Promise<void> {
  // Inject CSS to disable animations
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Disable all animations and transitions */
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        animation-delay: 0ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Disable CSS animations specifically */
      @keyframes fadeIn, fadeOut, slideIn, slideOut, scaleIn, scaleOut,
                 spin, pulse, bounce, shake, tada, wobble, jello,
                 heartBeat, bounceIn, bounceOut, flip, rotateIn, rotateOut,
                 hinge, jackInTheBox, rollIn, rollOut, zoomIn, zoomOut,
                 slideInUp, slideInDown, slideInLeft, slideInRight,
                 slideOutUp, slideOutDown, slideOutLeft, slideOutRight,
                 in-fade, in-slide-up, accordion-down, accordion-up,
                 gradient, shimmer, pulse-slow {
        from { opacity: 1; }
        to { opacity: 1; }
      }
      
      /* Hide elements that commonly cause flakiness */
      [data-testid="loading-spinner"],
      [data-testid="skeleton"],
      .skeleton,
      .loading-shimmer,
      [role="progressbar"]:not([aria-valuenow]),
      .animate-pulse,
      .animate-bounce,
      .animate-spin {
        opacity: 0 !important;
        visibility: hidden !important;
      }
      
      /* Freeze timers and clocks */
      .live-clock,
      .real-time,
      [data-live-time] {
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Disable JavaScript animations (framer-motion, GSAP, etc.)
  await page.addInitScript(() => {
    // Override requestAnimationFrame to freeze animations
    const originalRAF = window.requestAnimationFrame;
    let rafId = 0;
    const rafCallbacks = new Map<number, FrameRequestCallback>();

    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      const id = ++rafId;
      rafCallbacks.set(id, callback);
      // Execute immediately but don't loop
      setTimeout(() => {
        if (rafCallbacks.has(id)) {
          callback(performance.now());
          rafCallbacks.delete(id);
        }
      }, 0);
      return id;
    };

    window.cancelAnimationFrame = (id: number): void => {
      rafCallbacks.delete(id);
    };

    // Disable IntersectionObserver to prevent lazy-loading race conditions
    if (window.IntersectionObserver) {
      const OriginalIntersectionObserver = window.IntersectionObserver;
      window.IntersectionObserver = class extends OriginalIntersectionObserver {
        constructor(
          callback: IntersectionObserverCallback,
          options?: IntersectionObserverInit,
        ) {
          // Immediately trigger callback with all elements intersecting
          const wrappedCallback: IntersectionObserverCallback = (
            entries,
            observer,
          ) => {
            const modifiedEntries = entries.map((entry) => ({
              ...entry,
              isIntersecting: true,
              intersectionRatio: 1,
            }));
            callback(modifiedEntries, observer);
          };
          super(wrappedCallback, { ...options, threshold: 0 });
        }
      };
    }

    // Freeze Date for consistent timestamps
    const frozenDate = new Date("2024-06-15T12:00:00.000Z");
    const OriginalDate = window.Date;
    window.Date = class extends OriginalDate {
      constructor(...args: (string | number | Date)[]) {
        if (args.length === 0) {
          super(frozenDate);
        } else {
          super(...(args as [string | number | Date]));
        }
      }
      static now(): number {
        return frozenDate.getTime();
      }
    } as DateConstructor;
    Object.setPrototypeOf(window.Date, OriginalDate);
    Object.defineProperty(window.Date, "name", { value: "Date" });

    // Disable Math.random for deterministic renders
    let seed = 12345;
    window.Math.random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  });
}

/**
 * Masks dynamic content that changes between test runs
 */
export async function maskDynamicContent(page: Page): Promise<void> {
  const maskSelectors = [
    // Timestamps and dates
    "time",
    "[datetime]",
    ".timestamp",
    ".date",
    ".time",
    '[data-testid="timestamp"]',

    // User-generated content with randomness
    '.user-avatar[src*="gravatar"]',
    '.user-avatar[src*="random"]',

    // Analytics and counters
    ".view-count",
    ".live-users",
    ".real-time-stats",

    // Version numbers
    ".version",
    '[data-testid="version"]',

    // Dynamic IDs
    '[data-testid*="id-"]',
    '[data-testid*="uuid"]',
  ];

  for (const selector of maskSelectors) {
    const elements = page.locator(selector);
    const count = await elements.count();
    if (count > 0) {
      await elements.evaluateAll((els) => {
        els.forEach((el) => {
          el.style.cssText += `
            visibility: hidden !important;
            opacity: 0 !important;
            filter: blur(10px) !important;
          `;
        });
      });
    }
  }
}

/**
 * Waits for page to be fully stable before taking screenshots
 */
export async function waitForPageStability(
  page: Page,
  options: {
    networkIdle?: boolean;
    domStable?: boolean;
    imagesLoaded?: boolean;
    fontsLoaded?: boolean;
    timeout?: number;
  } = {},
): Promise<void> {
  const {
    networkIdle = true,
    domStable = true,
    imagesLoaded = true,
    fontsLoaded = true,
    timeout = 30000,
  } = options;

  // Wait for network idle
  if (networkIdle) {
    await page.waitForLoadState("networkidle", { timeout });
  }

  // Wait for DOM to be stable (no mutations for 500ms)
  if (domStable) {
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let timeoutId: NodeJS.Timeout;
        const observer = new MutationObserver(() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 500);
        });

        timeoutId = setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 500);

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
      });
    });
  }

  // Wait for images to load
  if (imagesLoaded) {
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll("img"));
      const pendingImages = images.filter((img) => !img.complete);

      if (pendingImages.length === 0) {
        return;
      }

      await Promise.all(
        pendingImages.map(
          (img) =>
            new Promise<void>((resolve) => {
              const timeout = setTimeout(() => {
                // Resolve anyway after timeout - image might be broken
                resolve();
              }, 5000);

              img.addEventListener(
                "load",
                () => {
                  clearTimeout(timeout);
                  resolve();
                },
                { once: true },
              );

              img.addEventListener(
                "error",
                () => {
                  clearTimeout(timeout);
                  resolve(); // Resolve on error too - broken images should still be captured
                },
                { once: true },
              );
            }),
        ),
      );
    });
  }

  // Wait for fonts to load
  if (fontsLoaded) {
    await page.evaluate(() => {
      if (document.fonts) {
        return document.fonts.ready;
      }
    });
  }
}

/**
 * Sets up page for visual testing with all stability measures
 */
export async function setupVisualTest(
  page: Page,
  testInfo: TestInfo,
  options: {
    viewport?: { width: number; height: number };
    darkMode?: boolean;
    reducedMotion?: boolean;
    locale?: string;
  } = {},
): Promise<void> {
  const {
    viewport,
    darkMode = false,
    reducedMotion = true,
    locale = "en-US",
  } = options;

  // Set viewport if provided
  if (viewport) {
    await page.setViewportSize(viewport);
  }

  // Set color scheme
  await page.emulateMedia({
    colorScheme: darkMode ? "dark" : "light",
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });

  // Disable animations
  await disableAnimations(page);

  // Set consistent timezone and locale
  await page.addInitScript((localeCode: string) => {
    // Override Intl for consistent formatting
    const OriginalIntl = window.Intl;
    window.Intl = {
      ...OriginalIntl,
      DateTimeFormat: class extends OriginalIntl.DateTimeFormat {
        constructor(
          locales?: string | string[],
          options?: Intl.DateTimeFormatOptions,
        ) {
          super(localeCode, options);
        }
      },
      NumberFormat: class extends OriginalIntl.NumberFormat {
        constructor(
          locales?: string | string[],
          options?: Intl.NumberFormatOptions,
        ) {
          super(localeCode, options);
        }
      },
    } as typeof Intl;
  }, locale);
}

/**
 * Gets the screenshot options for consistent visual testing
 */
export function getScreenshotOptions(
  options: {
    fullPage?: boolean;
    clip?: { x: number; y: number; width: number; height: number };
    mask?: string[];
    omitBackground?: boolean;
  } = {},
): object {
  return {
    fullPage: options.fullPage ?? true,
    animations: "disabled" as const,
    ...(options.clip && { clip: options.clip }),
    ...(options.mask && {
      mask: options.mask.map((selector) => ({ selector })),
    }),
    ...(options.omitBackground && { omitBackground: true }),
    // Use consistent scale for screenshots
    scale: "css" as const,
    type: "png" as const,
  };
}

/**
 * Common viewport sizes for responsive testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  mobileLarge: { width: 414, height: 896 }, // iPhone 11 Pro Max
  tablet: { width: 768, height: 1024 }, // iPad
  tabletLarge: { width: 1024, height: 1366 }, // iPad Pro
  desktop: { width: 1920, height: 1080 }, // Full HD
  desktopLarge: { width: 2560, height: 1440 }, // 2K
};

/**
 * Critical routes for visual testing
 */
export const criticalRoutes = [
  { path: "/", name: "homepage", auth: false },
  { path: "/blog", name: "blog", auth: false },
  { path: "/privacy", name: "privacy", auth: false },
  { path: "/terms", name: "terms", auth: false },
  { path: "/#workflow-sandbox", name: "workflow-sandbox", auth: false },
  { path: "/#secret-sauce", name: "secret-sauce", auth: false },
];

/**
 * Helper to take a screenshot with all stability measures
 */
export async function takeStableScreenshot(
  page: Page,
  name: string,
  options: {
    fullPage?: boolean;
    maskSelectors?: string[];
    waitForSelector?: string;
  } = {},
): Promise<void> {
  const { fullPage = true, maskSelectors = [], waitForSelector } = options;

  // Wait for specific element if requested
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, {
      state: "visible",
      timeout: 10000,
    });
  }

  // Wait for page stability
  await waitForPageStability(page);

  // Mask dynamic content
  await maskDynamicContent(page);

  // Take screenshot with animations disabled
  await expect(page).toHaveScreenshot(name, {
    fullPage,
    animations: "disabled",
    ...(maskSelectors.length > 0 && {
      mask: maskSelectors.map((selector) => page.locator(selector)),
    }),
  });
}
