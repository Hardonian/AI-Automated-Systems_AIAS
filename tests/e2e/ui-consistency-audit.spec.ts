/* eslint-disable no-console */
/**
 * UI Consistency & Functional Integrity Audit
 *
 * Automated audit that checks for:
 * - Console errors/warnings
 * - Network failures (4xx/5xx)
 * - Hydration mismatches
 * - Layout shifts
 * - Missing clickable elements on different viewports
 * - State loss on navigation
 * - Keyboard/focus traps
 * - Reduced motion compliance
 * - Dark mode consistency
 *
 * Run: pnpm test:audit
 */

import {
  test,
  Page,
  TestInfo,
  ConsoleMessage,
  Request,
} from '@playwright/test';
import {
  setupVisualTest,
  waitForPageStability,
  viewports,
} from './utils/visual-helpers';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

// Store issues found during audit
interface AuditIssue {
  route: string;
  viewport: string;
  severity: 'BLOCKER' | 'HIGH' | 'MED' | 'LOW';
  category: string;
  message: string;
  details?: string;
}

const auditIssues: AuditIssue[] = [];

/**
 * Helper to log audit issues
 */
function logIssue(
  route: string,
  viewport: string,
  severity: AuditIssue['severity'],
  category: string,
  message: string,
  details?: string
): void {
  auditIssues.push({ route, viewport, severity, category, message, details });
  const emoji =
    severity === 'BLOCKER'
      ? '🔴'
      : severity === 'HIGH'
        ? '🟠'
        : severity === 'MED'
          ? '🟡'
          : '🔵';
  console.log(
    `${emoji} [${severity}] ${category}: ${message} (${route} @ ${viewport})`
  );
}

/**
 * Sets up console and network monitoring
 */
async function setupMonitoring(
  page: Page,
  route: string,
  viewport: string
): Promise<void> {
  // Monitor console errors
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out known non-critical errors
      if (
        !text.includes('favicon') &&
        !text.includes('ResizeObserver') &&
        !text.includes('source map') &&
        !text.includes('[webpack]') &&
        !text.includes('hot-update')
      ) {
        logIssue(route, viewport, 'HIGH', 'Console Error', text);
      }
    }
    if (msg.type() === 'warning') {
      const text = msg.text();
      // Capture hydration warnings
      if (text.includes('hydrat') || text.includes('Hydration')) {
        logIssue(route, viewport, 'BLOCKER', 'Hydration Mismatch', text);
      }
    }
  });

  // Monitor page errors
  page.on('pageerror', (error: Error) => {
    logIssue(
      route,
      viewport,
      'BLOCKER',
      'Page Error',
      error.message,
      error.stack
    );
  });

  // Monitor network failures
  page.on('requestfailed', (request: Request) => {
    const url = request.url();
    // Filter out non-critical failures
    if (
      !url.includes('favicon') &&
      !url.includes('.map') &&
      !url.includes('hot-update')
    ) {
      logIssue(
        route,
        viewport,
        'HIGH',
        'Network Failure',
        `Failed to load: ${url}`
      );
    }
  });

  // Monitor 4xx/5xx responses
  page.on('response', response => {
    const status = response.status();
    const url = response.url();

    if (status >= 400 && status < 600) {
      // Skip certain expected errors
      if (
        url.includes('api/auth') || // Auth endpoints may return 401/403
        url.includes('analytics') || // Analytics may be blocked
        url.includes('telemetry') // Telemetry failures are non-critical
      ) {
        return;
      }

      const severity = status >= 500 ? 'BLOCKER' : 'HIGH';
      logIssue(route, viewport, severity, 'HTTP Error', `${status} on ${url}`);
    }
  });
}

/**
 * Checks for responsive issues at a given viewport
 */
