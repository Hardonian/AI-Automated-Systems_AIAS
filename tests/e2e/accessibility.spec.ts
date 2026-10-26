/**
 * Accessibility E2E Tests
 *
 * Automated accessibility testing using Playwright and axe-core.
 */

import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

const a11yOptions = {
  detailedReport: true,
  detailedReportOptions: { html: true },
};

const a11yContext = {
  exclude: [[".cw-header"], ["textarea.cw-input"], [".cw-powered"]],
};

test.describe("Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/chat.aiautomatedsystems.ca/**", (route) =>
      route.abort(),
    );
  });

  test("homepage should be accessible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("privacy page should be accessible", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("documentation page should be accessible", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("catalog page should be accessible", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("blog page should be accessible", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("terms page should be accessible", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("metrics page should be accessible", async ({ page }) => {
    await page.goto("/metrics");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("how-it-works page should be accessible", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("roi-calculator page should be accessible", async ({ page }) => {
    await page.goto("/roi-calculator");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("diagnostic page should be accessible", async ({ page }) => {
    await page.goto("/diagnostic");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("contact page should be accessible", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);
    await checkA11y(page, a11yContext, a11yOptions);
  });

  test("keyboard navigation should work", async ({ page }) => {
    await page.goto("/");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();

    // Check skip link appears on focus
    const skipLink = page.locator(".skip-link");
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");

    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });

  test("forms should have labels", async ({ page }) => {
    await page.goto("/#workflow-sandbox");

    const inputs = await page.locator("input, select, textarea").all();
    for (const input of inputs) {
      const id = await input.getAttribute("id");
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const ariaLabel = await input.getAttribute("aria-label");
        const ariaLabelledBy = await input.getAttribute("aria-labelledby");

        expect(
          (await label.count()) > 0 || ariaLabel || ariaLabelledBy,
        ).toBeTruthy();
      }
    }
  });

  test("headings should be in logical order", async ({ page }) => {
    await page.goto("/");

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    let lastLevel = 0;

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const levelStr = tagName[1];
      if (!levelStr) {
        continue;
      }
      const level = parseInt(levelStr, 10);

      // Headings should not skip levels
      expect(level).toBeLessThanOrEqual(lastLevel + 1);
      lastLevel = level;
    }
  });

  test("color contrast should meet WCAG AA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await injectAxe(page);

    await checkA11y(page, a11yContext, {
      ...a11yOptions,
      axeOptions: {
        rules: {
          "color-contrast": { enabled: true },
        },
      },
    });
  });
});
