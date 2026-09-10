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

    await expect
      .poll(async () =>
        thumbnails.evaluateAll((images) =>
          images.every((image) => {
            const thumbnail = image as HTMLImageElement;
            return thumbnail.complete && thumbnail.naturalWidth > 0;
          }),
        ),
      )
      .toBe(true);

    await expect(
      page.getByText("Architecture boundary", { exact: true }),
    ).toHaveCount(8);

    const scopeLinks = page.getByRole("link", { name: "Request Scope" });
    await expect(scopeLinks).toHaveCount(8);

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
});
