import { existsSync, readFileSync } from 'node:fs';

import { INDEXABLE_ROUTE_MANIFEST } from '@/lib/seo/route-manifest';

const failures: string[] = [];

const extractSeoConfig = (source: string) => {
  const block = source.match(/generateSEOMetadata\(\s*\{([\s\S]*?)\}\s*\)/);
  if (!block) {
    return null;
  }

  const configBlock = block[1];
  const extractField = (key: 'title' | 'description' | 'canonical') => {
    const regex = new RegExp(`${key}:\\s*['\"\`]([^'\"\`]+)['\"\`]`);
    return configBlock.match(regex)?.[1]?.trim();
  };

  return {
    title: extractField('title'),
    description: extractField('description'),
    canonical: extractField('canonical'),
  };
};

for (const route of INDEXABLE_ROUTE_MANIFEST) {
  const file = route.path === '/' ? 'app/page.tsx' : `app${route.path}/page.tsx`;

  if (!existsSync(file)) {
    failures.push(`${route.path}: missing page file ${file}`);
    continue;
  }

  const source = readFileSync(file, 'utf8');
  const parsed = extractSeoConfig(source);

  if (!parsed) {
    failures.push(`${route.path}: missing generateSEOMetadata config`);
    continue;
  }

  if (!parsed.title) failures.push(`${route.path}: could not parse title from generateSEOMetadata config`);
  if (!parsed.description) failures.push(`${route.path}: could not parse description from generateSEOMetadata config`);
  if (!parsed.canonical) failures.push(`${route.path}: could not parse canonical from generateSEOMetadata config`);

  if (parsed.title && parsed.title !== route.title) {
    failures.push(`${route.path}: title mismatch (page='${parsed.title}' manifest='${route.title}')`);
  }
  if (parsed.description && parsed.description !== route.description) {
    failures.push(`${route.path}: description mismatch (page='${parsed.description}' manifest='${route.description}')`);
  }
  if (parsed.canonical && parsed.canonical !== route.canonical) {
    failures.push(`${route.path}: canonical mismatch (page='${parsed.canonical}' manifest='${route.canonical}')`);
  }
}

if (failures.length) {
  console.error('Metadata-vs-manifest validation failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Metadata-vs-manifest validation passed for ${INDEXABLE_ROUTE_MANIFEST.length} routes.`);
