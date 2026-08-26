"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Calculator,
  Workflow,
  CheckCircle2,
  Sliders,
  GitBranch,
  FileCode,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";

import { QuickToolItem } from "@/src/content/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ICON_MAP = {
  ShieldAlert,
  Calculator,
  Workflow,
  CheckCircle2,
  Sliders,
  GitBranch,
  FileCode,
};

const CATEGORIES = [
  "All",
  "Studios",
  "Simulators",
  "Calculators",
  "Diagnostics",
  "Builders",
] as const;

export function ToolsDirectoryClient({ tools }: { tools: QuickToolItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Interactive Mini-Scanner state
  const [scannerDomain, setScannerDomain] = useState<string>("operations");
  const [scannerBottleneck, setScannerBottleneck] =
    useState<string>("reliability");
  const [scannerResult, setScannerResult] = useState<{
    recommendedTool: string;
    href: string;
    rationale: string;
    confidence: number;
  } | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.outcome.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  const handleRunMiniScan = () => {
    if (scannerBottleneck === "reliability") {
      setScannerResult({
        recommendedTool: "Policy & Guardrail Studio",
        href: "/tools/policy-studio",
        rationale:
          "Your primary risk is uncontrolled or flaky execution. Hardening input/output boundary rules will prevent production hallucinations.",
        confidence: 98,
      });
    } else if (scannerBottleneck === "cost") {
      setScannerResult({
        recommendedTool: "Automation ROI Calculator",
        href: "/roi-calculator",
        rationale:
          "You need auditable financial validation. Modeling baseline labor burden will prove net returns to executive stakeholders.",
        confidence: 95,
      });
    } else if (scannerBottleneck === "governance") {
      setScannerResult({
        recommendedTool: "AI Governance Readiness Scorecard",
        href: "/readiness-checklist",
        rationale:
          "Your stack requires structural policy gates and audit logging before scaling to production.",
        confidence: 96,
      });
    } else {
      setScannerResult({
        recommendedTool: "Workflow Execution Simulator",
        href: "/automation-demo",
        rationale:
          "Test state transitions and deterministic exception paths in a sandbox environment.",
        confidence: 94,
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* Interactive Tool Matcher / Quick Diagnostic Banner */}
      <div className="border-2 border-primary bg-card p-6 md:p-8 shadow-[4px_4px_0px_0px_hsl(var(--primary))]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Diagnostic Tool Matcher</span>
            </div>
            <h2 className="mt-1 font-mono text-xl font-black uppercase text-foreground sm:text-2xl">
              Not Sure Where to Start? Match Your Problem in 2 Clicks
            </h2>
          </div>
          <Button
            onClick={handleRunMiniScan}
            className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            Compute Match
            <Zap className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-foreground mb-2">
              1. Select Your Operating Domain:
            </label>
            <select
              value={scannerDomain}
              onChange={(e) => setScannerDomain(e.target.value)}
              className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-xs font-bold uppercase text-foreground focus:border-primary focus:outline-none"
            >
              <option value="operations">Operations & Workflow Triage</option>
              <option value="ecommerce">E-Commerce & Order Fulfillment</option>
              <option value="finance">
                Finance, Invoicing & AP Reconciliation
              </option>
              <option value="support">
                Customer Support & Escalation Routing
              </option>
              <option value="engineering">
                Engineering & Multi-Agent Pipelines
              </option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase text-foreground mb-2">
              2. Identify Your Primary Challenge:
            </label>
            <select
              value={scannerBottleneck}
              onChange={(e) => setScannerBottleneck(e.target.value)}
              className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-xs font-bold uppercase text-foreground focus:border-primary focus:outline-none"
            >
              <option value="reliability">
                Flaky Agents / Hallucinations in Production
              </option>
              <option value="cost">
                Unclear Labor Savings & Automation ROI
              </option>
              <option value="governance">
                Missing Compliance, Auditing & Human Controls
              </option>
              <option value="architecture">
                Need to Model State Transitions in Sandbox
              </option>
            </select>
          </div>
        </div>

        {/* Scan Result */}
        <AnimatePresence>
          {scannerResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-2 border-border bg-surface-muted p-4 md:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="border border-primary bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-primary">
                      {scannerResult.confidence}% Match Confidence
                    </span>
                    <span className="font-mono text-xs font-bold text-muted-foreground uppercase">
                      Recommended Tool
                    </span>
                  </div>
                  <h3 className="mt-1 font-mono text-lg font-black uppercase text-foreground">
                    {scannerResult.recommendedTool}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-2xl">
                    {scannerResult.rationale}
                  </p>
                </div>
                <Button
                  asChild
                  className="rounded-none border-2 border-primary bg-primary px-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground flex-shrink-0"
                >
                  <Link href={scannerResult.href}>
                    Launch {scannerResult.recommendedTool}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Directory Controls: Search and Filter Chips */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b-2 border-border pb-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`border-2 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="SEARCH TOOLS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none border-2 border-border bg-background pl-9 font-mono text-xs uppercase tracking-wider focus:border-primary"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const Icon =
            ICON_MAP[tool.iconName as keyof typeof ICON_MAP] || Workflow;

          return (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`group flex flex-col justify-between border-2 bg-card p-6 transition-all hover:-translate-y-1 ${
                tool.featured
                  ? "border-primary shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
                  : "border-border shadow-card hover:border-foreground"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center border-2 ${
                      tool.featured
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface-muted text-foreground group-hover:border-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {tool.estimatedTime}
                    </span>
                    <span className="border border-border bg-surface-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 font-mono text-base font-black uppercase text-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>

                {/* Outcome */}
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Expected Outcome:
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">
                    {tool.outcome}
                  </p>
                </div>

                {/* Inputs / Outputs tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tool.inputs.slice(0, 2).map((inp) => (
                    <span
                      key={inp}
                      className="border border-border bg-surface-muted/60 px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground"
                    >
                      In: {inp}
                    </span>
                  ))}
                  {tool.outputs.slice(0, 1).map((out) => (
                    <span
                      key={out}
                      className="border border-border bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-primary font-bold"
                    >
                      Out: {out}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t-2 border-border/40">
                <Button
                  asChild
                  className="w-full rounded-none border-2 border-border bg-background font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <Link href={tool.href}>
                    Launch Tool
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="border-2 border-dashed border-border p-12 text-center">
          <p className="font-mono text-sm uppercase text-muted-foreground">
            No tools found matching your query.
          </p>
          <Button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            variant="outline"
            className="mt-4 rounded-none border-2 border-border font-mono text-xs uppercase"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
