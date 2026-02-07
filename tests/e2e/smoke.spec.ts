/**
 * Smoke Test
 *
 * Verifies the core "Reality Mode" flow: Landing -> Demo -> Results.
 * This ensures the interactive demo is functional and accessible.
 *
 * Run with: pnpm test:e2e
 */

import { test, expect } from '@playwright/test';

test.describe('Reality Mode Smoke Test', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // Set longer timeout for E2E tests
    test.setTimeout(60000);
    await page.goto(baseURL);
  });

  test('Landing page has unified CTAs', async ({ page }) => {
    // Check for primary CTA
    const primaryCTA = page.locator('a:has-text("Try Live Demo")').first();
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('href', '/demo');

    // Check for secondary CTA
    const secondaryCTA = page
      .locator('a:has-text("Book a discovery call")')
      .first();
    await expect(secondaryCTA).toBeVisible();
  });

  test('Full demo flow: Landing -> Demo -> Execute -> Results', async ({
    page,
  }) => {
    // 1. Navigate to Demo page via CTA
    const primaryCTA = page.locator('a:has-text("Try Live Demo")').first();
    await primaryCTA.click();
    await expect(page).toHaveURL(/\/demo/);

    // 2. Verify Demo page content
    await expect(page.locator('h1')).toContainText(/Live Demo/i);
    await expect(page.locator('text=Control Plane')).toBeVisible();

    // 3. Trigger Demo Execution
    const executeButton = page.locator(
      'button:has-text("Trigger Sandboxed Agent")'
    );
    await expect(executeButton).toBeVisible();
    await executeButton.click();

    // 4. Wait for results
    // The demo has a simulated delay, so we wait for the results container
    await expect(page.locator('text=Executive Summary')).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('text=Evidence (JSON)')).toBeVisible();

    // 5. Verify Markdown results
    const summary = page.locator('.prose');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText(/Reconciliation Report/i);

    // 6. Verify JSON results
    const jsonOutput = page.locator('pre');
    await expect(jsonOutput).toBeVisible();
    await expect(jsonOutput).toContainText(/"status":/i);
  });
});
