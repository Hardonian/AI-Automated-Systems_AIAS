import { ROUTE_MANIFEST } from '@/lib/seo/route-manifest';

const failures: string[] = [];

const paths = ROUTE_MANIFEST.map(route => route.path);

if (paths[0] !== '/') {
  failures.push("ROUTE_MANIFEST must start with '/' entry.");
}

const indexablePaths = ROUTE_MANIFEST.filter(route => route.indexable !== false && route.path !== '/').map(route => route.path);
const expectedIndexableSorted = [...indexablePaths].sort((a, b) => a.localeCompare(b));
if (indexablePaths.join('|') !== expectedIndexableSorted.join('|')) {
  failures.push('Indexable ROUTE_MANIFEST paths must be alphabetically sorted after root (/).');
}

const nonIndexablePaths = ROUTE_MANIFEST.filter(route => route.indexable === false).map(route => route.path);
const trailingPaths = paths.slice(paths.length - nonIndexablePaths.length);
if (nonIndexablePaths.length && trailingPaths.join('|') !== nonIndexablePaths.join('|')) {
  failures.push('Non-indexable ROUTE_MANIFEST paths must be grouped at the end.');
}

const serviceIndexes = paths
  .map((path, index) => ({ path, index }))
  .filter(item => item.path.startsWith('/services'));

if (serviceIndexes.length > 0) {
  const first = serviceIndexes[0].index;
  const last = serviceIndexes[serviceIndexes.length - 1].index;
  const contiguous = paths.slice(first, last + 1).every(path => path.startsWith('/services'));

  if (!contiguous) {
    failures.push('All /services* routes must be grouped contiguously in ROUTE_MANIFEST.');
  }
}

const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index);
if (duplicatePaths.length) {
  failures.push(`Duplicate manifest path entries found: ${[...new Set(duplicatePaths)].join(', ')}`);
}

if (failures.length) {
  console.error('Route manifest validation failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Route manifest validation passed for ${ROUTE_MANIFEST.length} routes.`);
