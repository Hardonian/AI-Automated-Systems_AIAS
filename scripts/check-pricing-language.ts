#!/usr/bin/env tsx
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'components', 'src'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.mdx']);
const FORBIDDEN_PATTERNS = [
  /\bhourly\b/i,
  /\bper\s+hour\b/i,
  /\bday\s+rate\b/i,
  /\btoken\s+pricing\b/i,
  /\$\s*\/\s*token/i,
  /\bper\s+token\b/i,
  /\bllm\s+token\s+cost\b/i,
] as const;

const hits: Array<{ file: string; line: number; text: string }> = [];

function walk(dir: string): void {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.next') || entry.startsWith('node_modules') || entry.startsWith('.git')) {
      continue;
    }

    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!EXTENSIONS.has(fullPath.slice(fullPath.lastIndexOf('.')))) {
      continue;
    }

    const relPath = relative(ROOT, fullPath);
    const content = readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (FORBIDDEN_PATTERNS.some(pattern => pattern.test(line))) {
        hits.push({ file: relPath, line: index + 1, text: line.trim() });
      }
    });
  }
}

for (const dir of TARGET_DIRS) {
  walk(join(ROOT, dir));
}

if (hits.length > 0) {
  console.error('❌ Forbidden pricing language detected in public-facing files:\n');
  for (const hit of hits) {
    console.error(`- ${hit.file}:${hit.line} -> ${hit.text}`);
  }
  process.exit(1);
}

console.log('✅ Pricing language check passed (no forbidden phrases found).');
