"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EnhancedCTAProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  benefits?: string[];
  urgency?: boolean;
  socialProof?: string;
  className?: string;
}

export function EnhancedCTA({
  title,
  description,
  primaryAction,
  secondaryAction,
  benefits,
  urgency,
  socialProof,
  className,
}: EnhancedCTAProps) {
  return (
    <Card className={`p-6 md:p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground text-lg">{description}</p>
          
          {benefits && benefits.length > 0 && (
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          {socialProof && (
            <p className="text-sm text-muted-foreground italic">{socialProof}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            size="lg"
            variant={primaryAction.variant || "default"}
            className="group"
          >
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
          {secondaryAction && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
