'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
              //
            </span>
            <span>AIAS</span>
          </Link>
        </motion.div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
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

          {/* Resources dropdown */}
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
                  className="group flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary focus:outline-none"
                >
                  RESOURCES
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="mt-2 w-56 rounded-none border-2 border-border bg-background p-0 shadow-card"
              >
                {siteContent.navigation.resources.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="rounded-none font-mono focus:bg-primary focus:text-primary-foreground cursor-pointer">
                    <Link
                      href={item.href}
                      className="block w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-foreground"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Button
              asChild
              className="ml-4 rounded-none border-2 border-primary bg-primary px-6 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
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

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
