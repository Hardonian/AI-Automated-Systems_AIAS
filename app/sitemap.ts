export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

const baseUrl = 'https://aiautomatedsystems.ca';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/services',
    '/case-studies',
    '/process',
    '/pricing',
    '/contact',
    '/about',
    '/privacy',
    '/terms',
    '/blog',
    '/dashboard',
  ];

  return staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
