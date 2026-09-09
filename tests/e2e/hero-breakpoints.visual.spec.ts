import { test, expect } from "@playwright/test";

import {
  maskDynamicContent,
  setupVisualTest,
  waitForPageStability,
} from "./utils/visual-helpers";

test.describe("Visual Regression - Hero breakpoints", () => {
  test("hero spacing remains stable across viewport breakpoints", async ({
    page,
  }, testInfo) => {
    await setupVisualTest(page, testInfo, { reducedMotion: true });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForPageStability(page);
    await maskDynamicContent(page);

    const hero = page.locator("#top").first();
    await expect(hero).toBeVisible();

    await expect(hero).toHaveScreenshot("hero-breakpoint-spacing.png", {
      animations: "disabled",
      scale: "css",
    });

    const ctaCluster = hero.getByTestId("hero-cta-group").first();
    await expect(ctaCluster).toBeVisible();
    await expect(ctaCluster).toHaveScreenshot("hero-cta-cluster-spacing.png", {
      animations: "disabled",
      scale: "css",
    });

    const socialProofGrid = hero.getByTestId("hero-social-proof-grid").first();
    await expect(socialProofGrid).toBeVisible();
    await expect(socialProofGrid).toHaveScreenshot(
      "hero-social-proof-grid.png",
      {
        animations: "disabled",
        scale: "css",
      },
    );

    const trustBadgeGrid = hero.getByTestId("hero-trust-badge-grid").first();
    await expect(trustBadgeGrid).toBeVisible();
    await expect(trustBadgeGrid).toHaveScreenshot("hero-trust-badge-grid.png", {
      animations: "disabled",
      scale: "css",
    });
  });
});
