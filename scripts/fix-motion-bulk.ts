/**
 * Bulk fix all Framer Motion className issues
 */

import { readFileSync, writeFileSync } from 'fs';

import { globSync } from 'glob';

const files = globSync('apps/web/components/**/*.tsx');
const componentFiles = globSync('components/**/*.tsx');
const allFiles = [...files, ...componentFiles];

let totalFixed = 0;

for (const file of allFiles) {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  
  // Pattern: motion.component({...className: "value"...})
  // Replace with: motion.component({...} {...({className: "value"} as any)})
  const patterns = [
    // Pattern 1: className as last prop
    /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*),\s*className:\s*([^}]+)\}\s*\)/g,
    // Pattern 2: className in middle
    /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*),\s*className:\s*([^,}]+),([^}]*)\}\s*\)/g,
    // Pattern 3: className as first prop
    /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{\s*className:\s*([^,}]+),([^}]*)\}\s*\)/g,
  ];
  
  for (const pattern of patterns) {
    content = content.replace(pattern, (_match, component, before, className, after = '') => {
      const classNameValue = className.trim();
      const restBefore = (before || '').trim().replace(/,\s*$/, '');
      const restAfter = (after || '').trim().replace(/^,\s*/, '');
      const allProps = [restBefore, restAfter].filter(Boolean).join(',').trim();
      
      return `${component}({${allProps ? `${allProps  },` : ''}...({className: ${classNameValue}} as any)})`;
    });
  }
  
  // Also handle multiline patterns
  content = content.replace(
    /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*className:\s*([^}]+))([^}]*)\}\s*\)/gs,
    (_match, component, before, className, after) => {
      const classNameValue = className.trim();
      const restBefore = before.replace(/className:\s*[^}]+/, '').replace(/,\s*,/g, ',').trim().replace(/,\s*$/, '');
      const restAfter = after.trim().replace(/^,\s*/, '');
      const allProps = [restBefore, restAfter].filter(Boolean).join(',').trim();
      
      return `${component}({${allProps ? `${allProps  },` : ''}...({className: ${classNameValue}} as any)})`;
    }
  );
  
  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    totalFixed++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nFixed ${totalFixed} files`);
