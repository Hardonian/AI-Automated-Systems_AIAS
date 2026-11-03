import { expect, test } from "@playwright/test";

test("booking page explains that a request is not a reservation", async ({
  page,
}) => {
  await page.goto("/book?brief=private-test", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("heading", {
      name: "Online booking is currently unavailable",
    }),
  ).toBeVisible();
  await expect(page.getByText(/not booked until we confirm/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Email inquiries" }),
  ).toHaveAttribute("href", "mailto:inquiries@aiautomatedsystems.ca");
  await expect(
    page.getByRole("button", { name: /confirm.*session/i }),
  ).toHaveCount(0);
  await expect(page.getByText(/available strategy slots/i)).toHaveCount(0);
  await expect(page.getByText(/private-test/)).toHaveCount(0);
});
