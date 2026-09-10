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

    await expect(page.getByText("Architecture", { exact: true })).toHaveCount(
      8,
    );

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
  });
});
