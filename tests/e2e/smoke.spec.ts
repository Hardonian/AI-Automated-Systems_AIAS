import { test, expect } from '@playwright/test';

test.describe('@smoke Reality Mode Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
  });

  test('Landing page has unified CTAs', async ({ page }) => {
    const primaryCTA = page.getByRole('link', { name: 'Book a Strategy Call' }).first();
    await expect(primaryCTA).toBeVisible();
    const href = await primaryCTA.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href ?? '').toMatch(/calendly\.com|^mailto:/);

    const secondaryCTA = page.getByRole('link', { name: 'Try the Workflow Sandbox' }).first();
    await expect(secondaryCTA).toBeVisible();
  });

  test('Route-first navigation pages render', async ({ page }) => {
    await page.goto('/services');
    await expect(
      page.getByRole('heading', {
        name: 'Deterministic automation services built for production teams',
      })
    ).toBeVisible();

    await page.goto('/process');
    await expect(page.getByRole('heading', { name: 'From discovery to deployment' })).toBeVisible();

    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('No active session detected.')).toBeVisible();
  });

  test('Workflow sandbox flow: Landing -> Sandbox -> Generate output', async ({ page }) => {
    const sandboxCTA = page.getByRole('link', { name: 'Try the Workflow Sandbox' }).first();
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

  test('New ecosystem and demo routes render', async ({ page }) => {
    await page.goto('/ecosystem');
    await expect(page.getByRole('heading', { name: 'Layered system diagram' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Governance principles' })).toBeVisible();

    await page.goto('/automation-demo');
    await expect(page.getByRole('heading', { name: 'Architecture diagram' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Governance Review' })).toBeVisible();

    await page.goto('/readiness-checklist');
    await expect(page.getByRole('heading', { name: 'AI Systems Readiness Checklist' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download checklist (.md)' })).toHaveAttribute(
      'href',
      '/downloads/ai-systems-readiness-checklist.md'
    );
  });
});
