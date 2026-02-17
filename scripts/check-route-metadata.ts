import { readFileSync } from 'node:fs';

const routeAllowlist = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/blog/page.tsx',
  'app/case-studies/page.tsx',
  'app/contact/page.tsx',
  'app/dashboard/page.tsx',
  'app/pricing/page.tsx',
  'app/privacy/page.tsx',
  'app/process/page.tsx',
  'app/services/page.tsx',
  'app/terms/page.tsx',
  'app/work/page.tsx',
  'app/blog/10-automation-workflows-save-time/page.tsx',
  'app/blog/[slug]/page.tsx',
];

const failures: string[] = [];

for (const routeFile of routeAllowlist) {
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
  console.error('Missing metadata exports in route allowlist:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Metadata check passed for ${routeAllowlist.length} route files.`);
