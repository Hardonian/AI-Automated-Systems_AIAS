'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { logger } from '@/lib/logging/structured-logger';

interface ComplianceStatus {
  timestamp: string;
  secrets: 'ok' | 'warning' | 'critical';
  licenses: {
    gpl: number;
    restricted: number;
  };
  tls: 'enforced' | 'partial' | 'missing';
  rls: 'enabled' | 'partial' | 'disabled';
  gdpr: 'pass' | 'warning' | 'fail';
  issues: number;
}

export default function ComplianceDashboardPage() {
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchCompliance();
    const interval = setInterval(() => {
      void fetchCompliance();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchCompliance() {
    try {
      const response = await fetch('/api/admin/compliance');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setCompliance(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error(
        'Failed to fetch compliance status',
        err instanceof Error ? err : new Error(String(err)),
        {
          component: 'CompliancePage',
          action: 'fetchStatus',
        }
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='text-center'>Loading compliance dashboard...</div>
      </div>
    );
  }

  if (error || !compliance) {
    return (
      <div className='container mx-auto p-6'>
        <Card className='border-red-500'>
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>{error || 'No data available'}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>
            Security & Compliance Dashboard
          </h1>
          <p className='mt-2 text-muted-foreground'>
            GDPR, SOC 2, ISO 27001 compliance status
          </p>
        </div>
        <div className='text-right'>
          <div className='text-sm text-muted-foreground'>
            Updated: {new Date(compliance.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Status</CardTitle>
          <CardDescription>Summary of all compliance checks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <StatusCard label='Secrets' status={compliance.secrets} />
            <StatusCard label='TLS Enforcement' status={compliance.tls} />
            <StatusCard label='Row Level Security' status={compliance.rls} />
            <StatusCard label='GDPR Compliance' status={compliance.gdpr} />
            <StatusCard
              label='License Issues'
              status={compliance.licenses.restricted > 0 ? 'warning' : 'ok'}
            />
            <StatusCard
              label='Total Issues'
              status={
                compliance.issues > 0
                  ? compliance.issues > 5
                    ? 'critical'
                    : 'warning'
                  : 'ok'
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Licenses */}
      <Card>
        <CardHeader>
          <CardTitle>License Compliance</CardTitle>
          <CardDescription>Package license analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg border p-4'>
              <div className='text-sm text-muted-foreground'>GPL Licenses</div>
              <div
                className={`mt-2 text-2xl font-bold ${compliance.licenses.gpl > 0 ? 'text-yellow-600' : 'text-green-600'}`}
              >
                {compliance.licenses.gpl}
              </div>
              {compliance.licenses.gpl > 0 && (
                <div className='mt-1 text-xs text-muted-foreground'>
                  May require open-sourcing
                </div>
              )}
            </div>
            <div className='rounded-lg border p-4'>
              <div className='text-sm text-muted-foreground'>
                Restricted Licenses
              </div>
              <div
                className={`mt-2 text-2xl font-bold ${compliance.licenses.restricted > 0 ? 'text-yellow-600' : 'text-green-600'}`}
              >
                {compliance.licenses.restricted}
              </div>
              {compliance.licenses.restricted > 0 && (
                <div className='mt-1 text-xs text-muted-foreground'>
                  Review license compatibility
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Summary */}
      {compliance.issues > 0 && (
        <Card className='border-yellow-500'>
          <CardHeader>
            <CardTitle>⚠️ Compliance Issues</CardTitle>
            <CardDescription>
              {compliance.issues} issue(s) require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Review the full security audit report for detailed information
              about each issue.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusCard({ label, status }: { label: string; status: string }) {
  const badgeClass =
    status === 'ok' ||
    status === 'pass' ||
    status === 'enabled' ||
    status === 'enforced'
      ? 'bg-green-100 text-green-800'
      : status === 'warning' || status === 'partial'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  return (
    <div className='rounded-lg border p-4'>
      <div className='mb-2 text-sm text-muted-foreground'>{label}</div>
      <span className={`rounded px-2 py-1 text-xs font-semibold ${badgeClass}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}
