"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function HireScopingWizard() {
  const [industry, setIndustry] = useState<string>("ecommerce");
  const [bottleneck, setBottleneck] = useState<string>("triage");
  const [volume, setVolume] = useState<string>("mid");
  const [autonomyTier, setAutonomyTier] = useState<string>("gated");

  // Computed Proposal
  const getProposal = () => {
    if (bottleneck === "flaky") {
      return {
        track: "Stabilization & Hardening Sprint",
        timeline: "2 to 3 weeks",
        architecturePattern:
          "Deterministic Policy Wrapper + Retry Budget Matrix",
        coreDeliverable:
          "Zero-hallucination policy gates and incident recovery playbooks",
        idealEngagement:
          "Rapid 2-3 week remediation of existing agents to stop silent failures and protect production data.",
      };
    }

    if (bottleneck === "triage" && volume === "high") {
      return {
        track: "Full-Stack Deterministic Automation Build",
        timeline: "4 to 6 weeks",
        architecturePattern:
          "High-Throughput Intake Controller + Operator Console",
        coreDeliverable:
          "Turnkey ingestion and routing pipeline with sub-minute SLAs",
        idealEngagement:
          "Complete custom build replacing manual queue sorting with deterministic policy-gated triage.",
      };
    }

    if (bottleneck === "custom") {
      return {
        track: "Full-Stack Deterministic Automation Build",
        timeline: "6 to 8 weeks",
        architecturePattern:
          "Multi-Agent Orchestration Fabric + Private Connectors",
        coreDeliverable:
          "Custom bespoke intelligent operating system with full IP ownership",
        idealEngagement:
          "End-to-end bespoke system engineered for your proprietary business logic and legacy databases.",
      };
    }

    return {
      track: "AI Clarity Audit & Decision Mapping",
      timeline: "1 to 2 weeks",
      architecturePattern:
        "Decision Boundary Specification + Failure Mode Matrix",
      coreDeliverable:
        "Clear build-vs-kill decision brief and implementation roadmap",
      idealEngagement:
        "Comprehensive architectural scoping session to map high-ROI automation targets before investing build budget.",
    };
  };

  const proposal = getProposal();

  return (
    <div className="border-2 border-primary bg-card p-6 md:p-10 shadow-[6px_6px_0px_0px_hsl(var(--primary))]">
      <div className="border-b-2 border-border/60 pb-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-primary bg-primary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Architecture & Scope Estimator</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
          Generate an Instant Custom Build Scope
        </h2>
        <p className="mt-2 text-xs font-mono text-muted-foreground uppercase">
          Select your operational parameters to configure the recommended
          engineering blueprint.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Step Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Industry */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-foreground mb-2">
              1. Business Vertical:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "ecommerce", label: "E-Commerce & Retail" },
                { id: "operations", label: "Logistics & Ops" },
                { id: "finance", label: "FinTech & Invoicing" },
                { id: "saas", label: "B2B Software / SaaS" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setIndustry(item.id)}
                  className={`border-2 p-2.5 text-left font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    industry === item.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Bottleneck */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-foreground mb-2">
              2. Primary Engineering Challenge:
            </label>
            <select
              value={bottleneck}
              onChange={(e) => setBottleneck(e.target.value)}
              className="w-full border-2 border-border bg-background px-3 py-2.5 font-mono text-xs font-bold uppercase text-foreground focus:border-primary focus:outline-none"
            >
              <option value="triage">
                Manual Intake Triage & Queue Sorting (Too slow)
              </option>
              <option value="flaky">
                Flaky AI Agents / Production Hallucinations (Unreliable)
              </option>
              <option value="custom">
                Bespoke Intelligent System / New Platform Build (No
                off-the-shelf fit)
              </option>
              <option value="audit">
                Need Scoping & Feasibility Analysis (Decision roadmap)
              </option>
            </select>
          </div>

          {/* 3. Volume & Autonomy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-foreground mb-2">
                3. Monthly Volume:
              </label>
              <select
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-xs font-bold uppercase text-foreground focus:border-primary focus:outline-none"
              >
                <option value="low">&lt; 2,500 Actions/Mo</option>
                <option value="mid">2,500 - 25,000 Actions/Mo</option>
                <option value="high">25,000+ Actions/Mo</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-foreground mb-2">
                4. Governance Tier:
              </label>
              <select
                value={autonomyTier}
                onChange={(e) => setAutonomyTier(e.target.value)}
                className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-xs font-bold uppercase text-foreground focus:border-primary focus:outline-none"
              >
                <option value="gated">Policy-Gated Human Review</option>
                <option value="automated">Autonomous with Alerting</option>
                <option value="hybrid">Confidence Tiered Routing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generated Scope Preview */}
        <div className="lg:col-span-6 border-2 border-border bg-surface-muted p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tailored Scope Recommendation
              </span>
              <span className="border border-primary bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-black uppercase text-primary">
                {proposal.timeline}
              </span>
            </div>

            <div className="mt-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Recommended Engagement
              </p>
              <h3 className="mt-1 font-mono text-xl font-black uppercase text-foreground">
                {proposal.track}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {proposal.idealEngagement}
              </p>
            </div>

            <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
              <div className="flex items-start gap-2">
                <Layers className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                    Architecture Pattern:
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {proposal.architecturePattern}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                    Key Outcome Deliverable:
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {proposal.coreDeliverable}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-border">
            <Button
              asChild
              className="w-full rounded-none border-2 border-primary bg-primary py-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-transform"
            >
              <Link
                href="https://calendly.com/scottrmhardie"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Strategy Call with this Scope
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
