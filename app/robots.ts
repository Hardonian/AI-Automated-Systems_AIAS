import { MetadataRoute } from 'next';

import { generateRobotsTxt } from '@/lib/seo/sitemap-generator';

export default function robots(): MetadataRoute.Robots {
  return generateRobotsTxt();
}
