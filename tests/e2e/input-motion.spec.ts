import { expect, test } from "@playwright/test";

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`ROI inputs remain visible and usable with ${reducedMotion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/roi-calculator");
    const input = page.locator("#roi-team-size");
    await expect(input).toBeVisible();
    await expect(input.locator("..")).toHaveCSS("opacity", "1");
    await input.fill("13");
    await expect(input).toHaveValue("13");
  });
}
