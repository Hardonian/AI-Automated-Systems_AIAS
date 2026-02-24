import { test, expect } from '@playwright/test';

test.describe('@smoke Case studies route coverage', () => {
  test('case studies index links to flagship structured routes', async ({ page }) => {
    await page.goto('/case-studies');

    await expect(page.getByRole('heading', { name: /Reach|Website Automation System/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Zeo|App Orchestration Platform/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Settler|Hybrid Deterministic \+ AI SaaS/i }).first()).toBeVisible();

    await expect(page.getByRole('link', { name: /Deep Dive|Open case study/i }).first()).toHaveAttribute(
      'href',
      /\/case-studies\//
    );
  });

  test('structured case study sections render on slug page', async ({ page }) => {
    await page.goto('/case-studies/website-automation-system');

    await expect(page.getByRole('heading', { name: /01 \/ The Problem|1\) Client Problem/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /02 \/ Interactive Architecture|2\) System Constraints/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /03 \/ Architecture Components|3\) Architecture Chosen/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /04 \/ Implementation Highlights|4\) Automation Layer/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /05 \/ Automation Wins|5\) AI Integration/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /06 \/ Measurable Impact|7\) Performance Results/i })).toBeVisible();
  });
});
