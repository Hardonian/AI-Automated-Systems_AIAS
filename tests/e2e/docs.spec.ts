import { expect, test } from "@playwright/test";

test.describe("@smoke Documentation knowledge base", () => {
  test("renders complete documentation and trust links without browser errors", async ({
    page,
    request,
  }) => {
    const browserErrors: string[] = [];
    const failedResponses: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) {
        const url = new URL(response.url());
        failedResponses.push(
          `${response.status()} ${url.pathname}${url.search}`,
        );
      }
    });

    await page.goto("/docs", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "The operating system behind reliable automation",
      }),
    ).toBeVisible();

    for (const heading of [
      "Start with the system",
      "Build from working patterns",
      "Trust and operational boundaries",
      "Evidence and decision support",
      "Boundaries you can plan around",
      "Move from reading to a decision",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    const placeholderLinks = page.locator('main a[href="#"]');
    await expect(placeholderLinks).toHaveCount(0);

    const trustLinks = await page
      .locator('main a[href^="/docs/trust/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
      );

    expect(trustLinks).toHaveLength(5);
    for (const href of trustLinks) {
      expect(href).toBeTruthy();
      const response = await request.get(href!);
      expect(response.status(), `Trust document failed: ${href}`).toBe(200);
      expect(await response.text()).toContain("Last reviewed:");
    }

    const viewport = await page.evaluate(() => ({
      bodyWidth: document.body.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(viewport.bodyWidth).toBeLessThanOrEqual(viewport.viewportWidth);
    expect(
      { browserErrors, failedResponses },
      "Documentation route should not emit browser errors or failed resource responses",
    ).toEqual({ browserErrors: [], failedResponses: [] });
  });
});
