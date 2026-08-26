import { test, expect } from "@playwright/test";

import {
  maskDynamicContent,
  setupVisualTest,
  waitForPageStability,
} from "./utils/visual-helpers";

const criticalRoutes = [
  { path: "/", name: "homepage" },
  { path: "/privacy", name: "privacy" },
  { path: "/terms", name: "terms" },
  { path: "/blog", name: "blog" },
  { path: "/#workflow-sandbox", name: "workflow-sandbox" },
] as const;

test.describe("Visual Regression - Landscape mobile critical routes", () => {
  for (const route of criticalRoutes) {
    test(`${route.name} - landscape mobile`, async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name !== "visual-landscape-mobile",
        "Runs only in visual-landscape-mobile project",
      );

      await setupVisualTest(page, testInfo, { reducedMotion: true });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await waitForPageStability(page);
      await maskDynamicContent(page);

      await expect(page).toHaveScreenshot(
        `${route.name}-landscape-mobile.png`,
        {
          fullPage: true,
          animations: "disabled",
          scale: "css",
        },
      );
    });
  }
});
