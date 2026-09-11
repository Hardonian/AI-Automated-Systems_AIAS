import { expect, test } from "@playwright/test";

test.describe("@smoke Catalog assets", () => {
  test("catalog is complete and every thumbnail loads", async ({ page }) => {
    await page.goto("/catalog");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "AI Systems & Module Catalog",
      }),
    ).toBeVisible();

    const thumbnails = page.locator('main img[src^="/images/catalog/"]');
    await expect(thumbnails).toHaveCount(8);

    for (let index = 0; index < (await thumbnails.count()); index += 1) {
      const thumbnail = thumbnails.nth(index);
      await thumbnail.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          thumbnail.evaluate(
            (image) => image.complete && image.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }

    await expect(
      page.getByText("Architecture boundary", { exact: true }),
    ).toHaveCount(8);

    const scopeLinks = page.getByRole("link", { name: "Request Scope" });
    await expect(scopeLinks).toHaveCount(8);
    await expect(
      page.getByRole("link", { name: "Technical profile" }),
    ).toHaveCount(8);

    const scopeDestinations = await scopeLinks.evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
    );
    expect(scopeDestinations).toHaveLength(8);
    expect(
      scopeDestinations.every((href) =>
        href?.startsWith("/contact?ref=catalog&product="),
      ),
    ).toBe(true);

    await expect(page.locator('a[href*="store.hardonia.com"]')).toHaveCount(0);

    const addButtons = page.getByRole("button", { name: "Add to shortlist" });
    await expect(addButtons).toHaveCount(8);
    await addButtons.first().click();
    await addButtons.first().click();

    await expect(page.getByText("Solution shortlist · 2/3")).toBeVisible();
    await page.getByRole("button", { name: "Compare systems" }).click();
    await expect(
      page.getByRole("heading", { name: "Shortlist comparison" }),
    ).toBeVisible();
    await expect(
      page.getByRole("row", { name: /Success signals/ }),
    ).toBeVisible();
    const reviewLink = page.getByRole("link", {
      name: "Review this shortlist",
    });
    await expect(reviewLink).toHaveAttribute(
      "href",
      /\/contact\?ref=catalog&products=/,
    );

    await reviewLink.click();
    await expect(page).toHaveURL(/\/contact\?ref=catalog&products=/);
    await expect(page.getByText("Catalog shortlist received")).toBeVisible();
    await expect(
      page.getByText("Hardonia Suite Client Operations Fabric", {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("catalog detail exposes a complete technical decision surface", async ({
    page,
  }) => {
    await page.goto("/catalog/hardonia-suite-ops");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Hardonia Suite Client Operations Fabric",
    );
    await expect(page.getByRole("heading", { name: "Inputs" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Deterministic controls" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Outputs" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Included artifacts" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Request fit review/ }),
    ).toHaveAttribute(
      "href",
      /\/contact\?ref=catalog&product=hardonia-suite-ops/,
    );
  });
});
