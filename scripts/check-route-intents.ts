import { ROUTE_MANIFEST } from "../lib/seo/route-manifest";
import { ROUTE_INTENTS } from "../lib/seo/route-intents";

const failures: string[] = [];
const manifestPaths = new Set(ROUTE_MANIFEST.map((entry) => entry.path));
const assigned = new Map<string, string>();

for (const intent of ROUTE_INTENTS) {
  if (!intent.buyerQuestion.trim())
    failures.push(`${intent.id}: buyer question missing`);
  if (!manifestPaths.has(intent.owner))
    failures.push(
      `${intent.id}: owner ${intent.owner} is not in route manifest`,
    );
  if (!intent.conversion.startsWith("/"))
    failures.push(`${intent.id}: conversion must be internal`);

  for (const path of [intent.owner, ...intent.supporting]) {
    if (!manifestPaths.has(path))
      failures.push(`${intent.id}: ${path} is not in route manifest`);
    const existing = assigned.get(path);
    if (existing)
      failures.push(`${path}: assigned to both ${existing} and ${intent.id}`);
    assigned.set(path, intent.id);
  }
}

if (failures.length > 0) {
  console.error("Route-intent check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Route-intent check passed for ${ROUTE_INTENTS.length} buyer intents and ${assigned.size} governed routes.`,
);