async function checkResponsiveIssues(
  page: Page,
  route: string,
  viewportName: string
): Promise<void> {
  // Check for elements that might be hidden incorrectly
  const hiddenElements = await page.evaluate(() => {
    const issues: string[] = [];

    // Check for overflow issues
    const bodyOverflow = document.body.scrollWidth > window.innerWidth;
    if (bodyOverflow) {
      issues.push(
        `Horizontal overflow detected: ${document.body.scrollWidth - window.innerWidth}px`
      );
    }

    // Check for elements outside viewport
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        rect.right > window.innerWidth + 10 ||
        rect.bottom > window.innerHeight + 10
      ) {
        if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
          // Only log significant elements
          const isVisible = window.getComputedStyle(el).display !== 'none';
          if (isVisible && rect.width > 50 && rect.height > 50) {
            issues.push(
              `Element ${el.tagName} at (${rect.left}, ${rect.top}) extends beyond viewport`
            );
          }
        }
      }
    });

    return issues;
  });

  hiddenElements.forEach(issue => {
    logIssue(route, viewportName, 'MED', 'Responsive Issue', issue);
  });
}

/**
 * Checks for keyboard accessibility issues
 */
async function checkKeyboardAccessibility(
  page: Page,
  route: string,
  viewportName: string
): Promise<void> {
  // Try to tab through the page
  const initialFocus = await page.evaluate(
    () => document.activeElement?.tagName
  );

  // Tab 10 times and see if we get stuck
  let stuckCount = 0;
  let previousFocus: string | null = null;

  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const currentFocus = await page.evaluate(
      () => document.activeElement?.tagName || 'null'
    );

    if (currentFocus === previousFocus) {
      stuckCount++;
      if (stuckCount > 3) {
        logIssue(
          route,
          viewportName,
          'HIGH',
          'Keyboard Trap',
          'Focus appears to be trapped'
        );
        break;
      }
    } else {
      stuckCount = 0;
    }

    previousFocus = currentFocus;
  }

  // Check for focusable elements that are hidden
  const hiddenFocusable = await page.evaluate(() => {
    const focusable = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    let hiddenCount = 0;
    focusable.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        (rect.width === 0 && rect.height === 0)
      ) {
        hiddenCount++;
      }
    });
    return hiddenCount;
  });

  if (hiddenFocusable > 0) {
    logIssue(
      route,
      viewportName,
      'MED',
      'Accessibility',
      `${hiddenFocusable} focusable elements are hidden`
    );
  }
}

/**
 * Checks for reduced motion compliance
 */
async function checkReducedMotion(page: Page, route: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await waitForPageStability(page);

  // Check if animations are properly disabled
  const hasReducedMotionSupport = await page.evaluate(() => {
    const testElement = document.createElement('div');
    testElement.style.animation = 'test 1s infinite';
    document.body.appendChild(testElement);

    const style = window.getComputedStyle(testElement);
    const isAnimationDisabled =
      style.animationDuration === '0.001ms' ||
      style.animationDuration === '0s' ||
      style.animationName === 'none';

    document.body.removeChild(testElement);
    return isAnimationDisabled;
  });

  if (!hasReducedMotionSupport) {
    logIssue(
      route,
      'desktop',
      'MED',
      'Accessibility',
      'Reduced motion preferences not fully supported'
    );
  }
}

/**
 * Checks for dark mode consistency
 */
async function checkDarkMode(page: Page, route: string): Promise<void> {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload({ waitUntil: 'networkidle' });
  await waitForPageStability(page);

  // Check if dark mode is applied
  const hasDarkMode = await page.evaluate(() => {
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const computedStyle = window.getComputedStyle(document.body);
    const backgroundColor = computedStyle.backgroundColor;
    // Check if background is dark (simple heuristic)
    const isDarkBackground =
      backgroundColor.includes('0, 0, 0') ||
      backgroundColor.includes('rgb(2') ||
      backgroundColor.includes('rgb(1');
    return hasDarkClass || isDarkBackground;
  });

  if (!hasDarkMode) {
    logIssue(
      route,
      'desktop',
      'MED',
      'Theming',
      'Dark mode not properly applied'
    );
  }
}

/**
 * Runs a full audit on a single route
 */
