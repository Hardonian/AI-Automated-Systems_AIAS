/**
 * Smoke Test
 *
 * Verifies the core "Reality Mode" flow: Landing -> Workflow Sandbox -> Results.
 * This ensures the interactive sandbox is functional and accessible.
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
    const primaryCTA = page
      .locator('a:has-text("Book a Strategy Call")')
      .first();
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('href', /calendly\.com/);

    // Check for secondary CTA
    const secondaryCTA = page
      .locator('a:has-text("Try the Workflow Sandbox")')
      .first();
    await expect(secondaryCTA).toBeVisible();
  });

  test('Workflow sandbox flow: Landing -> Sandbox -> Generate output', async ({
    page,
  }) => {
    const sandboxCTA = page
      .locator('a:has-text("Try the Workflow Sandbox")')
      .first();
    await sandboxCTA.click();
    await expect(page).toHaveURL(/#workflow-sandbox/);

    await page.getByLabel('Problem Domain').click();
    await page.getByRole('option', { name: 'Invoice Processing' }).click();

    await page.getByLabel('Constraints (e.g. "Must keep human in loop")').fill(
      'Human approval required for exceptions'
    );
    await page.getByLabel('Current Tech Stack').fill('HubSpot, Slack, Google Drive');

    await page.getByRole('button', { name: 'Simulate Workflow' }).click();

    await expect(page.getByText('Agentic Execution Plan')).toBeVisible();
    await expect(page.getByText('Configure Ingestion Webhook')).toBeVisible();
  });
});
