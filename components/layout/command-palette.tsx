"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Cpu,
  Calculator,
  LayoutDashboard,
  ShieldAlert,
  Sliders,
  FileCode,
  Briefcase,
  Layers,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  HelpCircle,
  BarChart3,
  X,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CommandItem {
  id: string;
  title: string;
  description: string;
  category:
    | "Tools"
    | "Services"
    | "Blueprints"
    | "Case Studies"
    | "Architecture"
    | "Company";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  keywords?: string[];
}

const COMMAND_ITEMS: CommandItem[] = [
  // Interactive Tools
  {
    id: "tool-hub",
    title: "Quick Tools Command Center",
    description:
      "Explore all self-serve simulators, ROI calculators, diagnostics, and policy studios.",
    category: "Tools",
    href: "/tools",
    icon: Wrench,
    badge: "Hub",
    keywords: [
      "tools",
      "hub",
      "directory",
      "calculators",
      "simulators",
      "diagnostics",
    ],
  },
  {
    id: "tool-policy-studio",
    title: "Policy & Guardrail Studio",
    description:
      "Test deterministic boundary rules, PII masking, and confidence escalation gates.",
    category: "Tools",
    href: "/tools/policy-studio",
    icon: ShieldAlert,
    badge: "Interactive",
    keywords: [
      "policy",
      "guardrail",
      "zod",
      "schema",
      "pii",
      "studio",
      "bounds",
    ],
  },
  {
    id: "tool-sim",
    title: "Automation Engine Simulator",
    description:
      "Simulate deterministic policy gates, model orchestration, and telemetry guardrails.",
    category: "Tools",
    href: "/automation-demo",
    icon: Cpu,
    badge: "Interactive",
    keywords: [
      "simulator",
      "engine",
      "guardrails",
      "telemetry",
      "failover",
      "demo",
    ],
  },
  {
    id: "tool-dash",
    title: "Operations & Workload Dashboard",
    description:
      "Client control-plane for active agent fleets, evaluation benchmarks, and runbooks.",
    category: "Tools",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "Control Plane",
    keywords: ["dashboard", "metrics", "fleets", "sla", "canary", "workload"],
  },
  {
    id: "tool-roi",
    title: "ROI & Efficiency Calculator",
    description:
      "Model annual cost savings, time reclaimed, and payback period from deterministic AI.",
    category: "Tools",
    href: "/roi-calculator",
    icon: Calculator,
    badge: "Modeler",
    keywords: ["roi", "calculator", "savings", "payback", "cost", "hours"],
  },
  {
    id: "tool-readiness",
    title: "Readiness & Maturity Scorecard",
    description:
      "Assess enterprise AI maturity across data readiness, governance, and architecture.",
    category: "Tools",
    href: "/readiness-checklist",
    icon: ShieldAlert,
    badge: "Assessment",
    keywords: [
      "scorecard",
      "readiness",
      "audit",
      "checklist",
      "assessment",
      "maturity",
    ],
  },
  {
    id: "tool-engagement",
    title: "Engagement Scope Estimator",
    description:
      "Calculate timeline, deliverables, and architecture team composition for projects.",
    category: "Tools",
    href: "/engagement-simulator",
    icon: Sliders,
    badge: "Planner",
    keywords: ["engagement", "scope", "sprint", "deliverables", "timeline"],
  },
  {
    id: "tool-book",
    title: "Book Architecture Diagnostic",
    description:
      "Schedule a 30-minute diagnostic session with an AIAS systems architect.",
    category: "Tools",
    href: "/book",
    icon: Calendar,
    badge: "Booking",
    keywords: ["book", "schedule", "diagnostic", "call", "consultation"],
  },

  // Services & Consultancy
  {
    id: "srv-hire",
    title: "Hire AIAS to Build & Automate",
    description:
      "Hire our systems architects for bespoke automation builds, stabilization sprints, and modernization.",
    category: "Services",
    href: "/hire",
    icon: Cpu,
    badge: "Hire Us",
    keywords: [
      "hire",
      "consultancy",
      "build",
      "bespoke",
      "custom",
      "stabilize",
      "engineer",
    ],
  },
  {
    id: "srv-catalog",
    title: "Hardonia Store & Product Catalog",
    description:
      "Browse ready-to-deploy software packages, workflow packs, and Hardonia ecosystem software.",
    category: "Services",
    href: "/catalog",
    icon: ShoppingBag,
    badge: "Catalog",
    keywords: [
      "catalog",
      "store",
      "hardonia",
      "products",
      "software",
      "modules",
      "packages",
    ],
  },
  {
    id: "srv-all",
    title: "All Services & Engagement Models",
    description:
      "Explore Clarity Audits, Stabilization Sprints, Governance, and Advisory programs.",
    category: "Services",
    href: "/services",
    icon: Briefcase,
    keywords: ["services", "offerings", "consultancy", "audit", "sprint"],
  },
  {
    id: "srv-app-ai",
    title: "App & AI Systems",
    description:
      "Integration of LLMs and deterministic workflows directly into client web apps.",
    category: "Services",
    href: "/services/app-ai-systems",
    icon: Sparkles,
    keywords: ["apps", "web", "integration", "fullstack", "llm"],
  },
  {
    id: "srv-web-auto",
    title: "Automation Web Systems",
    description:
      "Multi-system back-office and web automation fabrics with strict governance.",
    category: "Services",
    href: "/services/automation-web",
    icon: Layers,
    keywords: ["web", "automation", "backoffice", "pipeda", "fabric"],
  },

  // Blueprints
  {
    id: "bp-all",
    title: "Blueprint Library",
    description:
      "Open implementation blueprints for deterministic workflows and governance.",
    category: "Blueprints",
    href: "/blueprints",
    icon: FileCode,
    keywords: ["blueprints", "templates", "specs", "architecture"],
  },
  {
    id: "bp-intake",
    title: "Governed Intake Router",
    description:
      "Deterministic schema validation, context scoring, and routing runbook.",
    category: "Blueprints",
    href: "/blueprints/governed-intake-router",
    icon: FileCode,
    badge: "Spec",
    keywords: ["intake", "router", "schema", "zod", "routing"],
  },
  {
    id: "bp-fabric",
    title: "Execution Fabric Control Plane",
    description:
      "High-availability execution fabric with telemetry, fallback, and canary release.",
    category: "Blueprints",
    href: "/blueprints/execution-fabric-control-plane",
    icon: FileCode,
    badge: "Spec",
    keywords: ["fabric", "control plane", "canary", "telemetry", "rollback"],
  },
  {
    id: "bp-pipeline",
    title: "Resilient Agent Release Pipeline",
    description:
      "Deterministic CI/CD verification and evaluation harness for agent fleets.",
    category: "Blueprints",
    href: "/blueprints/resilient-agent-release-pipeline",
    icon: FileCode,
    badge: "Spec",
    keywords: ["release", "pipeline", "eval", "harness", "ci/cd"],
  },

  // Case Studies
  {
    id: "cs-all",
    title: "Case Studies Index",
    description:
      "Production proof, measured metrics, and before/after transformation logs.",
    category: "Case Studies",
    href: "/case-studies",
    icon: BookOpen,
    keywords: ["case studies", "proof", "results", "clients", "metrics"],
  },
  {
    id: "cs-reach",
    title: "Case Study: REACH Systems",
    description:
      "High-throughput lead qualification with deterministic governance.",
    category: "Case Studies",
    href: "/case-studies/reach",
    icon: BookOpen,
    keywords: ["reach", "lead qualification", "crm", "automation"],
  },
  {
    id: "cs-zeo",
    title: "Case Study: ZEO Intelligence",
    description:
      "Automated invoice reconciliation and financial ledger audit trail.",
    category: "Case Studies",
    href: "/case-studies/zeo",
    icon: BookOpen,
    keywords: ["zeo", "invoice", "financial", "reconciliation"],
  },
  {
    id: "cs-settler",
    title: "Case Study: Settler Group",
    description:
      "Customer ops triage with SLA countdown and engineer signoff gates.",
    category: "Case Studies",
    href: "/case-studies/settler",
    icon: BookOpen,
    keywords: ["settler", "support", "sla", "triage"],
  },

  // Architecture & Methodology
  {
    id: "arch-framework",
    title: "Systems Framework",
    description:
      "The architectural boundary between deterministic controls and probabilistic AI.",
    category: "Architecture",
    href: "/framework",
    icon: Layers,
    keywords: ["framework", "determinism", "principles", "boundary"],
  },
  {
    id: "arch-how",
    title: "How It Works",
    description:
      "Detailed 4-stage operational lifecycle from discovery to continuous telemetry.",
    category: "Architecture",
    href: "/how-it-works",
    icon: Cpu,
    keywords: ["how it works", "lifecycle", "stages", "architecture"],
  },
  {
    id: "arch-process",
    title: "Engagement Process",
    description:
      "Structured 4-step delivery model: Discover, Pilot, Hardening, Enablement.",
    category: "Architecture",
    href: "/process",
    icon: Sliders,
    keywords: ["process", "methodology", "sprints", "delivery"],
  },
  {
    id: "arch-cert",
    title: "Certification Path",
    description:
      "Open standard for deterministic AI operations and operator verification.",
    category: "Architecture",
    href: "/certification",
    icon: ShieldAlert,
    keywords: ["certification", "badges", "standards", "verification"],
  },
  {
    id: "arch-metrics",
    title: "Operational Metrics & Proof",
    description:
      "Live performance metrics, latency budgets, and cost benchmarks across client systems.",
    category: "Architecture",
    href: "/metrics",
    icon: BarChart3,
    keywords: ["metrics", "benchmarks", "p95", "telemetry", "proof"],
  },
  {
    id: "arch-why-no",
    title: "Why We Say No",
    description:
      "Our criteria for rejecting unviable, brittle, or un-governed AI project requests.",
    category: "Architecture",
    href: "/why-we-say-no",
    icon: HelpCircle,
    keywords: ["say no", "fit", "criteria", "governance", "boundaries"],
  },

  // Company & Resources
  {
    id: "co-about",
    title: "About AIAS",
    description:
      "Canadian systems consultancy turning brittle AI into production-grade automation.",
    category: "Company",
    href: "/about",
    icon: Briefcase,
    keywords: ["about", "team", "canada", "leadership"],
  },
  {
    id: "co-blog",
    title: "Engineering & Systems Blog",
    description:
      "Deep dives on systems thinking, deterministic architectures, and AI scale.",
    category: "Company",
    href: "/blog",
    icon: BookOpen,
    keywords: ["blog", "articles", "systems thinking", "insights"],
  },
  {
    id: "co-build-log",
    title: "Public Build Log",
    description:
      "Weekly transparency ledger of shipped updates, experiments, and architectural decisions.",
    category: "Company",
    href: "/build-log",
    icon: FileCode,
    keywords: ["build log", "changelog", "updates", "ledger"],
  },
  {
    id: "co-faq",
    title: "Frequently Asked Questions",
    description:
      "Common questions regarding pricing, data residency, sovereignty, and SLAs.",
    category: "Company",
    href: "/faq",
    icon: HelpCircle,
    keywords: ["faq", "questions", "pricing", "contracts", "support"],
  },
  {
    id: "co-contact",
    title: "Contact & Stack Intake",
    description:
      "Submit an architecture brief or connect with our engineering team directly.",
    category: "Company",
    href: "/contact",
    icon: ArrowRight,
    keywords: ["contact", "email", "inquiries", "intake"],
  },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return COMMAND_ITEMS;
    }
    const cleanQuery = query.toLowerCase().trim();
    return COMMAND_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description.toLowerCase().includes(cleanQuery);
      const matchCategory = item.category.toLowerCase().includes(cleanQuery);
      const matchKeywords = item.keywords?.some((k) =>
        k.toLowerCase().includes(cleanQuery),
      );
      return matchTitle || matchDesc || matchCategory || matchKeywords;
    });
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) =>
          (prev - 1 + (filteredItems.length || 1)) %
          (filteredItems.length || 1),
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  return (
    <>
      {/* Header Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 rounded-none border-2 border-border bg-card px-3 py-1.5 font-mono text-xs font-bold uppercase text-muted-foreground transition-all hover:border-primary hover:text-foreground cursor-pointer"
        aria-label="Open command palette search"
        data-testid="command-palette-trigger"
      >
        <Search className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-none border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground group-hover:border-primary sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl rounded-none border-2 border-primary bg-background p-0 shadow-2xl overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Platform Command Search</DialogTitle>
          </DialogHeader>

          {/* Search Header Bar */}
          <div className="flex items-center border-b-2 border-border bg-card px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownInInput}
              placeholder="Search tools, blueprints, services, docs, case studies..."
              className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedIndex(0);
                }}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-border/40">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-mono text-sm font-bold uppercase text-muted-foreground">
                  No matching architecture items found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try searching for &quot;simulator&quot;,
                  &quot;blueprints&quot;, &quot;dashboard&quot;, or
                  &quot;governance&quot;.
                </p>
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 transition-colors cursor-pointer border-l-2 ${
                      isSelected
                        ? "border-l-primary bg-primary/10 text-foreground"
                        : "border-l-transparent hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center border transition-colors mt-0.5 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-primary"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-bold uppercase tracking-wide text-foreground truncate">
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 border border-primary/40 bg-primary/10 text-primary">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border bg-muted/60 text-muted-foreground">
                        {item.category}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 transition-transform ${
                          isSelected
                            ? "text-primary translate-x-1"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Keyboard Hints */}
          <div className="flex items-center justify-between border-t-2 border-border bg-card px-4 py-2 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="border border-border bg-muted px-1">↑</kbd>
                <kbd className="border border-border bg-muted px-1">↓</kbd> to
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border border-border bg-muted px-1">↵</kbd> to
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border border-border bg-muted px-1">esc</kbd> to
                close
              </span>
            </div>
            <span className="font-bold text-primary">
              {filteredItems.length} available paths
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
