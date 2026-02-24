export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

import { getLatestArticles } from '@/lib/blog/articles';
import { SITE_URL } from '@/lib/seo/metadata';
import { caseStudies } from '@/src/content/caseStudies';
import { blueprints } from '@/src/content/moat';

const baseUrl = SITE_URL;
const lastModified = new Date();

const staticRoutes: Array<{
  route: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
}> = [
  { route: '', priority: 1, changeFrequency: 'weekly' },
  { route: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/approach', priority: 0.85, changeFrequency: 'weekly' },
  { route: '/automation-demo', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { route: '/blueprints', priority: 0.75, changeFrequency: 'weekly' },
  { route: '/book', priority: 0.8, changeFrequency: 'weekly' },
  { route: '/build-log', priority: 0.75, changeFrequency: 'weekly' },
  { route: '/case-studies', priority: 0.8, changeFrequency: 'weekly' },
  { route: '/certification', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/docs', priority: 0.55, changeFrequency: 'monthly' },
  { route: '/ecosystem', priority: 0.8, changeFrequency: 'monthly' },
  { route: '/engagement-simulator', priority: 0.75, changeFrequency: 'weekly' },
  { route: '/faq', priority: 0.75, changeFrequency: 'weekly' },
  { route: '/how-it-works', priority: 0.85, changeFrequency: 'weekly' },
  { route: '/methodology', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/metrics', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/operator', priority: 0.65, changeFrequency: 'monthly' },
  { route: '/operator-demo', priority: 0.55, changeFrequency: 'monthly' },
  { route: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { route: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  { route: '/process', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/readiness-checklist', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/roi-calculator', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { route: '/services/app-ai-systems', priority: 0.8, changeFrequency: 'monthly' },
  { route: '/services/automation-web', priority: 0.8, changeFrequency: 'monthly' },
  { route: '/survey', priority: 0.55, changeFrequency: 'monthly' },
  { route: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  { route: '/what-aias-does', priority: 0.9, changeFrequency: 'weekly' },
  { route: '/why-we-say-no', priority: 0.6, changeFrequency: 'monthly' },
  { route: '/work', priority: 0.8, changeFrequency: 'weekly' },
  { route: '/workflows', priority: 0.7, changeFrequency: 'weekly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudyRoutes = caseStudies.map(study => ({
    route: `/case-studies/${study.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const blogRoutes = getLatestArticles(100).map(article => ({
    route: `/blog/${article.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  const blueprintRoutes = blueprints.map(blueprint => ({
    route: `/blueprints/${blueprint.slug}`,
    priority: 0.65,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes, ...blueprintRoutes].map(entry => ({
    url: `${baseUrl}${entry.route}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
