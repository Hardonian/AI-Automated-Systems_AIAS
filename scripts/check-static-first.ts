import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

function getRouteFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(entry => entry.isFile() && entry.name === 'page.tsx')
    .map(entry => path.join(entry.path, entry.name));
}

const routeFiles = getRouteFiles('app');


const violations: Array<{ file: string; reason: string }> = [];

for (const file of routeFiles) {
  const source = readFileSync(file, 'utf8');

  if (source.includes("dynamic = 'force-dynamic'") || source.includes('dynamic = "force-dynamic"')) {
    violations.push({ file, reason: 'force-dynamic export is not allowed for public static-first routes.' });
  }

  if (source.match(/revalidate\s*=\s*0/)) {
    violations.push({ file, reason: 'revalidate=0 opts into dynamic behavior.' });
  }

  if (source.includes("cache: 'no-store'")) {
    violations.push({ file, reason: "fetch cache 'no-store' detected." });
  }
}

if (violations.length > 0) {
  console.error('Static-first check failed:');
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.reason}`);
  }
  process.exit(1);
}

console.log(`Static-first check passed for ${routeFiles.length} routes.`);
