import { test, expect } from '@playwright/test';

test.describe('AIAS Landing & Workflow Smoke Test', () => {
    test('Home page loads with key sections', async ({ page }) => {
        await page.goto('/');
        // Check title contains brand
        await expect(page).toHaveTitle(/AIAS|AI Automated Systems/);

        // Check Hero
        await expect(page.locator('h1').first()).toBeVisible();
        await expect(page.locator('text=Enterprise-Grade AI Automation')).toBeVisible();

        // Check Primary CTA
        const cta = page.getByRole('link', { name: 'Book a Strategy Call' }).first();
        await expect(cta).toBeVisible();
        const href = await cta.getAttribute('href');
        expect(href).toContain('calendly');
    });

    test('Workflow Sandbox is functional', async ({ page }) => {
        await page.goto('/#workflow-sandbox');

        // Check initial state
        await expect(page.getByText('Experience the Workflow Engine')).toBeVisible();
        const submitBtn = page.getByRole('button', { name: 'Simulate Workflow' });
        await expect(submitBtn).toBeVisible();

        // Fill form
        await page.getByLabel('Problem Domain').click();
        await page.getByRole('option', { name: 'Invoice Processing' }).click();

        await page.fill('#constraints', 'Must comply with PIPEDA');
        await page.fill('#stack', 'Shopify, Slack');

        // Submit
        await submitBtn.click();

        // Assert Output
        await expect(page.getByText('Agentic Execution Plan')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Must comply with PIPEDA')).toBeVisible();
    });

    test('Nav and Footer integrity', async ({ page }) => {
        await page.goto('/');

        // Check Footer
        await expect(page.locator('footer')).toBeVisible();
        await expect(page.getByText('Built in Canada')).toBeVisible();

        // Check Privacy Policy link exists
        await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    });
});
