export const dynamic = 'force-static';

import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';

import type { MetadataRoute } from 'next';

import { getLatestArticles } from '@/lib/blog/articles';
import { SITE_URL } from '@/lib/seo/metadata';
import { INDEXABLE_ROUTE_MANIFEST } from '@/lib/seo/route-manifest';
import { caseStudies } from '@/src/content/caseStudies';
import { blueprints } from '@/src/content/moat';

const baseUrl = SITE_URL;
const fallbackLastModified = new Date();

const resolveLastModified = (filePath: string) => {
  try {
    const gitTimestamp = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (gitTimestamp) {
      const gitDate = new Date(gitTimestamp);
      if (!Number.isNaN(gitDate.getTime())) {
        return gitDate;
      }
    }
  } catch {
    // gracefully fall through to file mtime
  }

  if (existsSync(filePath)) {
    return statSync(filePath).mtime;
  }

  return fallbackLastModified;
};

const staticRoutes = INDEXABLE_ROUTE_MANIFEST.map(route => {
  const pagePath = route.path === '/' ? 'app/page.tsx' : `app${route.path}/page.tsx`;
  return {
    route: route.path === '/' ? '' : route.path,
    priority: route.priority,
    changeFrequency: route.changeFrequency,
    lastModified: resolveLastModified(pagePath),
  };
});

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudyRoutes = caseStudies.map(study => ({
    route: `/case-studies/${study.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: resolveLastModified('src/content/caseStudies.ts'),
  }));

  const blogRoutes = getLatestArticles(100).map(article => ({
    route: `/blog/${article.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
    lastModified: resolveLastModified('lib/blog/articles.ts'),
  }));

  const blueprintRoutes = blueprints.map(blueprint => ({
    route: `/blueprints/${blueprint.slug}`,
    priority: 0.65,
    changeFrequency: 'monthly' as const,
    lastModified: resolveLastModified('src/content/moat.ts'),
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes, ...blueprintRoutes].map(entry => ({
    url: `${baseUrl}${entry.route}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
