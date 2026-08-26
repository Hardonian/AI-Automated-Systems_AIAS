'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { CommandPalette } from '@/components/layout/command-palette';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const RESOURCE_GROUPS = [
  {
    category: 'Quick Tools & Simulators',
    items: [
      { label: 'Tools Hub', href: '/tools' },
      { label: 'Policy Studio', href: '/tools/policy-studio' },
      { label: 'ROI Calculator', href: '/roi-calculator' },
      { label: 'Readiness Scorecard', href: '/readiness-checklist' },
      { label: 'Automation Simulator', href: '/automation-demo' },
      { label: 'Workflow Builder', href: '/workflows' },
    ],
  },
  {
    category: 'Consultancy & Catalog',
    items: [
      { label: 'Hire Us to Build', href: '/hire' },
      { label: 'Product Catalog', href: '/catalog' },
      { label: 'Blueprints Library', href: '/blueprints' },
      { label: 'Systems Framework', href: '/framework' },
      { label: 'Build Log', href: '/build-log' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b-2 border-border bg-background shadow-none"
      data-testid="header-nav-cluster"
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            aria-label="AI Automated Systems - Home"
            className="group flex items-center gap-3 text-lg font-black uppercase tracking-widest text-foreground hover:text-primary md:text-xl"
            href="/"
          >
            <span className="flex h-8 w-8 items-center justify-center border-2 border-border bg-black text-xs font-bold text-primary transition-colors group-hover:border-primary">
              {'//'}
            </span>
            <span>AIAS</span>
          </Link>
        </motion.div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 lg:gap-6 md:flex"
          data-testid="header-primary-nav"
        >
          {siteContent.navigation.primary.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
              }}
            >
              <Link
                aria-label={`Navigate to ${item.label}`}
                className="group relative flex items-center justify-center font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                href={item.href}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          {/* Resources & Tools Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: siteContent.navigation.primary.length * 0.05,
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="group flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary focus:outline-none cursor-pointer"
                >
                  RESOURCES
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="mt-2 w-80 rounded-none border-2 border-border bg-background p-2 shadow-card"
              >
                {RESOURCE_GROUPS.map((group, gIdx) => (
                  <div key={group.category}>
                    {gIdx > 0 && <DropdownMenuSeparator className="my-1.5 border-border" />}
                    <DropdownMenuLabel className="px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {group.category}
                    </DropdownMenuLabel>
                    <div className="grid grid-cols-2 gap-1">
                      {group.items.map((item) => (
                        <DropdownMenuItem
                          key={item.href}
                          asChild
                          className="rounded-none font-mono focus:bg-primary focus:text-primary-foreground cursor-pointer"
                        >
                          <Link
                            href={item.href}
                            className="block w-full px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:text-primary-foreground"
                          >
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Command Palette Search Trigger */}
          <CommandPalette />

          {/* Primary CTA */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Button
              asChild
              className="rounded-none border-2 border-primary bg-primary px-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              size="sm"
            >
              <Link
                aria-label={siteContent.positioning.primaryCTA.label}
                href={getPrimaryCtaHref()}
              >
                {siteContent.positioning.primaryCTA.label}
              </Link>
            </Button>
          </motion.div>

          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <CommandPalette />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

