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

    const workflowImage = page.locator('img[src*="workflow_schema.avif"]');
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

  test("Workflow Proof Sprint is discoverable and offers private inbound contact", async ({
    page,
  }) => {
    await page.goto("/services");
    await page
      .getByRole("link", {
        name: "Private AI Workflow Proof Sprint",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/p\/workflow-proof-sprint\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Find out whether AI gives your support team time back",
    );
    await expect(
      page.getByRole("heading", {
        name: "CAD $1,500 founding pilot",
        level: 2,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Request a fit check" }),
    ).toHaveAttribute(
      "href",
      "https://api.aiautomatedsystems.ca/contact?product=workflow-proof-sprint",
    );
    await expect(
      page.getByText(/Do not send tickets, customer data/),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "What we measure", exact: true })
      .click();
    await expect(page).toHaveURL(/\/what-we-measure\/?$/);

    const inquiryUrl =
      "https://api.aiautomatedsystems.ca/contact?product=workflow-proof-sprint";
    await page.route(inquiryUrl, async (route) => {
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ status: 200, body: "Isolated intake navigation" });
    });
    await page.goBack();
    await page.getByRole("link", { name: "Request a fit check" }).click();
    await expect(page).toHaveURL(inquiryUrl);
    await expect(page.getByText("Isolated intake navigation")).toBeVisible();
  });

  test("Enterprise buyers can review the scope and reach tagged intake on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/services");
    await page
      .getByRole("link", { name: "Explore enterprise engagements" })
      .click();
    await expect(page).toHaveURL(/\/hire\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Make critical workflows easier to run and safer to change",
    );
    const inquiry =
      "https://api.aiautomatedsystems.ca/contact?product=enterprise-consulting";
    const consultation = page
      .getByRole("link", {
        name: "Request a consultation",
        exact: true,
      })
      .first();
    await expect(consultation).toBeInViewport();
    expect(
      await consultation.evaluate((link) => {
        const text = Array.from(link.childNodes).find(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );
        if (!text) {
          return false;
        }
        const range = document.createRange();
        range.selectNodeContents(text);
        const bounds = link.getBoundingClientRect();
        const label = range.getBoundingClientRect();
        return label.left >= bounds.left && label.right <= bounds.right;
      }),
    ).toBe(true);
    await expect(consultation).toHaveAttribute("href", inquiry);
    await expect(
      page.getByRole("link", { name: "Review our work", exact: true }),
    ).toHaveAttribute("href", "/work");
    await expect(
      page.getByRole("link", { name: "See the fixed-scope pilot" }),
    ).toHaveAttribute("href", "/p/workflow-proof-sprint");
    for (const track of siteContent.consultancyTracks) {
      await expect(
        page.getByRole("link", { name: track.ctaLabel, exact: true }),
      ).toHaveAttribute("href", inquiry);
    }
    await page.route(inquiry, async (route) => {
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ status: 200, body: "Isolated enterprise intake" });
    });
    await consultation.click();
    await expect(page).toHaveURL(inquiry);
    await expect(page.getByText("Isolated enterprise intake")).toBeVisible();
    await page.goto("/contact");
    await expect(
      page.getByRole("link", {
        name: "Request a consultation",
        exact: true,
      }),
    ).toHaveAttribute("href", inquiry);
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

  for (const width of [1536, 1799, 1800, 1920]) {
    test(`Header controls remain visible within a ${width}px viewport`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/docs");
      await expect(
        page
          .getByRole("banner")
          .getByRole("button", { name: /Switch to .* mode/i }),
      ).toBeVisible();
      const nav = page.getByTestId("header-primary-nav");
      const mobile = page.getByTestId("mobile-nav-trigger");
      if (width < 1800) {
        await expect(mobile).toBeVisible();
        await expect(nav).toBeHidden();
      } else {
        await expect(nav).toBeVisible();
        await expect(mobile).toBeHidden();
      }
      expect(
        await page.evaluate(() => document.body.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const activeNav = width < 1800 ? mobile : nav;
      const bounds = await activeNav.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    });
  }

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
