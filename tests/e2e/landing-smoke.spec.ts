import { test, expect } from '@playwright/test';

test.describe('@smoke AIAS Landing & Workflow Smoke Test', () => {
  test('Home page loads with key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AIAS|AI Automated Systems/);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=Agentic Automation Consultancy')).toBeVisible();

    const cta = page.getByRole('link', { name: 'Book a Strategy Call' }).first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href ?? '').toMatch(/calendly|mailto/);
  });

  test('Workflow Sandbox is functional', async ({ page }) => {
    await page.goto('/#workflow-sandbox');

    await expect(page.getByText('Experience the Workflow Engine')).toBeVisible();
    const submitBtn = page.getByRole('button', { name: 'Simulate Workflow' });
    await expect(submitBtn).toBeVisible();

    await page.getByLabel('Problem Domain').click();
    await page.getByRole('option', { name: 'Invoice Processing' }).click();

    await page.fill('#constraints', 'Must comply with PIPEDA');
    await page.fill('#stack', 'Shopify, Slack');

    await submitBtn.click();

    await expect(page.getByText('Agentic Execution Plan')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Must comply with PIPEDA')).toBeVisible();
  });

  test('Route-first nav and footer integrity', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Navigate to Services' }).first()).toHaveAttribute('href', '/services');
    await expect(page.getByRole('link', { name: 'Navigate to Process' }).first()).toHaveAttribute('href', '/process');

    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer').getByText('Built in Canada 🇨🇦', { exact: false })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy Policy' }).first()).toBeVisible();
  });
});
