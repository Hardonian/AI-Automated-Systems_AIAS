import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = path.resolve('out');

if (!existsSync(OUTPUT_DIR)) {
  console.error('Missing out/ directory. Run `pnpm build` before link checks.');
  process.exit(1);
}

// Recursive helper to get all html files
function getHtmlFiles(dir: string, base: string = ''): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const res = path.join(base, entry.name);
    if (entry.isDirectory()) {
      return getHtmlFiles(path.join(dir, entry.name), res);
    } else if (entry.name.endsWith('.html')) {
      return [res];
    }
    return [];
  });
  return files;
}

const htmlFiles = getHtmlFiles(OUTPUT_DIR);

const hrefPattern = /href=("([^"]+)"|'([^']+)')/g;
const failures: string[] = [];

const stripUrlNoise = (href: string) => href.split('#')[0]?.split('?')[0] ?? href;

for (const htmlFile of htmlFiles) {
  const absoluteHtmlFile = path.join(OUTPUT_DIR, htmlFile);
  const html = readFileSync(absoluteHtmlFile, 'utf8');
  const matches = html.matchAll(hrefPattern);

  for (const match of matches) {
    const href = match[2] || match[3] || '';

    if (!href || href.startsWith('http://') || href.startsWith('https://')) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (href === '#') continue;

    const cleanHref = stripUrlNoise(href);
    if (!cleanHref) continue;

    if (cleanHref.startsWith('/')) {
      const normalized = cleanHref.replace(/\/$/, '');
      const candidates = [
        normalized === '' || normalized === '/' ? '/index.html' : `${normalized}.html`,
        normalized === '' || normalized === '/' ? '/index.html' : `${normalized}/index.html`,
        cleanHref,
      ];
      const hasMatch = candidates.some(candidate => existsSync(path.join(OUTPUT_DIR, candidate)));
      if (!hasMatch) {
        failures.push(`${htmlFile} -> ${href}`);
      }
      continue;
    }

    const fromDir = path.dirname(absoluteHtmlFile);
    const relativeTarget = path.resolve(fromDir, cleanHref);
    if (!existsSync(relativeTarget)) {
      failures.push(`${htmlFile} -> ${href}`);
    }
  }
}

if (failures.length) {
  console.error('Broken internal links found:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Internal link check passed across ${htmlFiles.length} HTML files.`);
