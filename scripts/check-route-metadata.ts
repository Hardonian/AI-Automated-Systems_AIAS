import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

function getRouteFiles(dir: string): string[] {
  const routeFiles: string[] = [];

  function walk(currentDir: string): void {
    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name === 'page.tsx') {
        routeFiles.push(entryPath);
      }
    }
  }

  walk(dir);
  return routeFiles;
}

const routeFiles = getRouteFiles('app');

const failures: string[] = [];

for (const routeFile of routeFiles) {
  const source = readFileSync(routeFile, 'utf8');
  const hasExplicitMetadata =
    source.includes('generateSEOMetadata(') ||
    source.includes('export const metadata: Metadata') ||
    source.includes('export async function generateMetadata(');

  if (!hasExplicitMetadata) {
    failures.push(routeFile);
  }
}

if (failures.length > 0) {
  console.error('Missing metadata exports in routes:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Metadata check passed for ${routeFiles.length} route files.`);
