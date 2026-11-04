import { test, expect } from "@playwright/test";

import { siteContent } from "../../src/content/site";

/**
 * Regression lock: every public marketing route must render without errors.
 * Fails on console errors, non-200 status, or missing heading.
 */
const PUBLIC_ROUTES = [
  { path: "/", heading: /AI Systems That Ship/i },
  { path: "/services", heading: siteContent.servicesPage.hero.title },
  { path: "/process", heading: /From discovery to deployment/i },
  { path: "/pricing", heading: /How money flows in AIAS engagements/i },
  {
    path: "/contact",
    heading: /Turn one blocked workflow into a decision-ready next step/i,
  },
  {
    path: "/about",
    heading: /A consultancy focused on reliable automation outcomes/i,
  },
  {
    path: "/case-studies",
    heading: /Architecture scenarios with measurable evidence plans/i,
  },
  { path: "/blog", heading: /Systems Thinking.*AI Blog/i },
  { path: "/dashboard", heading: /Operations Workspace Reference/i },
  { path: "/privacy", heading: /Privacy Policy/i },
  { path: "/terms", heading: /Terms of Service/i },
];

test.describe("@smoke Public route regression lock", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.path} renders without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.status(), `${route.path} returned non-200`).toBeLessThan(
        400,
      );
      await expect(
        page.getByRole("heading", { name: route.heading }).first(),
      ).toBeVisible();

      // Filter out expected noise (e.g. third-party script failures, SW)
      const realErrors = consoleErrors.filter(
        (e) => !e.includes("service-worker") && !e.includes("favicon"),
      );
      expect(
        realErrors,
        `Console errors on ${route.path}: ${realErrors.join("; ")}`,
      ).toHaveLength(0);
    });
  }
});
