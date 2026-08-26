import { test, expect } from "@playwright/test";

test.describe("@smoke AIAS Landing & Workflow Smoke Test", () => {
  test("Home page loads with key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AIAS|AI Automated Systems/);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Agentic Automation Consultancy/i }),
    ).toBeVisible();

    const cta = page
      .getByRole("link", { name: /Book (a )?Strategy Call|Book Diagnostic/i })
      .first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href ?? "").toMatch(/calendly|mailto|\/book/);
  });

  test("Contact intake flow is functional", async ({ page }) => {
    await page.goto("/contact");

    await expect(
      page.getByRole("heading", {
        name: /Start with a focused automation conversation/i,
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

    await expect(
      page.getByRole("link", { name: "Navigate to Services" }).first(),
    ).toHaveAttribute("href", "/services");
    await expect(
      page
        .getByRole("link", {
          name: /Navigate to Process|Navigate to What AIAS Does/i,
        })
        .first(),
    ).toBeVisible();

    await expect(page.locator("footer")).toBeVisible();
    await expect(
      page.locator("footer").getByText("Built in Canada 🇨🇦", { exact: false }),
    ).toBeVisible();
    await expect(
      page
        .locator("footer")
        .getByRole("link", { name: "Privacy Policy" })
        .first(),
    ).toBeVisible();
  });
});
