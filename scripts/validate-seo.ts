import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

function getRouteFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(entry => entry.isFile() && entry.name === 'page.tsx')
    .map(entry => path.join(entry.path, entry.name));
}

const routeFiles = getRouteFiles('app');
const failures: string[] = [];
const canonicalSeen = new Map<string, string>();
const titleSeen = new Map<string, string>();
const descriptionSeen = new Map<string, string>();

const titleRegex = /title:\s*['`"]([^'`"]+)['`"]/;
const descRegex = /description:\s*['`"]([^'`"]+)['`"]/;
const canonicalRegex = /canonical:\s*['`"]([^'`"]+)['`"]/;

for (const routeFile of routeFiles) {
  const source = readFileSync(routeFile, 'utf8');
  const isDynamicRoute = routeFile.includes('[');

  const title = source.match(titleRegex)?.[1];
  const description = source.match(descRegex)?.[1];
  const canonical = source.match(canonicalRegex)?.[1];

  if (!title) failures.push(`${routeFile}: missing title`);
  if (!description) failures.push(`${routeFile}: missing description`);
  if (!canonical && !source.includes('generateMetadata(')) failures.push(`${routeFile}: missing canonical`);

  if (!source.includes('openGraph') && !source.includes('generateSEOMetadata(')) {
    failures.push(`${routeFile}: missing OG metadata`);
  }

  if (!isDynamicRoute) {
    if (title && titleSeen.has(title)) failures.push(`${routeFile}: duplicate title with ${titleSeen.get(title)}`);
    if (description && descriptionSeen.has(description)) failures.push(`${routeFile}: duplicate description with ${descriptionSeen.get(description)}`);
    if (canonical && canonicalSeen.has(canonical)) failures.push(`${routeFile}: duplicate canonical with ${canonicalSeen.get(canonical)}`);

    if (title) titleSeen.set(title, routeFile);
    if (description) descriptionSeen.set(description, routeFile);
    if (canonical) canonicalSeen.set(canonical, routeFile);
  }
}

const structuredDataPages = ['app/page.tsx', 'app/services/page.tsx', 'app/how-it-works/page.tsx'];
for (const file of structuredDataPages) {
  const source = readFileSync(file, 'utf8');
  if (!source.includes('FAQSchema') && !source.includes('ServiceSchema') && !source.includes('ServiceListSchema')) {
    failures.push(`${file}: missing required JSON-LD usage`);
  }
}

if (failures.length) {
  console.error('SEO validation failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}

console.log(`SEO validation passed across ${routeFiles.length} routes.`);
