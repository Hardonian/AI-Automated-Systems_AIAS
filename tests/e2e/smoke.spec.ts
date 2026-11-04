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

    // Both handoffs must carry the diagnostic context to a real intake form.
    for (const name of [
      /Request Strategy Sprint/i,
      /Submit Diligence Request/i,
    ]) {
      const intakeLink = page.getByRole("link", { name });
      await expect(intakeLink).toBeVisible();
      const url = new URL((await intakeLink.getAttribute("href"))!, page.url());
      expect(url.pathname).toBe("/contact");
      expect(url.searchParams.get("ref")).toBe("diagnostic");
      for (const key of ["grade", "score", "workload", "track"]) {
        expect(url.searchParams.get(key), key).toBeTruthy();
      }
    }
    await page.getByRole("link", { name: /Submit Diligence Request/i }).click();
    await expect(page).toHaveURL(/\/contact\?ref=diagnostic/);
    await expect(page.locator("form")).toBeVisible();
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

  test("Self-healing diagnostic, workspace auto-enrich, dashboard FinOps, and operator console flows", async ({
    page,
  }) => {
    await page.goto("/diagnostic");
    await page
      .getByRole("button", { name: /Fragile Prototype Audit/i })
      .click();
    await page.getByRole("tab", { name: /4\. Architecture Brief/i }).click();
    await expect(page.getByText("Step 4 of 4")).toBeVisible();

    // Auto-heal drifted architecture to Grade A
    await page
      .getByRole("button", { name: /Auto-Heal Architecture/i })
      .first()
      .click();
    await expect(
      page.getByText(/Autonomous Remediation Applied \/\/ Score Upgraded/i),
    ).toBeVisible();

    // Switch to Zod Contract (.ts) preview mode
    await page.getByRole("button", { name: /Zod Contract \(\.ts\)/i }).click();
    await expect(
      page.getByText(
        /Executable TypeScript \+ Zod Sovereign Guardrail Contract/i,
      ),
    ).toBeVisible();

    // Navigate to /tools and verify Brief Readiness Audit & Auto-Enrich
    await page.goto("/tools");
    await expect(page.getByText(/Brief Readiness Audit/i)).toBeVisible();
    const enrichBtn = page.getByRole("button", {
      name: /Auto-Enrich Missing Guardrails/i,
    });
    if (await enrichBtn.isVisible()) {
      await enrichBtn.click();
    }
    await expect(page.getByText(/100% \(A\)/i).first()).toBeVisible();

    // Navigate to /dashboard and verify FinOps & Canary Fault controls
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /Simulate Canary Fault/i }).click();
    await expect(
      page.getByRole("button", { name: /Restore Canary v4\.2/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /FinOps & Capacity/i }).click();
    await expect(
      page.getByText(/Deterministic Cache Hit Ratio/i),
    ).toBeVisible();

    // Navigate to /operator-demo and verify pipeline workspace sync
    await page.goto("/operator-demo");
    await expect(
      page.getByRole("heading", { name: /Operator Console Demo/i }),
    ).toBeVisible();
    await expect(page.getByText(/Live Handoff Brief Detected/i)).toBeVisible();
    await page.getByRole("button", { name: /Sync to Console/i }).click();
    await expect(page.getByRole("button", { name: /Synced ✓/i })).toBeVisible();
  });
});
