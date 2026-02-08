'use client';
import { useEffect, useState } from 'react';

import SuggestionsDrawer from '@/components/agent/SuggestionsDrawer';
import { supabase } from '@/lib/supabase/client';

export default function AgentProvider() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user) {
        setUserId(user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!userId) {
    return null;
  }

  return <SuggestionsDrawer userId={userId} />;
}
