import { existsSync, readFileSync } from 'node:fs';

const keyRoutes: Array<{ route: string; markers?: string[] }> = [
  { route: '/', markers: ['service-list-schema', 'faq-schema'] },
  { route: '/services' },
  { route: '/how-it-works', markers: ['faq-schema'] },
  { route: '/work', markers: ['case-study-schema-'] },
  { route: '/faq', markers: ['faq-schema'] },
];

const failures: string[] = [];

function routeToOutFile(route: string): string {
  if (route === '/') return 'out/index.html';
  return `out${route}.html`;
}

for (const { route, markers } of keyRoutes) {
  const file = routeToOutFile(route);

  if (!existsSync(file)) {
    failures.push(`${route}: missing built file ${file} (run pnpm build first)`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const hasJsonLdScriptTag = /<script[^>]+type=['"]application\/ld\+json['"][^>]*>/.test(html);
  const hasSerializedJsonLd = html.includes('application/ld+json') || html.includes('application\\/ld+json');

  if (!hasJsonLdScriptTag && !hasSerializedJsonLd) {
    failures.push(`${route}: missing JSON-LD marker in built HTML`);
    continue;
  }

  if (markers?.length) {
    for (const marker of markers) {
      if (!html.includes(marker)) {
        failures.push(`${route}: missing expected JSON-LD marker '${marker}'`);
      }
    }
  }
}

if (failures.length) {
  console.error('JSON-LD smoke validation failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`JSON-LD smoke validation passed for ${keyRoutes.length} key routes.`);
