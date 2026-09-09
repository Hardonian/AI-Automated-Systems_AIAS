"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CommandPalette = dynamic(
  () =>
    import("@/components/layout/command-palette").then(
      (module) => module.CommandPalette,
    ),
  { ssr: false },
);
const MobileNav = dynamic(
  () =>
    import("@/components/layout/mobile-nav").then((module) => module.MobileNav),
  { ssr: false },
);
const SoundToggle = dynamic(
  () =>
    import("@/components/layout/sound-toggle").then(
      (module) => module.SoundToggle,
    ),
  { ssr: false },
);
const SprintAvailabilityHUD = dynamic(
  () =>
    import("@/components/layout/sprint-availability-hud").then(
      (module) => module.SprintAvailabilityHUD,
    ),
  { ssr: false },
);
const ThemeToggle = dynamic(
  () =>
    import("@/components/theme-toggle").then((module) => module.ThemeToggle),
  { ssr: false },
);

const RESOURCE_GROUPS = [
  {
    category: "Quick Tools & Simulators",
    items: [
      { label: "Tools Hub", href: "/tools" },
      { label: "Policy Studio", href: "/tools/policy-studio" },
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Readiness Scorecard", href: "/readiness-checklist" },
      { label: "Automation Simulator", href: "/automation-demo" },
      { label: "Workflow Builder", href: "/workflows" },
    ],
  },
  {
    category: "Consultancy & Catalog",
    items: [
      { label: "Hire Us to Build", href: "/hire" },
      { label: "Product Catalog", href: "/catalog" },
      { label: "Blueprints Library", href: "/blueprints" },
      { label: "Systems Framework", href: "/framework" },
      { label: "Build Log", href: "/build-log" },
      { label: "FAQ", href: "/faq" },
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
        <div>
          <Link
            aria-label="AI Automated Systems - Home"
            className="group flex items-center gap-3 text-lg font-black uppercase tracking-widest text-foreground hover:text-primary md:text-xl"
            href="/"
          >
            <span className="flex h-8 w-8 items-center justify-center border-2 border-border bg-black text-xs font-bold text-primary transition-colors group-hover:border-primary">
              {"//"}
            </span>
            <span>AIAS</span>
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 2xl:flex 2xl:gap-6"
          data-testid="header-primary-nav"
        >
          {siteContent.navigation.primary.map((item) => (
            <div key={item.href}>
              <Link
                aria-label={`Navigate to ${item.label}`}
                className="group relative flex items-center justify-center font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                href={item.href}
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* Resources & Tools Dropdown */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary focus:outline-none cursor-pointer">
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
                    {gIdx > 0 && (
                      <DropdownMenuSeparator className="my-1.5 border-border" />
                    )}
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
          </div>

          {/* Command Palette Search Trigger */}
          <CommandPalette />

          {/* Primary CTA */}
          <div>
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
          </div>

          <SoundToggle />
          <SprintAvailabilityHUD />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 2xl:hidden">
          <CommandPalette />
          <SoundToggle className="px-2" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
