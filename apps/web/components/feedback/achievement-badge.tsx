"use client";

import { Trophy, Star, Award, Zap } from "lucide-react";
import { Reveal, AnimatedCard } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

export type AchievementType = "milestone" | "first" | "streak" | "speed";

export interface AchievementBadgeProps {
  /**
   * Achievement type
   */
  type: AchievementType;
  /**
   * Achievement title
   */
  title: string;
  /**
   * Achievement description
   */
  description?: string;
  /**
   * Show celebration animation
   * @default true
   */
  celebrate?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

const achievementConfig: Record<AchievementType, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  milestone: { icon: Trophy, color: "text-yellow-600 dark:text-yellow-400" },
  first: { icon: Star, color: "text-blue-600 dark:text-blue-400" },
  streak: { icon: Zap, color: "text-orange-600 dark:text-orange-400" },
  speed: { icon: Award, color: "text-purple-600 dark:text-purple-400" },
};

/**
 * AchievementBadge - Achievement/milestone component
 * 
 * Displays achievements with tasteful celebration
 * Respects reduced motion
 */
export function AchievementBadge({
  type,
  title,
  description,
  celebrate = true,
  className,
}: AchievementBadgeProps) {
  const config = achievementConfig[type];
  const Icon = config.icon;

  return (
    <Reveal variant={celebrate ? "fadeInUp" : "fadeInUp"} delay={0.1}>
      <AnimatedCard variant="scaleIn" staggerDelay={0.1}>
        <div className={cn("p-4 border rounded-lg bg-gradient-to-br from-background to-muted/50", className)}>
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-full bg-muted", config.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-1">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Reveal>
  );
}
