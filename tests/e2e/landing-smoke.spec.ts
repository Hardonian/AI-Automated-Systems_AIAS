import { test, expect } from "@playwright/test";

import { siteContent } from "../../src/content/site";

test.describe("@smoke AIAS Landing & Workflow Smoke Test", () => {
  test("Home page loads with key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AIAS|AI Automated Systems/);
    await expect(
      page.getByRole("heading", { name: siteContent.brand.tagline }),
    ).toBeVisible();

    const cta = page
      .getByRole("link", { name: siteContent.positioning.primaryCTA.label })
      .first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href ?? "").toMatch(/calendly|mailto|\/book/);

    const workflowImage = page.locator(
      'img[src="/images/workflow_schema.avif"]',
    );
    await workflowImage.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        workflowImage.evaluate((image) => {
          const schemaImage = image as HTMLImageElement;
          return schemaImage.complete && schemaImage.naturalWidth > 0;
        }),
      )
      .toBe(true);
  });

  test("Contact intake flow is functional", async ({ page }) => {
    await page.goto("/contact");

    await expect(
      page.getByRole("heading", {
        name: /Turn one blocked workflow into a decision-ready next step/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Organization and problem context/i }),
    ).toBeVisible();

    await page.getByRole("combobox", { name: "Organization type" }).click();
    await page.getByRole("option", { name: "Enterprise" }).click();

    await page
      .getByRole("combobox", { name: "Primary problem category" })
      .click();
    await page
      .getByRole("option", { name: "Compliance, security, or governance risk" })
      .click();

    await page.getByRole("button", { name: "Continue" }).click();
    await expect(
      page.getByRole("heading", {
        name: /AI stack and governance diagnostics/i,
      }),
    ).toBeVisible();
  });

  test("Route-first nav and footer integrity", async ({ page }) => {
    await page.goto("/");

    const servicesNav = siteContent.navigation.primary.find(
      (item) => item.href === "/services",
    );
    const processNav = siteContent.navigation.primary.find(
      (item) => item.href === "/how-it-works",
    );

    expect(servicesNav).toBeDefined();
    expect(processNav).toBeDefined();

    await expect(
      page
        .getByRole("link", { name: `Navigate to ${servicesNav?.label}` })
        .first(),
    ).toHaveAttribute("href", servicesNav?.href ?? "");
    await expect(
      page
        .getByRole("link", {
          name: `Navigate to ${processNav?.label}`,
        })
        .first(),
    ).toHaveAttribute("href", processNav?.href ?? "");

    await expect(page.locator("footer")).toBeVisible();
    await expect(
      page.locator("footer").getByText("Built in Canada", { exact: false }),
    ).toBeVisible();
    await expect(
      page
        .locator("footer")
        .getByRole("link", { name: "Privacy Policy" })
        .first(),
    ).toBeVisible();
  });

  test("Header stays within the viewport at compact desktop widths", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.getByTestId("mobile-nav-trigger")).toBeVisible();
    await expect(page.getByTestId("header-primary-nav")).toBeHidden();

    const horizontalOverflow = await page
      .locator("header")
      .evaluate((header) => header.scrollWidth - header.clientWidth);
    expect(horizontalOverflow).toBeLessThanOrEqual(0);
  });
});
