'use client';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, isHydrated } = useTheme();

  // During hydration, render with default moon icon
  // After hydration, the icon updates based on actual resolved theme
  const displayIcon = isHydrated && resolvedTheme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />;

  return (
    <Button
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      size='sm'
      variant='ghost'
      onClick={() => {
        if (theme === 'light') {
          setTheme('dark');
        } else if (theme === 'dark') {
          setTheme('system');
        } else {
          setTheme('light');
        }
      }}
    >
      {displayIcon}
    </Button>
  );
}
