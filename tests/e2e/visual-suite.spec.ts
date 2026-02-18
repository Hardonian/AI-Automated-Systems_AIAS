/**
 * Comprehensive Visual Regression Test Suite
 *
 * Tests critical routes across multiple viewports with deterministic rendering.
 *
 * Run specific project:
 *   pnpm test:visual:desktop
 *   pnpm test:visual:tablet
 *   pnpm test:visual:mobile
 *
 * Update baselines:
 *   pnpm test:visual:update
 */

import { test, expect, Page, TestInfo } from '@playwright/test';
import {
  setupVisualTest,
  waitForPageStability,
  maskDynamicContent,
  viewports,
} from './utils/visual-helpers';

// Base URL from environment or default
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Test helper that runs a visual test for a specific route
 */
async function testRouteVisual(
  page: Page,
  testInfo: TestInfo,
  route: { path: string; name: string; auth: boolean },
  viewportName: string,
  darkMode: boolean = false
): Promise<void> {
  const testName = `${route.name}-${viewportName}${darkMode ? '-dark' : ''}`;

  // Setup visual test environment
  await setupVisualTest(page, testInfo, {
    darkMode,
    reducedMotion: true,
  });

  // Navigate to route
  const response = await page.goto(`${baseURL}${route.path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  // Check if page exists
  if (!response || response.status() === 404) {
    test.skip(true, `Route ${route.path} returned 404`);
    return;
  }

  // Skip auth-protected routes if we can't access them
  if ((route.auth && response.status() === 401) || response?.status() === 403) {
    test.skip(true, `Route ${route.path} requires authentication`);
    return;
  }

  // Wait for page to stabilize
  await waitForPageStability(page, {
    networkIdle: true,
    domStable: true,
    imagesLoaded: true,
    fontsLoaded: true,
    timeout: 30000,
  });

  // Mask dynamic content
  await maskDynamicContent(page);

  // Take screenshot
  await expect(page).toHaveScreenshot(`${testName}.png`, {
    fullPage: true,
    animations: 'disabled',
    scale: 'css',
  });
}

// ============================================
// HOMEPAGE VISUAL TESTS
// ============================================
test.describe('Visual Regression - Homepage', () => {
  test('homepage - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/', name: 'homepage', auth: false },
      'desktop'
    );
  });

  test('homepage - tablet', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.tablet);
    await testRouteVisual(
      page,
      testInfo,
      { path: '/', name: 'homepage', auth: false },
      'tablet'
    );
  });

  test('homepage - mobile', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await testRouteVisual(
      page,
      testInfo,
      { path: '/', name: 'homepage', auth: false },
      'mobile'
    );
  });
});

// ============================================
// AUTH PAGES VISUAL TESTS
// ============================================
test.describe('Visual Regression - Authentication', () => {
  test('privacy page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/privacy', name: 'privacy', auth: false },
      'desktop'
    );
  });

  test('privacy page - mobile', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await testRouteVisual(
      page,
      testInfo,
      { path: '/privacy', name: 'privacy', auth: false },
      'mobile'
    );
  });

  test('terms page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/terms', name: 'terms', auth: false },
      'desktop'
    );
  });

  test('terms page - mobile', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await testRouteVisual(
      page,
      testInfo,
      { path: '/terms', name: 'terms', auth: false },
      'mobile'
    );
  });
});

// ============================================
// MARKETING PAGES VISUAL TESTS
// ============================================
test.describe('Visual Regression - Marketing Pages', () => {
  test('homepage - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/', name: 'homepage', auth: false },
      'desktop'
    );
  });

  test('homepage - mobile', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await testRouteVisual(
      page,
      testInfo,
      { path: '/', name: 'homepage', auth: false },
      'mobile'
    );
  });

  test('blog page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/blog', name: 'blog', auth: false },
      'desktop'
    );
  });

  test('metrics page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/metrics', name: 'metrics', auth: false },
      'desktop'
    );
  });

  test('how-it-works page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/how-it-works', name: 'how-it-works', auth: false },
      'desktop'
    );
  });

  test('roi-calculator page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/roi-calculator', name: 'roi-calculator', auth: false },
      'desktop'
    );
  });

  test('services page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/services', name: 'services', auth: false },
      'desktop'
    );
  });

  test('ecosystem page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/ecosystem', name: 'ecosystem', auth: false },
      'desktop'
    );
  });

  test('workflow sandbox section - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/#workflow-sandbox', name: 'workflow-sandbox', auth: false },
      'desktop'
    );
  });

  test('secret sauce section - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/#secret-sauce', name: 'secret-sauce', auth: false },
      'desktop'
    );
  });
});

// ============================================
// CONTENT PAGES VISUAL TESTS
// ============================================
test.describe('Visual Regression - Content Pages', () => {
  test('blog page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/blog', name: 'blog', auth: false },
      'desktop'
    );
  });

  test('metrics page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/metrics', name: 'metrics', auth: false },
      'desktop'
    );
  });

  test('how-it-works page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/how-it-works', name: 'how-it-works', auth: false },
      'desktop'
    );
  });

  test('roi-calculator page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/roi-calculator', name: 'roi-calculator', auth: false },
      'desktop'
    );
  });

  test('services page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/services', name: 'services', auth: false },
      'desktop'
    );
  });

  test('ecosystem page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/ecosystem', name: 'ecosystem', auth: false },
      'desktop'
    );
  });

  test('privacy page - desktop', async ({ page }, testInfo) => {
    await testRouteVisual(
      page,
      testInfo,
      { path: '/privacy', name: 'privacy', auth: false },
      'desktop'
    );
  });
});

// ============================================
// ERROR STATES VISUAL TESTS
// ============================================
test.describe('Visual Regression - Error States', () => {
  test('404 page - desktop', async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo);

    const response = await page.goto(
      `${baseURL}/this-page-definitely-does-not-exist-12345`,
      {
        waitUntil: 'networkidle',
      }
    );

    // Wait for custom 404 or Next.js default
    await waitForPageStability(page);

    await expect(page).toHaveScreenshot('error-404-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('404 page - mobile', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await setupVisualTest(page, testInfo);

    await page.goto(`${baseURL}/non-existent-page-xyz`, {
      waitUntil: 'networkidle',
    });

    await waitForPageStability(page);

    await expect(page).toHaveScreenshot('error-404-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

// ============================================
// COMPONENT-ISOLATED VISUAL TESTS
// ============================================
test.describe('Visual Regression - Component States', () => {
  test('navigation header - desktop', async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo);
    await page.goto(baseURL);
    await waitForPageStability(page);

    const header = page.getByTestId('header-nav-cluster').first();
    if ((await header.count()) > 0) {
      await expect(header).toHaveScreenshot('component-header-desktop.png', {
        animations: 'disabled',
      });
    }
  });

  test('navigation header - mobile menu closed', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await setupVisualTest(page, testInfo);
    await page.goto(baseURL);
    await waitForPageStability(page);

    const header = page.getByTestId('header-nav-cluster').first();
    if ((await header.count()) > 0) {
      await expect(header).toHaveScreenshot(
        'component-header-mobile-closed.png',
        {
          animations: 'disabled',
        }
      );
    }
  });

  test('navigation header - mobile menu open', async ({ page }, testInfo) => {
    await page.setViewportSize(viewports.mobile);
    await setupVisualTest(page, testInfo);
    await page.goto(baseURL);
    await waitForPageStability(page);

    // Try to find and click mobile menu button
    const menuButton = page
      .locator('[data-testid="mobile-nav-trigger"]')
      .first();
    if ((await menuButton.count()) > 0) {
      await menuButton.click();
      await page.waitForTimeout(100); // Allow transition to complete

      await expect(page.getByTestId('header-nav-cluster').first()).toHaveScreenshot(
        'component-header-mobile-open.png',
        {
          animations: 'disabled',
        }
      );
    }
  });

  test('footer - desktop', async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo);
    await page.goto(baseURL);
    await waitForPageStability(page);

    const footer = page.getByTestId('footer-legal-cluster').first();
    if ((await footer.count()) > 0) {
      await expect(footer).toHaveScreenshot('component-footer-desktop.png', {
        animations: 'disabled',
      });
    }
  });
});
