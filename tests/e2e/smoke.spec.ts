import { test, expect } from "@playwright/test";

test.describe("@smoke Reality Mode Smoke Test", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
  });

  test("Landing page has unified CTAs", async ({ page }) => {
    const primaryCTA = page
      .getByRole("link", { name: /Book (a )?Strategy Call|Book Diagnostic/i })
      .first();
    await expect(primaryCTA).toBeVisible();
    const href = await primaryCTA.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href ?? "").toMatch(/calendly\.com|^mailto:|^\/book$/);

    const secondaryCTA = page
      .getByRole("link", {
        name: /Try the Workflow Sandbox|What AIAS Actually Does/i,
      })
      .first();
    await expect(secondaryCTA).toBeVisible();
  });

  test("Route-first navigation pages render", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", {
        name: "Deterministic automation services built for production teams",
      }),
    ).toBeVisible();

    await page.goto("/process");
    await expect(
      page.getByRole("heading", { name: "From discovery to deployment" }),
    ).toBeVisible();

    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: /Dashboard access is invite-only/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /No active session detected/i }),
    ).toBeVisible();
  });

  test("Intake flow: Contact -> classify context", async ({ page }) => {
    await page.goto("/contact");

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

  test("New ecosystem and demo routes render", async ({ page }) => {
    await page.goto("/ecosystem");
    await expect(
      page.getByRole("heading", { name: "Layered system diagram" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Governance principles" }),
    ).toBeVisible();

    await page.goto("/automation-demo");
    await expect(
      page.getByRole("heading", { name: "Architecture diagram" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Governance Review" }),
    ).toBeVisible();

    await page.goto("/readiness-checklist");
    await expect(
      page
        .getByRole("heading", {
          name: /AI Systems Readiness Checklist|AI Governance Checklist/i,
        })
        .first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /Download checklist \(.md\)|Download Governance Checklist \(.md\)/i,
      }),
    ).toHaveAttribute("href", "/downloads/ai-systems-readiness-checklist.md");
  });
});
