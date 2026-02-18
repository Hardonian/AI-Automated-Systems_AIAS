#!/usr/bin/env tsx
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { CANONICAL_TAGLINES, MESSAGING_CONTRACT, TAGLINE_TITLE_TEMPLATE } from '../content/constants';

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'components'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.mdx']);

const bannedPhraseChecks = [
  {
    name: 'chatbot-dismissive framing',
    pattern: /stop\s+playing\s+with\s+chatbots/i,
    guidance: 'Use contract-approved transition language for experimentation to production messaging.',
  },
  {
    name: 'autonomy overclaim',
    pattern: /\b(?:fully\s+autonomous|zero\s+oversight)\b/i,
    guidance: 'Avoid absolute outcome claims; emphasize governed, measurable delivery.',
  },
] as const;

const inconsistentTermChecks = [
  {
    name: 'non-canonical service terminology',
    pattern: /\bAI\s+consultancy\b/i,
    preferred: MESSAGING_CONTRACT.canonicalTerms.offering,
  },
  {
    name: 'non-canonical system terminology',
    pattern: /\bcustom\s+AI\s+platform\s+development\b/i,
    preferred: MESSAGING_CONTRACT.canonicalTerms.systemModel,
  },
] as const;

const conflictingClaimChecks = [
  {
    name: 'SOC2 certification claim',
    pattern: /\bSOC\s*2\b(?![-\s](?:aligned|ready))/i,
    guidance: 'Only claim SOC 2-aligned posture unless certification is formally completed and documented.',
  },
  {
    name: 'guaranteed outcome claim',
    pattern: /(?<!not\s)\bguaranteed\s+(?:results|outcomes|roi)\b/i,
    guidance: 'Avoid guaranteed outcome claims; use measurable targets and constraints instead.',
  },
] as const;

const canonicalTaglinePatterns = new Set(CANONICAL_TAGLINES.map(tagline => tagline.toLowerCase()));

type Hit = { file: string; line: number; rule: string; text: string; guidance: string };
const hits: Hit[] = [];

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

    const ext = fullPath.slice(fullPath.lastIndexOf('.'));
    if (!EXTENSIONS.has(ext)) {
      continue;
    }

    const relPath = relative(ROOT, fullPath);
    const lines = readFileSync(fullPath, 'utf8').split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const check of bannedPhraseChecks) {
        if (check.pattern.test(line)) {
          hits.push({
            file: relPath,
            line: index + 1,
            rule: `banned phrase: ${check.name}`,
            text: line.trim(),
            guidance: check.guidance,
          });
        }
      }

      for (const check of inconsistentTermChecks) {
        if (check.pattern.test(line)) {
          hits.push({
            file: relPath,
            line: index + 1,
            rule: `inconsistent term: ${check.name}`,
            text: line.trim(),
            guidance: `Prefer "${check.preferred}".`,
          });
        }
      }

      for (const check of conflictingClaimChecks) {
        if (check.pattern.test(line)) {
          hits.push({
            file: relPath,
            line: index + 1,
            rule: `conflicting claim: ${check.name}`,
            text: line.trim(),
            guidance: check.guidance,
          });
        }
      }

      const titleMatch = line.match(/AI Automated Systems\s*\|\s*([^'"`]+)/i);
      if (titleMatch) {
        const taglinePart = titleMatch[1].trim().toLowerCase();
        if (!canonicalTaglinePatterns.has(taglinePart)) {
          hits.push({
            file: relPath,
            line: index + 1,
            rule: 'conflicting tagline',
            text: line.trim(),
            guidance: `Use TAGLINE_TITLE_TEMPLATE (${TAGLINE_TITLE_TEMPLATE}).`,
          });
        }
      }
    });
  }
}

for (const dir of TARGET_DIRS) {
  walk(join(ROOT, dir));
}

if (hits.length > 0) {
  console.error('❌ Messaging audit failed:\n');
  for (const hit of hits) {
    console.error(`- ${hit.file}:${hit.line} [${hit.rule}]`);
    console.error(`  ${hit.text}`);
    console.error(`  ↳ ${hit.guidance}`);
  }
  process.exit(1);
}

console.log('✅ Messaging audit passed.');
console.log(`   Canonical positioning: ${MESSAGING_CONTRACT.positioningSentence}`);
console.log(`   Canonical tagline: ${TAGLINE_TITLE_TEMPLATE}`);
