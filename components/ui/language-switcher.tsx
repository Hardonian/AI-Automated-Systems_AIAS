'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const currentLanguage =
    languages.find(lang => lang.code === currentLang) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={cn('min-h-[44px] min-w-[44px] gap-2', className)}
          aria-label='Change language'
        >
          <Globe className='h-4 w-4' aria-hidden='true' />
          <span className='hidden sm:inline'>
            {currentLanguage?.flag || ''}
          </span>
          <span className='hidden text-xs md:inline'>
            {currentLanguage?.label || ''}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[150px]'>
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              'min-h-[44px] cursor-pointer',
              currentLang === lang.code && 'bg-muted font-medium'
            )}
            aria-label={`Switch to ${lang.label}`}
          >
            <span className='mr-2'>{lang.flag}</span>
            <span>{lang.label}</span>
            {currentLang === lang.code && (
              <span className='ml-auto text-xs text-muted-foreground'>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
