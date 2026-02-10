'use client';
import { useState, useEffect } from 'react';

import { hapticTap } from './Haptics';

import { supabase } from '@/lib/supabase/client';

interface Notification {
  id: number;
  type: string;
  title: string;
  body?: string;
  link?: string;
  read_at?: string;
  created_at: string;
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          loadNotifications();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(
        data.filter((n: { read_at?: string | null }) => !n.read_at).length
      );
    }
  }

  async function markAsRead(id: number) {
    hapticTap();
    await (supabase.from('notifications') as any)
      .update({ read_at: new Date().toISOString() } as any)
      .eq('id', id);
    loadNotifications();
  }

  async function markAllAsRead() {
    hapticTap();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    await (supabase.from('notifications') as any)
      .update({ read_at: new Date().toISOString() } as any)
      .eq('user_id', user.id)
      .is('read_at', null);
    loadNotifications();
  }

  const unread = notifications.filter(n => !n.read_at);

  return (
    <div className='relative'>
      <button
        aria-label='Notifications'
        className='relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted'
        onClick={() => setOpen(!open)}
      >
        🔔
        {unreadCount > 0 && (
          <span className='text-primary-fg absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
          <div className='absolute right-0 top-12 z-50 max-h-96 w-80 space-y-2 overflow-y-auto rounded-2xl border bg-card p-4 shadow-lg'>
            <div className='mb-2 flex items-center justify-between'>
              <div className='text-sm font-semibold'>Notifications</div>
              {unread.length > 0 && (
                <button
                  className='text-xs text-muted-foreground hover:text-foreground'
                  onClick={markAllAsRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted-foreground'>
                No notifications
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`cursor-pointer rounded-xl border p-3 hover:bg-muted/50 ${
                    !notif.read_at ? 'border-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      window.location.href = notif.link;
                    }
                  }}
                >
                  <div className='text-sm font-semibold'>{notif.title}</div>
                  {notif.body && (
                    <div className='mt-1 text-xs text-muted-foreground'>
                      {notif.body}
                    </div>
                  )}
                  <div className='mt-1 text-xs text-muted-foreground'>
                    {new Date(notif.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
