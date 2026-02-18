export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

import { getLatestArticles } from '@/lib/blog/articles';
import { SITE_URL } from '@/lib/seo/metadata';
import { caseStudies } from '@/src/content/caseStudies';

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
    { route: '/ecosystem', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/automation-demo', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/readiness-checklist', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/services/automation-web', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/services/app-ai-systems', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/blog', priority: 0.8, changeFrequency: 'daily' },
    { route: '/build-log', priority: 0.75, changeFrequency: 'weekly' },
    { route: '/blueprints', priority: 0.75, changeFrequency: 'weekly' },
    { route: '/engagement-simulator', priority: 0.75, changeFrequency: 'weekly' },
    { route: '/methodology', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/operator-demo', priority: 0.55, changeFrequency: 'monthly' },
    { route: '/certification', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/why-we-say-no', priority: 0.6, changeFrequency: 'monthly' },
    { route: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  ];

  const caseStudyRoutes = caseStudies.map(study => ({
    route: `/case-studies/${study.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const articles = getLatestArticles(100);
  const blogRoutes = articles.map(article => ({
    route: `/blog/${article.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes].map(entry => ({
    url: `${baseUrl}${entry.route}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
