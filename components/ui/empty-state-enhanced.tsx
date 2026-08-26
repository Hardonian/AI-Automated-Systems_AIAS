/**
 * Enhanced Empty State Component
 * Engaging empty states that guide users to action
 */

"use client";

import { LucideIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmptyStateEnhancedProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  illustration?: React.ReactNode;
}

export function EmptyStateEnhanced({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
}: EmptyStateEnhancedProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        {Icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        {illustration && <div className="mx-auto mb-4">{illustration}</div>}
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mx-auto max-w-md">
          {description}
        </CardDescription>
      </CardHeader>
      {(action || secondaryAction) && (
        <CardContent className="flex flex-col justify-center gap-2 sm:flex-row">
          {action && (
            <Button asChild>
              <Link href={action.href} onClick={action.onClick}>
                {action.label}
              </Link>
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Pre-configured empty state for workflows
 */
export function WorkflowsEmptyState() {
  return (
    <EmptyStateEnhanced
      action={{
        label: "Create Workflow",
        href: "/#workflow-sandbox",
      }}
      description="Create your first workflow to start automating your business processes. Workflows help you connect multiple agents and tools together."
      icon={Sparkles}
      secondaryAction={{
        label: "Explore Insights",
        href: "/blog",
      }}
      title="No workflows yet"
    />
  );
}
