import { test, expect } from '@playwright/test';

test.describe('@smoke Case studies media + attribution', () => {
  test('case studies page renders thumbnails and UTM-tagged outbound links', async ({ page }) => {
    await page.goto('/case-studies');

    const settlerThumb = page.getByAltText('Settler case study thumbnail');
    const readyLayerThumb = page.getByAltText('Ready Layer case study thumbnail');
    await expect(settlerThumb).toBeVisible();
    await expect(readyLayerThumb).toBeVisible();

    const settlerLogo = page.getByAltText('Settler logo');
    const readyLayerLogo = page.getByAltText('Ready Layer logo');
    await expect(settlerLogo).toBeVisible();
    await expect(readyLayerLogo).toBeVisible();

    const links = page.getByRole('link', { name: 'Visit project' });
    await expect(links).toHaveCount(2);

    await expect(links.nth(0)).toHaveAttribute(
      'href',
      /settler\.dev\/\?utm_source=aias&utm_medium=case-study&utm_campaign=website/
    );

    await expect(links.nth(1)).toHaveAttribute(
      'href',
      /ready-layer\.com\/\?utm_source=aias&utm_medium=case-study&utm_campaign=website/
    );
  });
});
