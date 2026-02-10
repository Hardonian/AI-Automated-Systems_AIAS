'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  GamificationProvider,
  useGamify,
} from '@/components/gamification/GamificationProvider';
import NotificationsCenter from '@/components/gamification/NotificationsCenter';
import OnboardingQuests from '@/components/gamification/OnboardingQuests';
import ProgressAnalytics from '@/components/gamification/ProgressAnalytics';
import ProgressRing from '@/components/gamification/ProgressRing';
import PushNotificationButton from '@/components/gamification/PushNotificationButton';
import QuestCard from '@/components/gamification/QuestCard';
import ReferralWidget from '@/components/gamification/ReferralWidget';
import StreakFlame from '@/components/gamification/StreakFlame';
import AvatarStack from '@/components/social/AvatarStack';
import ShareButton from '@/components/social/ShareButton';

const LiveVisitors = dynamic(
  () => import('@/components/integrations/LiveVisitors').then(m => m.default),
  { ssr: false }
);

function HubInner() {
  const { level, xp, dailyGoal, streak } = useGamify();
  const currentXp = xp % 100;
  const pct = Math.min(1, currentXp / dailyGoal);
  const [peers, setPeers] = useState<string[]>([]);
  useEffect(() => {
    setPeers([
      'https://i.pravatar.cc/64?img=1',
      'https://i.pravatar.cc/64?img=2',
      'https://i.pravatar.cc/64?img=3',
      'https://i.pravatar.cc/64?img=4',
      'https://i.pravatar.cc/64?img=5',
      'https://i.pravatar.cc/64?img=6',
    ]);
  }, []);
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Play Hub</h1>
        <div className='flex items-center gap-2'>
          <NotificationsCenter />
          <LiveVisitors />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
        <div className='flex flex-col items-center gap-2 rounded-2xl border p-4'>
          <ProgressRing value={pct} />
          <div className='text-sm'>
            Level {level} · {currentXp}/{dailyGoal} XP
          </div>
        </div>
        <div className='grid place-items-center rounded-2xl border p-4'>
          <StreakFlame days={streak} />
          <div className='mt-2 text-sm'>
            {streak ? `${streak}-day streak` : 'Start your streak'}
          </div>
        </div>
        <div className='rounded-2xl border p-4'>
          <div className='mb-2 text-sm font-semibold'>Peers active now</div>
          <AvatarStack urls={peers} />
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='space-y-3'>
          <div className='text-sm font-semibold'>Daily Quests</div>
          <QuestCard title='Complete one journal entry' xp={20} />
          <QuestCard title='Share a tip in community' xp={15} />
          <QuestCard title='Invite a friend' xp={25} />
        </div>

        <div className='space-y-3'>
          <div className='text-sm font-semibold'>Getting Started</div>
          <OnboardingQuests />
        </div>
      </div>

      <ReferralWidget />

      <ProgressAnalytics />

      <div className='flex flex-wrap gap-2'>
        <Link
          className='grid h-10 place-items-center rounded-xl bg-secondary px-4'
          href='/journal'
        >
          Open Journal
        </Link>
        <Link
          className='grid h-10 place-items-center rounded-xl bg-secondary px-4'
          href='/community'
        >
          Community
        </Link>
        <Link
          className='grid h-10 place-items-center rounded-xl bg-secondary px-4'
          href='/challenges'
        >
          Challenges
        </Link>
        <Link
          className='grid h-10 place-items-center rounded-xl bg-secondary px-4'
          href='/leaderboard'
        >
          Leaderboard
        </Link>
        <ShareButton />
        <PushNotificationButton />
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <GamificationProvider>
      <HubInner />
    </GamificationProvider>
  );
}
