"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavProps {
  links: Array<{ href: string; label: string; external?: boolean }>;
  ctaLabel?: string;
  ctaHref?: string;
}

export function MobileNav({ links, ctaLabel, ctaHref }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]" id="mobile-nav">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium hover:text-primary transition-colors py-2"
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </Link>
          ))}
          {ctaLabel && ctaHref && (
            <Button asChild className="mt-4" size="lg">
              <Link href={ctaHref} onClick={() => setOpen(false)}>
                {ctaLabel}
              </Link>
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
