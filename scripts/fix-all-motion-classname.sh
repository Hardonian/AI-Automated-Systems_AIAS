#!/bin/bash
# Fix all Framer Motion className type issues by adding type assertion

find apps/web/components -name "*.tsx" -type f | while read file; do
  # Use sed to add type assertion for motion components with className
  # Pattern: motion.div({...className: "..."...}) -> motion.div({...} as any)
  # This is a simplified approach - we'll use a more sophisticated method
  
  # For now, let's use a Python script for better regex handling
  python3 <<PYTHON
import re
import sys

with open("$file", "r") as f:
    content = f.read()

# Pattern to match motion.component({...className: value...})
# We'll wrap the entire props object with {...props, ...({className: value} as any)}
pattern = r'(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*className:\s*[^,}]+)([^}]*)\}\s*\)'

def replace_match(match):
    component = match.group(1)
    before_classname = match.group(2)
    after_classname = match.group(3)
    
    # Extract className value
    className_match = re.search(r'className:\s*([^,}]+)', before_classname)
    if not className_match:
        return match.group(0)
    
    className_value = className_match.group(1).strip()
    # Remove className from before_classname
    rest_before = re.sub(r'className:\s*[^,}]+', '', before_classname)
    rest_before = re.sub(r',\s*,', ',', rest_before)
    rest_before = rest_before.strip(',').strip()
    
    # Combine all props
    all_props = f"{rest_before}{',' if rest_before and after_classname else ''}{after_classname}".strip(',').strip()
    
    return f"{component}({{{all_props}{',' if all_props else ''}...({{\n            className: {className_value}\n          }} as any)}})"
    
new_content = re.sub(pattern, replace_match, content)

if content != new_content:
    with open("$file", "w") as f:
        f.write(new_content)
    print(f"Fixed: $file")
PYTHON
done

echo "Done fixing Framer Motion className issues"
