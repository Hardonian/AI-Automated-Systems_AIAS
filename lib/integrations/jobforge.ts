import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { logger } from '@/lib/logging/structured-logger';

export interface JobForgeConfig {
  enabled: boolean;
  executionEnabled: boolean;
  adminToken?: string;
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  tenantProjectMapRaw?: string;
  defaultTenantId?: string;
  defaultProjectId?: string;
}

export interface JobForgeJob {
  id: string;
  tenant_id: string;
  type: string;
  status?: string;
  payload?: Record<string, unknown>;
  run_at?: string;
}

export interface JobForgeResult {
  id: string;
  tenant_id: string;
  job_id?: string;
  status?: string;
  result?: Record<string, unknown> | null;
  error?: string | null;
  created_at?: string;
}

export interface EnqueueJobInput {
  tenant_id: string;
  type: string;
  payload: Record<string, unknown>;
  idempotency_key?: string;
  run_at?: string;
  max_attempts?: number;
}

export interface JobForgeClientLike {
  enqueueJob(params: EnqueueJobInput): Promise<JobForgeJob>;
  getResult?(
    resultId: string,
    tenantId: string
  ): Promise<JobForgeResult | null>;
  getJob?(jobId: string, tenantId: string): Promise<JobForgeJob | null>;
}

function getEnvValue(key: string): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
}

function parseEnabledFlag(
  value: string | undefined,
  fallback: string
): boolean {
  const normalized = (value ?? fallback).toLowerCase();
  return ['1', 'true', 'yes'].includes(normalized);
}

function parseTenantProjectMap(raw?: string): Record<string, string> {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (error) {
    throw new Error('JOBFORGE_TENANT_PROJECT_MAP must be valid JSON');
  }
  return {};
}

export function loadJobForgeConfig(): JobForgeConfig {
  const supabaseUrl =
    getEnvValue('JOBFORGE_SUPABASE_URL') ||
    getEnvValue('SUPABASE_URL') ||
    getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseServiceRoleKey =
    getEnvValue('JOBFORGE_SUPABASE_SERVICE_ROLE_KEY') ||
    getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

  return {
    enabled: parseEnabledFlag(getEnvValue('JOBFORGE_INTEGRATION_ENABLED'), '0'),
    executionEnabled: parseEnabledFlag(
      getEnvValue('JOBFORGE_EXECUTION_ENABLED'),
      '0'
    ),
    adminToken: getEnvValue('JOBFORGE_ADMIN_TOKEN') || undefined,
    supabaseUrl: supabaseUrl || undefined,
    supabaseServiceRoleKey: supabaseServiceRoleKey || undefined,
    tenantProjectMapRaw:
      getEnvValue('JOBFORGE_TENANT_PROJECT_MAP') || undefined,
    defaultTenantId: getEnvValue('JOBFORGE_DEFAULT_TENANT_ID') || undefined,
    defaultProjectId: getEnvValue('JOBFORGE_DEFAULT_PROJECT_ID') || undefined,
  };
}

function assertJobForgeEnabled(config: JobForgeConfig): void {
  if (!config.enabled) {
    throw new Error('JobForge integration is disabled');
  }
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error('JobForge requires Supabase credentials');
  }
}

export function resolveTenantProject(
  config: JobForgeConfig,
  tenantId?: string,
  projectId?: string
): { tenantId: string; projectId: string } {
  const resolvedTenantId = tenantId || config.defaultTenantId;
  const resolvedProjectId = projectId || config.defaultProjectId;

  if (!resolvedTenantId || !resolvedProjectId) {
    throw new Error(
      'Both tenantId and projectId are required for JobForge requests'
    );
  }

  const map = parseTenantProjectMap(config.tenantProjectMapRaw);
  if (
    Object.keys(map).length > 0 &&
    map[resolvedTenantId] !== resolvedProjectId
  ) {
    throw new Error('Tenant/project mapping mismatch for JobForge request');
  }

  return { tenantId: resolvedTenantId, projectId: resolvedProjectId };
}

function redactString(value: string): string {
  const maskedToken = value.replace(
    /(token|key|secret|password)=([^&\s]+)/gi,
    '$1=[REDACTED]'
  );
  return maskedToken.replace(
    /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
    'Bearer [REDACTED]'
  );
}

export function redactJobForgePayload(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map(value => redactJobForgePayload(value));
  }
  if (input && typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(
      ([key, value]) => {
        if (/(token|key|secret|password|authorization)/i.test(key)) {
          return [key, '[REDACTED]'] as const;
        }
        return [key, redactJobForgePayload(value)] as const;
      }
    );
    return Object.fromEntries(entries);
  }
  if (typeof input === 'string') {
    return redactString(input);
  }
  return input;
}

