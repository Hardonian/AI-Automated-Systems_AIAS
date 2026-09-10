import { test, expect } from "@playwright/test";

import { siteContent } from "../../src/content/site";

test.describe("@smoke Reality Mode Smoke Test", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
  });

  test("Landing page has unified CTAs", async ({ page }) => {
    const primaryCTA = page
      .getByRole("link", { name: siteContent.positioning.primaryCTA.label })
      .first();
    await expect(primaryCTA).toBeVisible();
    const href = await primaryCTA.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href ?? "").toMatch(/calendly\.com|^mailto:|^\/book$/);

    const secondaryCTA = page
      .getByRole("link", {
        name: siteContent.positioning.secondaryCTA.label,
      })
      .first();
    await expect(secondaryCTA).toBeVisible();
    await expect(secondaryCTA).toHaveAttribute(
      "href",
      siteContent.positioning.secondaryCTA.href,
    );
  });

  test("Route-first navigation pages render", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", {
        name: siteContent.servicesPage.hero.title,
      }),
    ).toBeVisible();

    await page.goto("/process");
    await expect(
      page.getByRole("heading", { name: "From discovery to deployment" }),
    ).toBeVisible();

    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Operations Workspace Reference" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Request Provisioned Client Access" }),
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
      page.getByRole("heading", {
        name: siteContent.ecosystemPage.diagram.title,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: siteContent.ecosystemPage.narrative.governancePrinciples.title,
      }),
    ).toBeVisible();

    await page.goto("/automation-demo");
    await expect(
      page.getByRole("heading", {
        name: "Live Automation Engine & Control-Plane",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "How Deterministic Boundaries Protect Production",
      }),
    ).toBeVisible();

    await page.goto("/readiness-checklist");
    await expect(
      page
        .getByRole("heading", {
          name: "AI Governance & Systems Readiness",
        })
        .first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Download Checklist (.md)",
      }),
    ).toHaveAttribute("href", "/downloads/ai-systems-readiness-checklist.md");
  });
});
