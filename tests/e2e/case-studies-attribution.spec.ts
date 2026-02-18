import { test, expect } from '@playwright/test';

test.describe('@smoke Case studies route coverage', () => {
  test('case studies index links to all flagship structured routes', async ({ page }) => {
    await page.goto('/case-studies');

    await expect(page.getByRole('heading', { name: 'Website Automation System' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'App Orchestration Platform' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hybrid Deterministic + AI SaaS' })).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Open case study' }).first()
    ).toHaveAttribute('href', '/case-studies/website-automation-system');
  });

  test('structured case study template sections render on slug page', async ({ page }) => {
    await page.goto('/case-studies/website-automation-system');

    await expect(page.getByRole('heading', { name: '1) Client Problem' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2) System Constraints' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3) Architecture Chosen' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '4) Automation Layer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '5) AI Integration' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '6) Governance & Determinism' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '7) Performance Results' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '8) Long-Term Scalability' })).toBeVisible();
  });
});
