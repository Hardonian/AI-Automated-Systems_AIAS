/**
 * Visual Regression Tests (Legacy)
 *
 * ⚠️ DEPRECATED: Use visual-suite.spec.ts for new visual tests
 *
 * These tests are kept for backward compatibility.
 * For comprehensive visual testing, use: pnpm test:visual
 *
 * Run with: pnpm test:e2e visual-regression.spec.ts
 */

import { test, expect } from "@playwright/test";
import {
  setupVisualTest,
  waitForPageStability,
  maskDynamicContent,
} from "./utils/visual-helpers";

const baseURL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Visual Regression - Critical Pages", () => {
  test("Homepage visual regression", async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo, {
      viewport: { width: 1920, height: 1080 },
    });

    await page.goto(baseURL);
    await waitForPageStability(page);
    await maskDynamicContent(page);

    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Homepage - mobile viewport", async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo, {
      viewport: { width: 375, height: 667 },
    });

    await page.goto(baseURL);
    await waitForPageStability(page);
    await maskDynamicContent(page);

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Homepage - tablet viewport", async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo, {
      viewport: { width: 768, height: 1024 },
    });

    await page.goto(baseURL);
    await waitForPageStability(page);
    await maskDynamicContent(page);

    await expect(page).toHaveScreenshot("homepage-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});

test.describe("Visual Regression - Navigation", () => {
  test("Navigation header visual regression", async ({ page }, testInfo) => {
    await setupVisualTest(page, testInfo, {
      viewport: { width: 1920, height: 1080 },
    });

    await page.goto(baseURL);
    await waitForPageStability(page);

    const nav = page.getByTestId("header-nav-cluster").first();

    if ((await nav.count()) > 0) {
      await expect(nav).toHaveScreenshot("navigation-header.png", {
        animations: "disabled",
      });
    } else {
      test.skip();
    }
  });
});
