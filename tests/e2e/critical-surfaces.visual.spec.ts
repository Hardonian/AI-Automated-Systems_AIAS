import { expect, test } from "@playwright/test";

import {
  maskDynamicContent,
  revealScrollDrivenContent,
  setupVisualTest,
  waitForPageStability,
} from "./utils/visual-helpers";

const criticalSurfaces = [
  { name: "homepage", path: "/" },
  { name: "documentation", path: "/docs" },
  { name: "case-studies", path: "/case-studies" },
  { name: "roi-calculator", path: "/roi-calculator" },
  { name: "privacy", path: "/privacy" },
] as const;

test.describe("Critical surface visual regression", () => {
  for (const surface of criticalSurfaces) {
    test(`${surface.name} matches its baseline`, async ({ page }, testInfo) => {
      await setupVisualTest(page, testInfo, { reducedMotion: true });
      await page.goto(surface.path, { waitUntil: "domcontentloaded" });
      await waitForPageStability(page, { networkIdle: false });
      await revealScrollDrivenContent(page);
      await waitForPageStability(page, { networkIdle: false });
      await maskDynamicContent(page);

      await expect(page).toHaveScreenshot(`${surface.name}.png`, {
        animations: "disabled",
        fullPage: true,
        scale: "css",
      });
    });
  }
});
