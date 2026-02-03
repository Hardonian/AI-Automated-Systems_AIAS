'use client';

import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/lib/logging/structured-logger';

interface JobForgeStatus {
  enabled: boolean;
  executionEnabled: boolean;
  defaultTenantId: string | null;
  defaultProjectId: string | null;
  tenantProjectMap: Record<string, string>;
  sdkModule: string;
}

interface ActionResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  data?: Record<string, unknown>;
}

const defaultJson = JSON.stringify({ sample: true }, null, 2);

export default function JobForgeAdminPage() {
  const [adminToken, setAdminToken] = useState('');
  const [status, setStatus] = useState<JobForgeStatus | null>(null);
  const [statusResult, setStatusResult] = useState<ActionResult>({
    status: 'idle',
  });

  const [tenantId, setTenantId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [eventName, setEventName] = useState('event.sample');
  const [eventPayload, setEventPayload] = useState(defaultJson);
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const [moduleName, setModuleName] = useState('module.sample');
  const [moduleInputs, setModuleInputs] = useState(defaultJson);

  const [reportId, setReportId] = useState('');

  const [bundleId, setBundleId] = useState('');
  const [bundleReason, setBundleReason] = useState('manual_request');
  const [confirmExecution, setConfirmExecution] = useState(false);

  const [actionResult, setActionResult] = useState<ActionResult>({
    status: 'idle',
  });

  async function loadStatus() {
    setStatusResult({ status: 'loading' });
    try {
      const response = await fetch('/api/admin/jobforge', {
        headers: buildAuthHeaders(adminToken),
      });
      const data = (await response.json()) as JobForgeStatus & {
        error?: string;
      };
      if (!response.ok) {
        setStatusResult({
          status: 'error',
          message: data.error || 'Failed to load status',
        });
        return;
      }
      setStatus(data);
      setStatusResult({ status: 'success', message: 'Status loaded' });
    } catch (error) {
      logger.error(
        'Failed to load JobForge status',
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'JobForgeAdminPage',
          action: 'loadStatus',
        }
      );
      setStatusResult({
        status: 'error',
        message: 'Unexpected error loading status',
      });
    }
  }

  async function submitAction(action: string, body: Record<string, unknown>) {
    setActionResult({ status: 'loading' });
    try {
      const response = await fetch('/api/admin/jobforge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(adminToken),
        },
        body: JSON.stringify({ action, ...body }),
      });
      const data = (await response.json()) as Record<string, unknown> & {
        error?: string;
      };
      if (!response.ok) {
        setActionResult({
          status: 'error',
          message: data.error || 'Request failed',
        });
        return;
      }
      setActionResult({
        status: 'success',
        message: 'Request completed',
        data,
      });
    } catch (error) {
      logger.error(
        'JobForge admin action failed',
        error instanceof Error ? error : new Error(String(error)),
        {
          component: 'JobForgeAdminPage',
          action,
        }
      );
      setActionResult({
        status: 'error',
        message: 'Unexpected error running action',
      });
    }
  }

  function buildAuthHeaders(token: string): Record<string, string> {
    if (!token) {
      return {};
    }
    return { authorization: `Bearer ${token}` };
  }

  function parseJsonInput(value: string): Record<string, unknown> | null {
    if (!value.trim()) {
      return {};
    }
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      setActionResult({ status: 'error', message: 'Invalid JSON payload' });
      return null;
    }
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold'>JobForge Admin Console</h1>
        <p className='text-muted-foreground'>
          Submit events, run modules in dry-run mode, and inspect reports before
          gated bundle execution.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection & Status</CardTitle>
          <CardDescription>
            Provide a bearer token for admin endpoints and load the current
            JobForge integration status.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input
            placeholder='Admin bearer token'
            value={adminToken}
            onChange={event => setAdminToken(event.target.value)}
          />
          <div className='flex flex-wrap items-center gap-3'>
            <Button onClick={loadStatus} type='button'>
              Load Status
            </Button>
            {status && (
              <div className='flex flex-wrap items-center gap-2 text-sm'>
                <Badge variant={status.enabled ? 'default' : 'secondary'}>
                  Integration {status.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge
                  variant={status.executionEnabled ? 'default' : 'secondary'}
                >
                  Execution {status.executionEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge variant='outline'>SDK: {status.sdkModule}</Badge>
              </div>
            )}
          </div>
          {statusResult.status !== 'idle' && (
            <Alert
              variant={
                statusResult.status === 'error' ? 'destructive' : 'default'
              }
            >
              <AlertTitle>Status</AlertTitle>
              <AlertDescription>{statusResult.message}</AlertDescription>
            </Alert>
          )}
          {status && (
            <div className='text-sm text-muted-foreground'>
              <div>Default tenant: {status.defaultTenantId ?? '(none)'}</div>
              <div>Default project: {status.defaultProjectId ?? '(none)'}</div>
              <div>
                Tenant mapping:{' '}
                {Object.keys(status.tenantProjectMap || {}).length || 0}{' '}
                configured
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Event</CardTitle>
          <CardDescription>
            Enqueue a JobForge event with an explicit tenant/project mapping.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              placeholder='Tenant ID'
              value={tenantId}
              onChange={event => setTenantId(event.target.value)}
            />
            <Input
              placeholder='Project ID'
              value={projectId}
              onChange={event => setProjectId(event.target.value)}
            />
          </div>
          <Input
            placeholder='Event name'
            value={eventName}
            onChange={event => setEventName(event.target.value)}
          />
          <Textarea
            rows={6}
            value={eventPayload}
            onChange={event => setEventPayload(event.target.value)}
          />
          <Input
            placeholder='Idempotency key (optional)'
            value={idempotencyKey}
            onChange={event => setIdempotencyKey(event.target.value)}
          />
          <Button
            type='button'
            onClick={() => {
              const payloadValue = parseJsonInput(eventPayload);
              if (!payloadValue) {
                return;
              }
              submitAction('submitEvent', {
                tenantId,
                projectId,
                eventName,
                payload: payloadValue,
                idempotencyKey: idempotencyKey || undefined,
              });
            }}
          >
            Submit Event
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Run Module (Dry-Run)</CardTitle>
          <CardDescription>
            This always enqueues a dry-run module execution.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              placeholder='Tenant ID'
              value={tenantId}
              onChange={event => setTenantId(event.target.value)}
            />
            <Input
              placeholder='Project ID'
              value={projectId}
              onChange={event => setProjectId(event.target.value)}
            />
          </div>
          <Input
            placeholder='Module name'
            value={moduleName}
            onChange={event => setModuleName(event.target.value)}
          />
          <Textarea
            rows={6}
            value={moduleInputs}
            onChange={event => setModuleInputs(event.target.value)}
          />
          <Button
            type='button'
            onClick={() => {
              const inputsValue = parseJsonInput(moduleInputs);
              if (!inputsValue) {
                return;
              }
              submitAction('runModuleDryRun', {
                tenantId,
                projectId,
                moduleName,
                inputs: inputsValue,
              });
            }}
          >
            Enqueue Dry-Run
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Report</CardTitle>
          <CardDescription>
            Retrieve a JobForge report result by ID.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              placeholder='Tenant ID'
              value={tenantId}
              onChange={event => setTenantId(event.target.value)}
            />
            <Input
              placeholder='Project ID'
              value={projectId}
              onChange={event => setProjectId(event.target.value)}
            />
          </div>
          <Input
            placeholder='Report ID'
            value={reportId}
            onChange={event => setReportId(event.target.value)}
          />
          <Button
            type='button'
            onClick={() =>
              submitAction('viewReport', { tenantId, projectId, reportId })
            }
          >
            View Report
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Bundle Execution (Gated)</CardTitle>
          <CardDescription>
            Requires JOBFORGE_EXECUTION_ENABLED=1 and explicit confirmation
            before enqueueing a live execution.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Input
              placeholder='Tenant ID'
              value={tenantId}
              onChange={event => setTenantId(event.target.value)}
            />
            <Input
              placeholder='Project ID'
              value={projectId}
              onChange={event => setProjectId(event.target.value)}
            />
          </div>
          <Input
            placeholder='Bundle ID'
            value={bundleId}
            onChange={event => setBundleId(event.target.value)}
          />
          <Input
            placeholder='Reason'
            value={bundleReason}
            onChange={event => setBundleReason(event.target.value)}
          />
          <div className='flex items-center gap-2'>
            <Checkbox
              checked={confirmExecution}
              onCheckedChange={checked => setConfirmExecution(Boolean(checked))}
              id='confirm-execution'
            />
            <label
              htmlFor='confirm-execution'
              className='text-sm text-muted-foreground'
            >
              I confirm this bundle should execute.
            </label>
          </div>
          <Button
            type='button'
            onClick={() =>
              submitAction('requestBundleExecution', {
                tenantId,
                projectId,
                bundleId,
                reason: bundleReason,
                confirmExecution,
              })
            }
          >
            Request Execution
          </Button>
        </CardContent>
      </Card>

      {actionResult.status !== 'idle' && (
        <Alert
          variant={actionResult.status === 'error' ? 'destructive' : 'default'}
        >
          <AlertTitle>Action Result</AlertTitle>
          <AlertDescription className='space-y-2'>
            <div>{actionResult.message}</div>
            {actionResult.data && (
              <pre className='max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs'>
                {JSON.stringify(actionResult.data, null, 2)}
              </pre>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
