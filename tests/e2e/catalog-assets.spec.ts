import { expect, test } from "@playwright/test";

test.describe("@smoke Catalog assets", () => {
  test("catalog thumbnails load from the static public directory", async ({
    page,
  }) => {
    await page.goto("/catalog");

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
  });
});
