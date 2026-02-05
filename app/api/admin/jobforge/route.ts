import { NextRequest, NextResponse } from 'next/server';

import {
  getJobForgeAdapter,
  loadJobForgeConfig,
  redactJobForgePayload,
  resolveTenantProject,
  serializeJobForgeError,
} from '@/lib/integrations/jobforge';
import { logger } from '@/lib/logging/structured-logger';

function isAuthorized(request: NextRequest): boolean {
  const config = loadJobForgeConfig();
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (config.adminToken && token !== config.adminToken) {
    return false;
  }
  return true;
}

function parseTenantProjectMap(raw?: string): Record<string, string> {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = loadJobForgeConfig();

    return NextResponse.json({
      enabled: config.enabled,
      executionEnabled: config.executionEnabled,
      defaultTenantId: config.defaultTenantId || null,
      defaultProjectId: config.defaultProjectId || null,
      tenantProjectMap: parseTenantProjectMap(config.tenantProjectMapRaw),
    });
  } catch (error) {
    const serialized = serializeJobForgeError(error);
    logger.error(
      'JobForge admin status error',
      error instanceof Error ? error : new Error(serialized.message),
      {
        component: 'JobForgeAdminAPI',
        action: 'GET',
        error: serialized,
      }
    );
    return NextResponse.json({ error: serialized.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> | undefined;
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    payload = (await request.json()) as Record<string, unknown>;
    const action = String(payload.action || '');

    const adapter = await getJobForgeAdapter();
    const config = adapter.getConfig();

    switch (action) {
      case 'submitEvent': {
        const tenantId = String(payload.tenantId || '');
        const projectId = String(payload.projectId || '');
        const eventName = String(payload.eventName || '');
        if (!tenantId || !projectId || !eventName) {
          return NextResponse.json(
            { error: 'tenantId, projectId, and eventName are required' },
            { status: 400 }
          );
        }

        resolveTenantProject(config, tenantId, projectId);

        const job = await adapter.submitEvent({
          tenantId,
          projectId,
          eventName,
          payload: (payload.payload as Record<string, unknown>) || {},
          idempotencyKey: payload.idempotencyKey
            ? String(payload.idempotencyKey)
            : undefined,
        });

        return NextResponse.json({ job });
      }
      case 'runModuleDryRun': {
        const tenantId = String(payload.tenantId || '');
        const projectId = String(payload.projectId || '');
        const moduleName = String(payload.moduleName || '');
        if (!tenantId || !projectId || !moduleName) {
          return NextResponse.json(
            { error: 'tenantId, projectId, and moduleName are required' },
            { status: 400 }
          );
        }

        resolveTenantProject(config, tenantId, projectId);

        const job = await adapter.runModuleDryRun({
          tenantId,
          projectId,
          moduleName,
          inputs: (payload.inputs as Record<string, unknown>) || {},
        });

        return NextResponse.json({ job });
      }
      case 'viewReport': {
        const tenantId = String(payload.tenantId || '');
        const projectId = String(payload.projectId || '');
        const reportId = String(payload.reportId || '');
        if (!tenantId || !projectId || !reportId) {
          return NextResponse.json(
            { error: 'tenantId, projectId, and reportId are required' },
            { status: 400 }
          );
        }

        resolveTenantProject(config, tenantId, projectId);

        const report = await adapter.viewReport({
          tenantId,
          projectId,
          reportId,
        });
        return NextResponse.json({ report });
      }
      case 'requestBundleExecution': {
        const tenantId = String(payload.tenantId || '');
        const projectId = String(payload.projectId || '');
        const bundleId = String(payload.bundleId || '');
        const confirmExecution = payload.confirmExecution === true;
        if (!tenantId || !projectId || !bundleId) {
          return NextResponse.json(
            { error: 'tenantId, projectId, and bundleId are required' },
            { status: 400 }
          );
        }
        if (!confirmExecution) {
          return NextResponse.json(
            { error: 'confirmExecution must be true to request execution' },
            { status: 400 }
          );
        }

        resolveTenantProject(config, tenantId, projectId);

        const job = await adapter.requestBundleExecution({
          tenantId,
          projectId,
          bundleId,
          reason: payload.reason ? String(payload.reason) : undefined,
        });

        return NextResponse.json({ job });
      }
      default:
        return NextResponse.json(
          { error: 'Unsupported action' },
          { status: 400 }
        );
    }
  } catch (error) {
    const serialized = serializeJobForgeError(error);
    const status = serialized.message.includes('disabled') ? 409 : 500;
    logger.error(
      'JobForge admin action failed',
      error instanceof Error ? error : new Error(serialized.message),
      {
        component: 'JobForgeAdminAPI',
        action: 'POST',
        payload: redactJobForgePayload(payload),
        error: serialized,
      }
    );
    return NextResponse.json({ error: serialized.message }, { status });
  }
}
