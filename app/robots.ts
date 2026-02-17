export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://aiautomatedsystems.ca';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
