#!/usr/bin/env python3
"""
Comprehensive fix for all Framer Motion className issues
"""

import re
import os
from pathlib import Path

def fix_motion_classname(content):
    """Fix all motion.component className props by converting to spread operator"""
    
    # Pattern to match motion.component({...className: value...})
    # This handles multiline cases with DOTALL
    pattern = r'(motion\.(?:div|span|section|article|header|footer|nav|main|p|h[1-6]|button|a|ul|ol|li|form|input|textarea|select|label|img|svg|path|g|circle|rect|line|polyline|polygon|ellipse))\s*\(\s*\{([^}]*className:\s*([^}]+))([^}]*)\}\s*\)'
    
    def replace_func(match):
        component = match.group(1)
        before = match.group(2)
        className = match.group(3).strip()
        after = match.group(4)
        
        # Remove className from props - handle both comma before and after
        rest_before = re.sub(r',\s*className:\s*[^}]+', '', before, flags=re.DOTALL).strip(',').strip()
        rest_before = re.sub(r'className:\s*[^}]+,\s*', '', rest_before, flags=re.DOTALL).strip()
        rest_after = after.strip(',').strip()
        
        # Combine props
        all_props = f'{rest_before},{rest_after}'.strip(',').strip()
        
        # Return with className spread
        if all_props:
            return f'{component}({{{all_props},...({{className: {className}}} as any)}})'
        else:
            return f'{component}({{...({{className: {className}}} as any)}})'
    
    # Apply replacement with DOTALL to handle multiline
    new_content = re.sub(pattern, replace_func, content, flags=re.DOTALL | re.MULTILINE)
    
    return new_content

def process_directory(directory):
    """Process all .tsx files in directory"""
    fixed_count = 0
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and build directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', 'dist', 'out', '.git']]
        
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = fix_motion_classname(content)
                    
                    if content != new_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f'Fixed: {filepath}')
                        fixed_count += 1
                except Exception as e:
                    print(f'Error processing {filepath}: {e}')
    
    return fixed_count

if __name__ == '__main__':
    print('Fixing all Framer Motion className issues...\n')
    total = 0
    total += process_directory('components')
    total += process_directory('apps/web/components')
    print(f'\n✅ Fixed {total} files')
