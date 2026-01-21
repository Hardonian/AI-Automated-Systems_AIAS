"use client";
import { useCallback, useEffect, useState } from "react";

import ChallengeCard from "@/components/gamification/ChallengeCard";
import { supabase } from "@/lib/supabase/client";
import { logger } from "@/lib/utils/logger";

interface ChallengeRequirements {
  min_level?: number;
  required_actions?: string[];
  metadata?: Record<string, unknown>;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  challenge_type: string;
  start_date: string;
  end_date: string;
  xp_reward: number;
  requirements: ChallengeRequirements | null;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filter, setFilter] = useState<"all" | "weekly" | "monthly" | "seasonal">("all");

  const loadChallenges = useCallback(async () => {
    let query = supabase.from("challenges").select("*").order("created_at", { ascending: false });
    
    if (filter !== "all") {
      query = query.eq("challenge_type", filter);
    }
    
    const { data } = await query;
    if (data) {setChallenges(data);}
  }, [filter]);

  useEffect(() => {
    void loadChallenges().catch((error) => {
      logger.error("Failed to load challenges", error instanceof Error ? error : new Error(String(error)));
    });
  }, [loadChallenges]);

  const active = challenges.filter(c => new Date(c.end_date) > new Date());
  const upcoming = challenges.filter(c => new Date(c.start_date) > new Date());
  const past = challenges.filter(c => new Date(c.end_date) <= new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <div className="flex gap-2">
          {(["all", "weekly", "monthly", "seasonal"] as const).map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filter === f ? "bg-primary text-primary-fg" : "bg-muted"
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {active.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Active Challenges</div>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Upcoming Challenges</div>
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold">Past Challenges</div>
          <div className="grid gap-4 md:grid-cols-2">
            {past.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {challenges.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No challenges found</div>
      )}
    </div>
  );
}
