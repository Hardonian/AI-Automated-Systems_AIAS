/**
 * Script to fix Framer Motion className type issues
 * Adds type assertion for className props
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('apps/web/components/**/*.tsx');

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let modified = false;

  // Pattern: motion.div, motion.span, etc. with className
  const motionPattern = /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse)\s*\([^)]*className:\s*[^,}]+)/g;
  
  // Replace motion components with className using spread operator
  content = content.replace(
    /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*className:\s*[^,}]+)([^}]*)\}/g,
    (match, component, beforeClassName, afterClassName) => {
      // Extract className value
      const classNameMatch = beforeClassName.match(/className:\s*([^,}]+)/);
      if (classNameMatch) {
        const classNameValue = classNameMatch[1].trim();
        const rest = beforeClassName.replace(/className:\s*[^,}]+/, '').replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');
        const allProps = rest ? `${rest}${rest && afterClassName ? ',' : ''}${afterClassName}` : afterClassName;
        return `${component}({${allProps}${allProps ? ', ' : ''}...({\n            className: ${classNameValue}\n          } as any)})`;
      }
      return match;
    }
  );

  if (content !== readFileSync(file, 'utf-8')) {
    writeFileSync(file, content, 'utf-8');
    console.log(`Fixed: ${file}`);
  }
}

console.log('Done fixing Framer Motion className issues');