export function serializeJobForgeError(error: unknown): {
  name: string;
  message: string;
} {
  const baseError = error instanceof Error ? error : new Error(String(error));
  return {
    name: baseError.name,
    message: redactString(baseError.message),
  };
}

class SupabaseJobForgeClient implements JobForgeClientLike {
  constructor(private supabase: SupabaseClient) {}

  async enqueueJob(params: EnqueueJobInput): Promise<JobForgeJob> {
    const { data, error } = await this.supabase.rpc('jobforge_enqueue_job', {
      p_tenant_id: params.tenant_id,
      p_type: params.type,
      p_payload: params.payload,
      p_idempotency_key: params.idempotency_key || null,
      p_run_at: params.run_at || new Date().toISOString(),
      p_max_attempts: params.max_attempts || 5,
    });

    if (error) {
      throw new Error(`Failed to enqueue job: ${error.message}`);
    }

    return data as JobForgeJob;
  }

  async getResult(
    resultId: string,
    tenantId: string
  ): Promise<JobForgeResult | null> {
    const { data, error } = await this.supabase
      .from('jobforge_job_results')
      .select('*')
      .eq('id', resultId)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get result: ${error.message}`);
    }

    return data as JobForgeResult;
  }

  async getJob(jobId: string, tenantId: string): Promise<JobForgeJob | null> {
    const { data, error } = await this.supabase
      .from('jobforge_jobs')
      .select('*')
      .eq('id', jobId)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get job: ${error.message}`);
    }

    return data as JobForgeJob;
  }
}

async function getJobForgeClient(
  config: JobForgeConfig
): Promise<JobForgeClientLike> {
  assertJobForgeEnabled(config);

  const supabase = createClient(
    config.supabaseUrl ?? '',
    config.supabaseServiceRoleKey ?? ''
  );
  return new SupabaseJobForgeClient(supabase);
}

export class JobForgeClientAdapter {
  readonly id = 'jobforge';
  readonly name = 'JobForge';

  constructor(
    private config: JobForgeConfig,
    private client: JobForgeClientLike
  ) {}

  static async create(): Promise<JobForgeClientAdapter> {
    const config = loadJobForgeConfig();
    const client = await getJobForgeClient(config);
    return new JobForgeClientAdapter(config, client);
  }

  getConfig(): JobForgeConfig {
    return this.config;
  }

  async submitEvent(input: {
    tenantId: string;
    projectId: string;
    eventName: string;
    payload?: Record<string, unknown>;
    idempotencyKey?: string;
  }): Promise<JobForgeJob> {
    const { tenantId, projectId } = resolveTenantProject(
      this.config,
      input.tenantId,
      input.projectId
    );

    return this.client.enqueueJob({
      tenant_id: tenantId,
      type: 'jobforge.event.submit',
      payload: {
        project_id: projectId,
        event_name: input.eventName,
        payload: input.payload ?? {},
      },
      idempotency_key: input.idempotencyKey,
    });
  }

  async runModuleDryRun(input: {
    tenantId: string;
    projectId: string;
    moduleName: string;
    inputs?: Record<string, unknown>;
  }): Promise<JobForgeJob> {
    const { tenantId, projectId } = resolveTenantProject(
      this.config,
      input.tenantId,
      input.projectId
    );

    return this.client.enqueueJob({
      tenant_id: tenantId,
      type: 'jobforge.module.run',
      payload: {
        project_id: projectId,
        module_name: input.moduleName,
        inputs: input.inputs ?? {},
        dry_run: true,
      },
    });
  }

  async viewReport(input: {
    tenantId: string;
    projectId: string;
    reportId: string;
  }): Promise<JobForgeResult | null> {
    if (!this.client.getResult) {
      throw new Error('JobForge client does not support report lookup');
    }
    resolveTenantProject(this.config, input.tenantId, input.projectId);
    return this.client.getResult(input.reportId, input.tenantId);
  }

  async requestBundleExecution(input: {
    tenantId: string;
    projectId: string;
    bundleId: string;
    reason?: string;
  }): Promise<JobForgeJob> {
    if (!this.config.executionEnabled) {
      throw new Error('JobForge bundle execution is disabled');
    }

    const { tenantId, projectId } = resolveTenantProject(
      this.config,
      input.tenantId,
      input.projectId
    );

    return this.client.enqueueJob({
      tenant_id: tenantId,
      type: 'jobforge.bundle.execute',
      payload: {
        project_id: projectId,
        bundle_id: input.bundleId,
        reason: input.reason ?? 'manual_request',
        dry_run: false,
      },
    });
  }
}

export async function getJobForgeAdapter(): Promise<JobForgeClientAdapter> {
  const adapter = await JobForgeClientAdapter.create();
  logger.info('JobForge adapter initialized', {
    integration: adapter.id,
    enabled: adapter.getConfig().enabled,
  });
  return adapter;
}
