// [STAKE+TRUST:BEGIN:status_page]
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { logger } from '@/lib/logging/structured-logger';
interface StatusItem {
  service: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message?: string;
}

export default function Status() {
  const [status, setStatus] = useState<StatusItem[]>([
    { service: 'API', status: 'operational' },
    { service: 'Database', status: 'operational' },
    { service: 'Authentication', status: 'operational' },
    { service: 'Storage', status: 'operational' },
  ]);

  useEffect(() => {
    // Fetch real status from monitoring API
    async function fetchStatus() {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          if (data.services) {
            setStatus(data.services);
          }
        }
      } catch (error) {
        logger.error(
          'Failed to fetch status',
          error instanceof Error ? error : new Error(String(error)),
          {
            component: 'StatusPage',
            action: 'fetchStatus',
          }
        );
      }
    }

    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'operational':
        return 'text-green-600 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'outage':
        return 'text-red-600 dark:text-red-400';
      case 'maintenance':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Outage';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='container space-y-6 py-8'>
      <div>
        <h1 className='text-3xl font-bold'>Status & Uptime</h1>
        <p className='mt-2 text-muted-foreground'>
          Real-time information about system health and incidents.
        </p>
      </div>

      <div className='rounded-lg border p-6'>
        <div className='mb-4 flex items-center gap-2'>
          <span className='text-2xl text-green-600 dark:text-green-400'>●</span>
          <h2 className='text-xl font-semibold'>All Systems Operational</h2>
        </div>
        <p className='text-sm text-muted-foreground'>
          All services are running normally. No incidents reported.
        </p>
      </div>

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Service Status</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {status.map((item, idx) => (
            <div key={idx} className='rounded-lg border p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='font-semibold'>{item.service}</span>
                <span className={getStatusColor(item.status)}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              {item.message && (
                <p className='text-sm text-muted-foreground'>{item.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8 rounded-lg bg-muted p-6'>
        <h2 className='mb-4 text-xl font-semibold'>Incident Communication</h2>
        <p className='mb-4 text-sm text-muted-foreground'>
          We communicate incidents and maintenance windows through:
        </p>
        <ul className='list-disc space-y-2 pl-6 text-sm'>
          <li>This status page</li>
          <li>Email notifications (for subscribed users)</li>
          <li>
            <Link
              className='text-primary hover:underline'
              href='/docs/trust/STATUS.md'
            >
              Incident communication policy
            </Link>
          </li>
        </ul>
        <p className='mt-4 text-sm text-muted-foreground'>
          For incident reporting, contact:{' '}
          <a
            className='text-primary hover:underline'
            href='mailto:support@example.com'
          >
            support@example.com
          </a>
        </p>
      </div>

      <div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20'>
        <p className='text-sm'>
          <strong>Note:</strong> Status page shows current system health. For
          detailed incident tracking, contact support.
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:status_page]
