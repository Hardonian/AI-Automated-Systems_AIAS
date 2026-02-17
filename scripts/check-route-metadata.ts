import { globSync, readFileSync } from 'node:fs';

const routeFiles = globSync('app/**/page.tsx', {
  ignore: ['app/**/_*.tsx'],
});

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
