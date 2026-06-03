'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export function Header() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-md"
      data-testid="header-nav-cluster"
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            aria-label="AI Automated Systems - Home"
            className="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight transition-opacity hover:opacity-80 md:text-xl"
            href="/"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">
              AI
            </span>
            <span>AIAS</span>
          </Link>
        </motion.div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
          data-testid="header-primary-nav"
        >
          {siteContent.navigation.primary.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                aria-label={`Navigate to ${item.label}`}
                className="group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                href={item.href}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100"
                />
              </Link>
            </motion.div>
          ))}

          {/* Resources dropdown */}
          <div ref={dropdownRef} className="relative">
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: siteContent.navigation.primary.length * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                className="flex min-h-[44px] items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                type="button"
              >
                Resources
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>

            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-card p-2 shadow-lg"
                >
                  {siteContent.navigation.resources.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      onClick={() => setResourcesOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Button
              asChild
              className="hero-cta-glow ml-3 min-h-[44px] font-semibold shadow-md"
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

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