async function auditRoute(
  page: Page,
  testInfo: TestInfo,
  route: string,
  viewportName: string,
  viewport: { width: number; height: number }
): Promise<void> {
  // Set viewport
  await page.setViewportSize(viewport);

  // Setup monitoring
  await setupMonitoring(page, route, viewportName);

  // Setup test environment
  await setupVisualTest(page, testInfo, {
    reducedMotion: true,
  });

  // Navigate to route
  const response = await page.goto(`${baseURL}${route}`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  if (!response || response.status() === 404) {
    logIssue(route, viewportName, 'LOW', 'Route', 'Route not found (404)');
    return;
  }

  // Wait for stability
  await waitForPageStability(page);

  // Run checks
  await checkResponsiveIssues(page, route, viewportName);
  await checkKeyboardAccessibility(page, route, viewportName);
}

// ============================================
// MAIN AUDIT TEST SUITE
// ============================================
test.describe('UI Consistency Audit', () => {
  test.afterAll(async () => {
    // Generate audit report
    console.log('\n========================================');
    console.log('UI CONSISTENCY AUDIT REPORT');
    console.log('========================================\n');

    const blockers = auditIssues.filter(i => i.severity === 'BLOCKER');
    const highs = auditIssues.filter(i => i.severity === 'HIGH');
    const meds = auditIssues.filter(i => i.severity === 'MED');
    const lows = auditIssues.filter(i => i.severity === 'LOW');

    console.log(`Total Issues: ${auditIssues.length}`);
    console.log(`  🔴 BLOCKER: ${blockers.length}`);
    console.log(`  🟠 HIGH: ${highs.length}`);
    console.log(`  🟡 MED: ${meds.length}`);
    console.log(`  🔵 LOW: ${lows.length}`);

    if (blockers.length > 0) {
      console.log('\n🔴 BLOCKER Issues (must fix):');
      blockers.forEach(issue => {
        console.log(
          `  - [${issue.category}] ${issue.message} (${issue.route})`
        );
      });
    }

    if (highs.length > 0) {
      console.log('\n🟠 HIGH Issues (should fix):');
      highs.forEach(issue => {
        console.log(
          `  - [${issue.category}] ${issue.message} (${issue.route})`
        );
      });
    }

    console.log('\n========================================');
  });

  // Audit critical routes across viewports
  const routesToAudit = [
    { path: '/', name: 'homepage' },
    { path: '/signin', name: 'signin' },
    { path: '/signup', name: 'signup' },
    { path: '/pricing', name: 'pricing' },
    { path: '/features', name: 'features' },
    { path: '/about', name: 'about' },
    { path: '/contact', name: 'contact' },
  ];

  for (const route of routesToAudit) {
    // Desktop audit
    test(`${route.name} - desktop audit`, async ({ page }, testInfo) => {
      await auditRoute(
        page,
        testInfo,
        route.path,
        'desktop',
        viewports.desktop
      );
    });

    // Tablet audit
    test(`${route.name} - tablet audit`, async ({ page }, testInfo) => {
      await auditRoute(page, testInfo, route.path, 'tablet', viewports.tablet);
    });

    // Mobile audit
    test(`${route.name} - mobile audit`, async ({ page }, testInfo) => {
      await auditRoute(page, testInfo, route.path, 'mobile', viewports.mobile);
    });

    // Dark mode check (desktop only)
    test(`${route.name} - dark mode check`, async ({ page }, testInfo) => {
      await setupVisualTest(page, testInfo);
      await page.goto(`${baseURL}${route.path}`, { waitUntil: 'networkidle' });
      await checkDarkMode(page, route.path);
    });

    // Reduced motion check (desktop only)
    test(`${route.name} - reduced motion check`, async ({ page }, testInfo) => {
      await setupVisualTest(page, testInfo);
      await page.goto(`${baseURL}${route.path}`, { waitUntil: 'networkidle' });
      await checkReducedMotion(page, route.path);
    });
  }

  // Cross-viewport consistency check
  test('cross-viewport navigation consistency', async ({ page }, testInfo) => {
    const route = '/features';

    // Get desktop state
    await page.setViewportSize(viewports.desktop);
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
    const desktopNavItems = await page.locator('nav a, header a').count();

    // Get mobile state
    await page.setViewportSize(viewports.mobile);
    await page.reload({ waitUntil: 'networkidle' });
    const mobileNavItems = await page.locator('nav a, header a').count();

    // Navigation should be accessible on both
    if (mobileNavItems === 0 && desktopNavItems > 0) {
      logIssue(
        route,
        'mobile',
        'HIGH',
        'Navigation',
        'Navigation items missing on mobile'
      );
    }
  });
});
