#!/usr/bin/env tsx
import { Command } from 'commander';

import {
  getJobForgeAdapter,
  redactJobForgePayload,
  serializeJobForgeError,
} from '../lib/integrations/jobforge';

const program = new Command();

program
  .name('jobforge-admin')
  .description('JobForge admin CLI for AIAS')
  .version('1.0.0');

function parseJsonInput(
  value: string | undefined,
  label: string
): Record<string, unknown> {
  if (!value) {
    return {};
  }
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }
}

async function handleError(
  action: string,
  error: unknown,
  payload?: Record<string, unknown>
) {
  const serialized = serializeJobForgeError(error);
  const redacted = redactJobForgePayload(payload || {});
  console.error(`JobForge ${action} failed: ${serialized.message}`);
  console.error(
    JSON.stringify({ action, payload: redacted, error: serialized }, null, 2)
  );
  process.exitCode = 1;
}

program
  .command('submit-event')
  .description('Submit a JobForge event')
  .requiredOption('--tenant <tenantId>', 'Tenant ID')
  .requiredOption('--project <projectId>', 'Project ID')
  .requiredOption('--event <eventName>', 'Event name')
  .option('--payload <json>', 'Event payload JSON')
  .option('--idempotency-key <key>', 'Idempotency key')
  .action(async options => {
    const payload = {
      tenantId: options.tenant,
      projectId: options.project,
      eventName: options.event,
      payload: parseJsonInput(options.payload, 'payload'),
      idempotencyKey: options.idempotencyKey,
    };

    try {
      const adapter = await getJobForgeAdapter();
      const job = await adapter.submitEvent(payload);
      console.log(JSON.stringify({ job }, null, 2));
    } catch (error) {
      await handleError('submit-event', error, payload);
    }
  });

program
  .command('run-module')
  .description('Enqueue a JobForge module run in dry-run mode')
  .requiredOption('--tenant <tenantId>', 'Tenant ID')
  .requiredOption('--project <projectId>', 'Project ID')
  .requiredOption('--module <moduleName>', 'Module name')
  .option('--inputs <json>', 'Module inputs JSON')
  .action(async options => {
    const payload = {
      tenantId: options.tenant,
      projectId: options.project,
      moduleName: options.module,
      inputs: parseJsonInput(options.inputs, 'inputs'),
    };

    try {
      const adapter = await getJobForgeAdapter();
      const job = await adapter.runModuleDryRun(payload);
      console.log(JSON.stringify({ job }, null, 2));
    } catch (error) {
      await handleError('run-module', error, payload);
    }
  });

program
  .command('view-report')
  .description('View a JobForge report result by ID')
  .requiredOption('--tenant <tenantId>', 'Tenant ID')
  .requiredOption('--project <projectId>', 'Project ID')
  .requiredOption('--report <reportId>', 'Report ID')
  .action(async options => {
    const payload = {
      tenantId: options.tenant,
      projectId: options.project,
      reportId: options.report,
    };

    try {
      const adapter = await getJobForgeAdapter();
      const report = await adapter.viewReport(payload);
      console.log(JSON.stringify({ report }, null, 2));
    } catch (error) {
      await handleError('view-report', error, payload);
    }
  });

program
  .command('request-bundle-execution')
  .description('Request a JobForge bundle execution (gated)')
  .requiredOption('--tenant <tenantId>', 'Tenant ID')
  .requiredOption('--project <projectId>', 'Project ID')
  .requiredOption('--bundle <bundleId>', 'Bundle ID')
  .option('--reason <reason>', 'Reason for execution', 'manual_request')
  .option('--confirm', 'Confirm execution (required)')
  .action(async options => {
    const payload = {
      tenantId: options.tenant,
      projectId: options.project,
      bundleId: options.bundle,
      reason: options.reason,
    };

    if (!options.confirm) {
      console.error('--confirm is required to request bundle execution');
      process.exitCode = 1;
      return;
    }

    try {
      const adapter = await getJobForgeAdapter();
      const job = await adapter.requestBundleExecution(payload);
      console.log(JSON.stringify({ job }, null, 2));
    } catch (error) {
      await handleError('request-bundle-execution', error, payload);
    }
  });

program.parseAsync(process.argv);
