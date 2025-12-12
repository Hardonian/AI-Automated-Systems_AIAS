"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          aria-controls="mobile-navigation" 
          aria-expanded={open} 
          aria-label="Open navigation menu"
          className="min-h-[44px] min-w-[44px]"
          size="sm"
          variant="ghost"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        aria-label="Mobile navigation" 
        className="w-64"
        id="mobile-navigation"
        side="right"
      >
        <nav 
          aria-label="Mobile navigation menu"
          className="flex flex-col gap-4 mt-8"
          role="navigation"
        >
          <Link 
            aria-label="Navigate to Services" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/services"
            onClick={() => setOpen(false)}
          >
            Services
          </Link>
          <Link 
            aria-label="Navigate to Settler Payment Platform" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/settler"
            onClick={() => setOpen(false)}
          >
            Settler
          </Link>
          <Link 
            aria-label="Navigate to Edge AI Accelerator Studio" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/edge-ai"
            onClick={() => setOpen(false)}
          >
            Edge AI
          </Link>
          <Link 
            aria-label="Navigate to Portfolio" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/portfolio"
            onClick={() => setOpen(false)}
          >
            Portfolio
          </Link>
          <Link 
            aria-label="Navigate to Showcase" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/showcase"
            onClick={() => setOpen(false)}
          >
            Our Builds
          </Link>
          <Link 
            aria-label="Navigate to Case Studies" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/case-studies"
            onClick={() => setOpen(false)}
          >
            Case Studies
          </Link>
          <Link 
            aria-label="Navigate to Platform Pricing" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/pricing"
            onClick={() => setOpen(false)}
          >
            Platform Pricing
          </Link>
          <Link 
            aria-label="Navigate to Features" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/features"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link 
            aria-label="Navigate to Systems Thinking" 
            className="text-lg font-medium hover:underline text-primary min-h-[44px] flex items-center" 
            href="/systems-thinking"
            onClick={() => setOpen(false)}
          >
            Systems Thinking
          </Link>
          <Link 
            aria-label="Navigate to Blog" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/blog"
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link 
            aria-label="Navigate to About" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/about"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link 
            aria-label="Navigate to Demo" 
            className="text-lg font-medium hover:underline min-h-[44px] flex items-center" 
            href="/demo"
            onClick={() => setOpen(false)}
          >
            Demo
          </Link>
          <div className="pt-4 border-t space-y-3">
            <Button asChild className="w-full min-h-[48px] font-bold text-base shadow-lg">
              <Link 
                aria-label="Start your 30-day free trial - no credit card required" 
                href="/signup"
                onClick={() => setOpen(false)}
              >
                Start Free Trial
              </Link>
            </Button>
            <Button asChild className="w-full min-h-[48px] font-semibold text-base" variant="outline">
              <Link 
                aria-label="Schedule a free strategy call" 
                href="/demo"
                onClick={() => setOpen(false)}
              >
                Schedule Call
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
