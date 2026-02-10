'use client';
import { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase/client';

interface LeaderboardEntry {
  user_id: string;
  xp_earned: number;
  rank: number;
  profiles?: { display_name: string; avatar_url?: string };
}

export default function Leaderboard({
  period = 'weekly',
}: {
  period?: 'weekly' | 'monthly' | 'all_time';
}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  async function loadLeaderboard() {
    setLoading(true);
    let periodStart: string;

    if (period === 'weekly') {
      periodStart = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
    } else if (period === 'monthly') {
      periodStart = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
    } else {
      periodStart = '1970-01-01T00:00:00Z';
    }

    const { data } = await supabase
      .from('leaderboard_entries')
      .select('*, profiles(display_name, avatar_url)')
      .eq('period', period)
      .gte('period_start', periodStart)
      .order('xp_earned', { ascending: false })
      .limit(10);

    if (data) {
      const ranked = data.map(
        (entry: { [key: string]: unknown }, idx: number) => ({
          ...entry,
          rank: idx + 1,
        })
      ) as LeaderboardEntry[];
      setEntries(ranked);
    }
    setLoading(false);
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <button
          className={`rounded-lg px-3 py-1 text-sm ${period === 'weekly' ? 'text-primary-fg bg-primary' : 'bg-muted'}`}
          onClick={() => loadLeaderboard()}
        >
          Weekly
        </button>
        <button
          className={`rounded-lg px-3 py-1 text-sm ${period === 'monthly' ? 'text-primary-fg bg-primary' : 'bg-muted'}`}
          onClick={() => loadLeaderboard()}
        >
          Monthly
        </button>
        <button
          className={`rounded-lg px-3 py-1 text-sm ${period === 'all_time' ? 'text-primary-fg bg-primary' : 'bg-muted'}`}
          onClick={() => loadLeaderboard()}
        >
          All Time
        </button>
      </div>

      {loading ? (
        <div className='text-sm text-muted-foreground'>Loading...</div>
      ) : (
        <div className='space-y-2'>
          {entries.map(entry => (
            <div
              key={entry.user_id}
              className='flex items-center gap-3 rounded-xl border bg-card p-3'
            >
              <div className='w-8 text-center text-lg'>
                {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm'>
                {entry.profiles?.display_name?.[0] || 'U'}
              </div>
              <div className='flex-1'>
                <div className='text-sm font-semibold'>
                  {entry.profiles?.display_name || 'Anonymous'}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {entry.xp_earned} XP
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className='py-8 text-center text-sm text-muted-foreground'>
              No entries yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
