'use client';

import { Activity, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/src/integrations/supabase/client';

/**
 * Realtime Dashboard Component
 *
 * Client Component that subscribes to Supabase Realtime for live updates.
 * Displays real-time activity feed and metrics.
 */

export function RealtimeDashboard() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setConnectionError('Supabase is not configured');
      setIsConnected(false);
      return;
    }

    // Use the existing supabase client from the integration
    let channel: any = null;

    try {
      // Subscribe to activity_log changes
      channel = client
        .channel('activity-feed')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'activity_log',
          },
          (payload: any) => {
            if (payload.new) {
              setActivities(prev => [payload.new, ...prev].slice(0, 20));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'posts',
          },
          () => {
            // Post creation can trigger UI updates if needed
          }
        )
        .subscribe((status: any) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setConnectionError(null);
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            setConnectionError('Subscription error');
          } else if (status === 'TIMED_OUT') {
            setIsConnected(false);
            setConnectionError('Connection timeout');
          } else if (status === 'CLOSED') {
            setIsConnected(false);
          }
        });

      // Load initial activities
      client
        .from('activity_log')
        .select('activity_type, created_at, metadata, user_id')
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data, error }: { data: any; error: any }) => {
          if (!error && data) {
            setActivities(data);
          }
        });
    } catch (error) {
      setConnectionError('Failed to initialize realtime connection');
      setIsConnected(false);
    }

    // Cleanup on unmount
    return () => {
      if (channel) {
        client.removeChannel(channel);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5' />
          Live Activity Feed
          {isConnected ? (
            <Badge className='ml-auto' variant='default'>
              <Radio className='mr-1 h-3 w-3 animate-pulse' />
              Live
            </Badge>
          ) : (
            <Badge className='ml-auto' variant='secondary'>
              Offline
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time updates from Supabase Realtime subscriptions
          {connectionError && (
            <span className='mt-1 block text-xs text-destructive'>
              {connectionError}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className='max-h-96 space-y-2 overflow-y-auto'>
            {activities.map((activity, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted'
              >
                <div className='flex-1'>
                  <p className='text-sm font-medium capitalize'>
                    {activity.activity_type?.replace(/_/g, ' ') ||
                      'Unknown activity'}
                  </p>
                  {activity.metadata &&
                    typeof activity.metadata === 'object' && (
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {JSON.stringify(activity.metadata).substring(0, 100)}
                      </p>
                    )}
                </div>
                <div className='ml-4 text-right'>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </p>
                  {idx === 0 && isConnected && (
                    <Badge className='mt-1 text-xs' variant='outline'>
                      New
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='py-8 text-center text-sm text-muted-foreground'>
            {isConnected
              ? 'Waiting for activity... Real-time updates will appear here.'
              : 'Connecting to real-time feed...'}
          </p>
        )}

        {!isConnected && !connectionError && (
          <div className='mt-4 text-center'>
            <p className='text-xs text-muted-foreground'>
              Establishing real-time connection...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
