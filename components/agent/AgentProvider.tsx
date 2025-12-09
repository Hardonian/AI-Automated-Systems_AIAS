"use client";
import { useEffect, useState } from "react";

import SuggestionsDrawer from "@/components/agent/SuggestionsDrawer";
import { supabase } from "@/lib/supabase/client";

export default function AgentProvider() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {setUserId(user.id);}
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!userId) {return null;}

  return <SuggestionsDrawer userId={userId} />;
}
