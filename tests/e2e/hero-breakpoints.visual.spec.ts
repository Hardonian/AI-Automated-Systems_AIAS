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

    const impactCardContainer = hero
      .getByTestId("hero-impact-card-container")
      .first();
    await expect(impactCardContainer).toBeVisible();
    await expect(impactCardContainer).toHaveScreenshot(
      "hero-impact-card-container.png",
      {
        animations: "disabled",
        scale: "css",
      },
    );

    const trustBadgeCard = hero.getByTestId("hero-trust-badge-card").first();
    await expect(trustBadgeCard).toBeVisible();
    await expect(trustBadgeCard).toHaveScreenshot("hero-trust-badge-card.png", {
      animations: "disabled",
      scale: "css",
    });
  });
});
