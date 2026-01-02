"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface SocialProofData {
  recentSignups: number;
  activeUsers: number;
  workflowsCreated: number;
}

export function SocialProofBanner() {
  const [data, setData] = useState<SocialProofData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch real-time social proof data
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/social-proof");
        if (response.ok) {
          const json = await response.json();
          setData(json);
          setIsVisible(true);
        }
      } catch (error) {
        // Fallback to sample data
        setData({
          recentSignups: 127,
          activeUsers: 342,
          workflowsCreated: 1248,
        });
        setIsVisible(true);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !data) {
    return null;
  }

  return (
    <div
      className="border-b bg-gradient-to-r from-primary/5 via-background to-primary/5 py-2 px-4"
      role="region"
      aria-label="Social proof statistics"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-semibold">{data.recentSignups}+</span>
          <span className="text-muted-foreground">joined this week</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-semibold">{data.activeUsers}</span>
          <span className="text-muted-foreground">active users</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-semibold">{data.workflowsCreated.toLocaleString()}</span>
          <span className="text-muted-foreground">workflows created</span>
        </div>
        <Badge variant="secondary" className="animate-pulse">
          🔥 Trending
        </Badge>
      </div>
    </div>
  );
}
