'use client';
import { useState } from 'react';

import Leaderboard from '@/components/gamification/Leaderboard';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all_time'>(
    'weekly'
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Leaderboard</h1>
        <div className='flex gap-2'>
          {(['weekly', 'monthly', 'all_time'] as const).map(p => (
            <button
              key={p}
              className={`rounded-xl px-4 py-2 text-sm capitalize ${
                period === p ? 'text-primary-fg bg-primary' : 'bg-muted'
              }`}
              onClick={() => setPeriod(p)}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Leaderboard period={period} />
    </div>
  );
}
