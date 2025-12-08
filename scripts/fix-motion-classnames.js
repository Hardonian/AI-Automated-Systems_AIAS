/**
 * Script to fix all Framer Motion className type issues
 * Adds type assertion spread for className props
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixMotionClassNames() {
  const files = await glob('apps/web/components/**/*.tsx');
  let totalFixed = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Pattern: motion.component({...className: "value"...})
    // Replace with: motion.component({...} as any) and spread className
    const motionPattern = /(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*className:\s*([^,}]+))([^}]*)\}\s*\)/g;

    content = content.replace(motionPattern, (match, component, beforeClassName, classNameValue, afterClassName) => {
      modified = true;
      // Extract className value
      const className = classNameValue.trim();
      // Remove className from props
      const restBefore = beforeClassName.replace(/className:\s*[^,}]+/, '').replace(/,\s*,/g, ',').trim();
      const restAfter = afterClassName.trim();
      const allProps = [restBefore, restAfter].filter(Boolean).join(',').replace(/^,|,$/g, '').trim();
      
      // Reconstruct with className spread
      return `${component}({${allProps ? allProps + ',' : ''}...({className: ${className}} as any)})`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      totalFixed++;
      console.log(`Fixed: ${file}`);
    }
  }

  console.log(`\nFixed ${totalFixed} files`);
}

fixMotionClassNames().catch(console.error);
