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

  test("Diagnostic wizard diligence and intake handoff", async ({ page }) => {
    await page.goto("/diagnostic");
    await expect(
      page
        .getByRole("heading", {
          name: /AI Clarity Diagnostic/i,
        })
        .first(),
    ).toBeVisible();

    // Step 1: select category
    await page.getByText("Financial & Invoicing Ops").click();
    await page
      .getByRole("button", { name: /Next: Boundary Allocation/i })
      .click();

    // Step 2: Boundary mapping
    await expect(page.getByText("Step 2 of 4")).toBeVisible();
    await page.getByRole("button", { name: /Next: Risk Ceilings/i }).click();

    // Step 3: Risk Ceilings
    await expect(page.getByText("Step 3 of 4")).toBeVisible();
    await page
      .getByRole("button", { name: /Generate Architecture Brief/i })
      .click();

    // Step 4: Results & Handoff
    await expect(page.getByText("Step 4 of 4")).toBeVisible();
    await expect(page.getByText(/AIAS Diligence Result/i)).toBeVisible();

    // Verify handoff link to contact
    const intakeLink = page.getByRole("link", {
      name: /Schedule Diligence Review/i,
    });
    await expect(intakeLink).toBeVisible();
    const href = await intakeLink.getAttribute("href");
    expect(href).toContain("/contact?ref=diagnostic");
  });

  test("Instant ROI Sizer on home and prefilled intake context", async ({
    page,
  }) => {
    await page.goto("/");
    const roiHeading = page.getByRole("heading", {
      name: /CALCULATE YOUR ANNUAL AUTOMATION CAPACITY/i,
    });
    await expect(roiHeading).toBeVisible();

    // Click enterprise preset
    await page.getByRole("button", { name: /Scaleup Operations/i }).click();

    // Click Proposal CTA
    const requestCta = page.getByRole("link", {
      name: /Lock In This Efficiency/i,
    });
    await expect(requestCta).toBeVisible();
    const href = await requestCta.getAttribute("href");
    expect(href).toContain("/contact?ref=roi-sizer");

    // Navigate to contact with parameters
    await requestCta.click();
    await page.waitForURL(/\/contact\?ref=roi-sizer/);

    // Verify ROI Target badge is visible in the intake form
    await expect(
      page.getByText(/Target Efficiency Model Attached/i),
    ).toBeVisible();
    await expect(page.getByText(/Target Annual Efficiency:/i)).toBeVisible();
  });
});
