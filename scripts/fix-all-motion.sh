#!/bin/bash
# Fix all Framer Motion className issues by adding type assertion

find apps/web/components -name "*.tsx" -type f | while read file; do
  # Use sed to add type assertion for motion components with className
  # This is a simplified approach - we'll process each file
  
  python3 <<PYTHON
import re
import sys

with open("$file", "r") as f:
    content = f.read()

original = content

# Pattern to match motion.component({...className: value...})
# We need to extract className and spread it
pattern = r'(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*className:\s*([^,}]+))([^}]*)\}\s*\)'

def replace_match(match):
    component = match.group(1)
    before_classname = match.group(2)
    className_value = match.group(3).strip()
    after_classname = match.group(4)
    
    # Remove className from before_classname
    rest_before = re.sub(r'className:\s*[^,}]+', '', before_classname)
    rest_before = re.sub(r',\s*,', ',', rest_before).strip(',').strip()
    rest_after = after_classname.strip(',').strip()
    
    # Combine all props except className
    all_props = f"{rest_before}{',' if rest_before and rest_after else ''}{rest_after}".strip(',').strip()
    
    # Return with className spread
    return f"{component}({{{all_props}{',' if all_props else ''}...({{className: {className_value}}} as any)}})"
    
new_content = re.sub(pattern, replace_match, content, flags=re.MULTILINE)

if content != new_content:
    with open("$file", "w") as f:
        f.write(new_content)
    print(f"Fixed: $file")
PYTHON
done

echo "Done fixing Framer Motion className issues"
