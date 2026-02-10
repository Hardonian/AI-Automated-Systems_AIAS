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
        await page.goto('/workflow-sandbox');

        // Check initial state
        await expect(page.getByText('Experience the Workflow Engine')).toBeVisible();
        const submitBtn = page.getByRole('button', { name: 'Simulate Workflow' });
        await expect(submitBtn).toBeVisible();

        // Fill form
        // 1. Problem Domain Select
        // Radix UI Select trigger usually has role combobox
        await page.getByRole('combobox').click();
        // Select first option
        await page.getByRole('option').first().click();

        // 2. Constraints
        await page.fill('#constraints', 'Must comply with PIPEDA');

        // 3. Stack
        await page.fill('#stack', 'Shopify, Slack');

        // Submit
        await submitBtn.click();

        // Assert Output (Wait for simulation delay)
        await expect(page.getByText('Markdown Plan')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('JSON Artifact')).toBeVisible();

        // Check if inputs are reflected in output (basic echo check)
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
