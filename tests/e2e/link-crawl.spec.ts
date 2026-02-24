import { test, expect } from '@playwright/test';

test.describe('@smoke Internal link crawl', () => {
  test('all internal links resolve and avoid placeholders', async ({ page, context, baseURL }) => {
    test.setTimeout(180000);

    if (!baseURL) {
      throw new Error('baseURL is required for link crawl');
    }

    const visited = new Set<string>();
    const queue = ['/'];

    while (queue.length > 0) {
      const route = queue.shift()!;
      if (visited.has(route)) {
        continue;
      }
      visited.add(route);

      let response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      if (!response || response.status() >= 400) {
        response = await page.goto(route, { waitUntil: 'load' });
      }

      expect(response?.status(), `Route failed: ${route}`).toBeLessThan(400);

      const hrefs = await page.$$eval('a[href]', links =>
        links.map(link => (link as HTMLAnchorElement).getAttribute('href') || '')
      );

      for (const href of hrefs) {
        expect(href, `Empty href on route ${route}`).not.toBe('');
        expect(href, `Placeholder href on route ${route}`).not.toBe('#');

        if (href.startsWith('/')) {
          const normalized = href.split('#')[0] || '/';
          if (!visited.has(normalized) && !queue.includes(normalized)) {
            queue.push(normalized);
          }
        }
      }
    }

    for (const route of visited) {
      const response = await context.request.get(new URL(route, baseURL).toString());
      expect(response.status(), `Broken linked route ${route}`).toBeLessThan(400);
    }
  });
});
