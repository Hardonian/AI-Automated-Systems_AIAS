import { test, expect } from '@playwright/test';

/**
 * Regression lock: every public marketing route must render without errors.
 * Fails on console errors, non-200 status, or missing heading.
 */
const PUBLIC_ROUTES = [
  { path: '/', heading: /Agentic Automation Consultancy/i },
  { path: '/services', heading: /What we deliver/i },
  { path: '/process', heading: /From discovery to deployment/i },
  { path: '/pricing', heading: /Transparent pricing/i },
  { path: '/contact', heading: /Let.*talk automation/i },
  { path: '/about', heading: /Engineering the future of work/i },
  { path: '/case-studies', heading: /Proof of impact/i },
  { path: '/blog', heading: /Systems Thinking.*AI Blog/i },
  { path: '/dashboard', heading: /Dashboard/i },
  { path: '/privacy', heading: /Privacy Policy/i },
  { path: '/terms', heading: /Terms of Service/i },
];

test.describe('@smoke Public route regression lock', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.path} renders without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      expect(response?.status(), `${route.path} returned non-200`).toBeLessThan(400);
      await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible();

      // Filter out expected noise (e.g. third-party script failures, SW)
      const realErrors = consoleErrors.filter(
        e => !e.includes('service-worker') && !e.includes('favicon')
      );
      expect(realErrors, `Console errors on ${route.path}: ${realErrors.join('; ')}`).toHaveLength(0);
    });
  }
});
