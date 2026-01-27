"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import flags from "@/config/flags.gamify.json";
import { supabase } from "@/lib/supabase/client";

type State = {
  flags: typeof flags;
  level: number;
  xp: number;
  dailyGoal: number;
  streak: number;
  xpMultiplier: number;
};

const Ctx = createContext<State | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [xpMultiplier, setXpMultiplier] = useState<number>(1.0);
  const dailyGoal = 50;
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setXp(Number(localStorage.getItem("xp") || 0));
      setStreak(Number(localStorage.getItem("streak") || 0));
      loadSubscriptionTier();
    }
  }, []);
  
  async function loadSubscriptionTier() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {return;}
    
    const { data: tier } = await (supabase
      .from("subscription_tiers") as any)
      .select("xp_multiplier")
      .eq("user_id", user.id)
      .gte("expires_at", new Date().toISOString())
      .single();
    
    if (tier) {
      const tierData = tier as { xp_multiplier?: number | string | null };
      setXpMultiplier(Number(tierData.xp_multiplier) || 1.0);
    }
  }
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("xp", String(xp));
    }
  }, [xp]);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("streak", String(streak));
    }
  }, [streak]);
  
  const state = useMemo(() => ({ 
    flags, 
    level: Math.floor(xp / 100) + 1, 
    xp, 
    dailyGoal, 
    streak,
    xpMultiplier 
  }), [xp, streak, xpMultiplier]);
  
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useGamify = () => {
  const v = useContext(Ctx);
  if(!v) {throw new Error("GamificationProvider missing");}
  return v;
};

export const awardXp = async (delta = 5) => {
  if (typeof window !== "undefined") {
    const cur = Number(localStorage.getItem("xp") || 0);
    const multiplier = Number(localStorage.getItem("xpMultiplier") || 1.0);
    const adjustedDelta = Math.floor(delta * multiplier);
    localStorage.setItem("xp", String(cur + adjustedDelta));
    
    // Update server-side XP
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await (supabase
        .from("profiles") as any)
        .select("total_xp")
        .eq("id", user.id)
        .single();
      
      const profileData = profile as { total_xp?: number | null } | null;
      const newTotalXP = (profileData?.total_xp || 0) + adjustedDelta;
      await (supabase.from("profiles") as any).update({ total_xp: newTotalXP }).eq("id", user.id);
    }
    
    window.dispatchEvent(new Event("storage"));
  }
};
