/**
 * Reality Suite - E2E Tests with Synthetic Monitors
 */

import { test, expect } from '@playwright/test';

test.describe('Reality Suite - Production Health Checks', () => {
  const prodUrl = process.env.PROD_URL || 'https://your-app.vercel.app';

  test('Homepage loads and renders core CTA', async ({ page }) => {
    await page.goto(prodUrl);
    await expect(page).toHaveTitle(/AI Automated Systems|AIAS/i);
    await expect(
      page.getByRole('link', { name: /Book a Strategy Call/i })
    ).toBeVisible();
  });

  test('Blog index loads', async ({ page }) => {
    await page.goto(`${prodUrl}/blog`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Featured blog article loads', async ({ page }) => {
    await page.goto(`${prodUrl}/blog/10-automation-workflows-save-time`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('Synthetic Monitors', () => {
  const prodUrl = process.env.PROD_URL || 'https://your-app.vercel.app';

  test('Primary CTA points to Calendly', async ({ page }) => {
    await page.goto(prodUrl);
    const ctaLink = page.getByRole('link', { name: /Book a Strategy Call/i });
    await expect(ctaLink).toHaveAttribute('href', /calendly\.com/);
  });
});
