export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

import { getLatestArticles } from '@/lib/blog/articles';
import { SITE_URL } from '@/lib/seo/metadata';

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    route: string;
    priority: number;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
  }> = [
    { route: '', priority: 1, changeFrequency: 'weekly' },
    { route: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { route: '/approach', priority: 0.85, changeFrequency: 'weekly' },
    { route: '/case-studies', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/faq', priority: 0.75, changeFrequency: 'weekly' },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/blog', priority: 0.8, changeFrequency: 'daily' },
    { route: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  ];

  const articles = getLatestArticles(100);
  const blogRoutes = articles.map(article => ({
    route: `/blog/${article.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...blogRoutes].map(entry => ({
    url: `${baseUrl}${entry.route}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
