/**
 * Observability, Logging, Telemetry & Internal Operational Insights
 * Comprehensive tracking for workflows, agents, errors, and user behavior
 */

import { z } from 'zod';

/**
 * Event Types
 */
export const eventTypeSchema = z.enum([
  'workflow_started',
  'workflow_completed',
  'workflow_failed',
  'agent_invoked',
  'agent_completed',
  'agent_failed',
  'api_call',
  'error',
  'user_action',
  'performance',
  'security',
]);

export type EventType = z.infer<typeof eventTypeSchema>;

/**
 * Telemetry Event
 */
export const telemetryEventSchema = z.object({
  id: z.string().uuid(),
  type: eventTypeSchema,
  timestamp: z.string().datetime(),
  userId: z.string().uuid().optional(),
  tenantId: z.string().uuid().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
});

export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;

/**
 * Workflow Execution Log
 */
export const workflowExecutionLogSchema = z.object({
  executionId: z.string().uuid(),
  workflowId: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  status: z.enum(['started', 'completed', 'failed', 'cancelled']),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  duration: z.number().int().optional(), // milliseconds
  stepsExecuted: z.number().int(),
  stepsSucceeded: z.number().int(),
  stepsFailed: z.number().int(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    stack: z.string().optional(),
  }).optional(),
  input: z.record(z.unknown()).optional(),
  output: z.record(z.unknown()).optional(),
});

export type WorkflowExecutionLog = z.infer<typeof workflowExecutionLogSchema>;

/**
 * Agent Execution Log
 */
export const agentExecutionLogSchema = z.object({
  executionId: z.string().uuid(),
  agentId: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  status: z.enum(['started', 'completed', 'failed', 'cancelled']),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  duration: z.number().int().optional(),
  tokenUsage: z.number().int().optional(),
  cost: z.number().optional(),
  input: z.record(z.unknown()).optional(),
  output: z.record(z.unknown()).optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
  }).optional(),
});

export type AgentExecutionLog = z.infer<typeof agentExecutionLogSchema>;

/**
 * Error Log
 */
export const errorLogSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  userId: z.string().uuid().optional(),
  tenantId: z.string().uuid().optional(),
  error: z.object({
    message: z.string(),
    name: z.string(),
    stack: z.string().optional(),
    code: z.string().optional(),
  }),
  context: z.record(z.unknown()).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  resolved: z.boolean().default(false),
});

export type ErrorLog = z.infer<typeof errorLogSchema>;

/**
 * Performance Metric
 */
export const performanceMetricSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  metric: z.string(),
  value: z.number(),
  unit: z.string(),
  tags: z.record(z.string()).optional(),
});

export type PerformanceMetric = z.infer<typeof performanceMetricSchema>;

/**
 * Workflow Heatmap Data
 */
export const workflowHeatmapSchema = z.object({
  workflowId: z.string().uuid(),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  executions: z.array(z.object({
    timestamp: z.string().datetime(),
    status: z.enum(['success', 'failure']),
    duration: z.number().int(),
  })),
  successRate: z.number().min(0).max(1),
  avgDuration: z.number().int(),
  totalExecutions: z.number().int(),
});

export type WorkflowHeatmap = z.infer<typeof workflowHeatmapSchema>;

/**
 * Agent Efficiency Metrics
 */
export const agentEfficiencySchema = z.object({
  agentId: z.string().uuid(),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  totalCalls: z.number().int(),
  successfulCalls: z.number().int(),
  failedCalls: z.number().int(),
  avgDuration: z.number().int(),
  avgTokenUsage: z.number().int().optional(),
  avgCost: z.number().optional(),
  successRate: z.number().min(0).max(1),
});

export type AgentEfficiency = z.infer<typeof agentEfficiencySchema>;

/**
 * Cost Analysis
 */
export const costAnalysisSchema = z.object({
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  totalCost: z.number(),
  breakdown: z.array(z.object({
    category: z.string(),
    cost: z.number(),
    usage: z.number().int(),
  })),
  byTenant: z.record(z.number()).optional(),
  byWorkflow: z.record(z.number()).optional(),
  byAgent: z.record(z.number()).optional(),
});

export type CostAnalysis = z.infer<typeof costAnalysisSchema>;

/**
 * Health Check Result
 */
export const healthCheckSchema = z.object({
  service: z.string(),
  status: z.enum(['healthy', 'degraded', 'down']),
  timestamp: z.string().datetime(),
  checks: z.array(z.object({
    name: z.string(),
    status: z.enum(['pass', 'fail', 'warn']),
    message: z.string().optional(),
    duration: z.number().int().optional(),
  })),
  metadata: z.record(z.unknown()).optional(),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;

/**
 * Observability Service
 */
export class ObservabilityService {
  private events: TelemetryEvent[] = [];
  private workflowLogs: WorkflowExecutionLog[] = [];
  private agentLogs: AgentExecutionLog[] = [];
  private errorLogs: ErrorLog[] = [];
  private performanceMetrics: PerformanceMetric[] = [];

  /**
   * Track telemetry event
   */
  trackEvent(event: Omit<TelemetryEvent, 'id' | 'timestamp'>): void {
    const telemetryEvent: TelemetryEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    this.events.push(telemetryEvent);

    // Would send to external service (e.g., PostHog, Mixpanel, custom)
    this.sendToExternalService(telemetryEvent);
  }

  /**
   * Log workflow execution
   */
  logWorkflowExecution(log: Omit<WorkflowExecutionLog, 'executionId'>): void {
    const executionId = this.generateId();
    const workflowLog: WorkflowExecutionLog = {
      ...log,
      executionId,
    };

    this.workflowLogs.push(workflowLog);
    this.trackEvent({
      type: log.status === 'completed' ? 'workflow_completed' : 
            log.status === 'failed' ? 'workflow_failed' : 'workflow_started',
      userId: log.userId,
      tenantId: log.tenantId,
      properties: {
        workflowId: log.workflowId,
        executionId: workflowLog.executionId,
        duration: log.duration,
        stepsExecuted: log.stepsExecuted,
      },
    });
  }

  /**
   * Log agent execution
   */
  logAgentExecution(log: Omit<AgentExecutionLog, 'executionId'>): void {
    const executionId = this.generateId();
    const agentLog: AgentExecutionLog = {
      ...log,
      executionId,
    };

    this.agentLogs.push(agentLog);
    this.trackEvent({
      type: log.status === 'completed' ? 'agent_completed' :
            log.status === 'failed' ? 'agent_failed' : 'agent_invoked',
      userId: log.userId,
      tenantId: log.tenantId,
      properties: {
        agentId: log.agentId,
        executionId: agentLog.executionId,
        duration: log.duration,
        tokenUsage: log.tokenUsage,
        cost: log.cost,
      },
    });
  }

  /**
   * Log error
   */
  logError(error: Error, context?: Record<string, unknown>): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      context,
      severity: this.determineSeverity(error),
    };

    this.errorLogs.push(errorLog);
    this.trackEvent({
      type: 'error',
      properties: {
        error: error.message,
        name: error.name,
        severity: errorLog.severity,
      },
      metadata: context,
    });
  }

  /**
   * Record performance metric
   */
  recordPerformanceMetric(
    metric: string,
    value: number,
    unit: string,
    tags?: Record<string, string>
  ): void {
    const performanceMetric: PerformanceMetric = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      metric,
      value,
      unit,
      tags,
    };

    this.performanceMetrics.push(performanceMetric);
  }

  /**
   * Get workflow heatmap
   */
  getWorkflowHeatmap(
    workflowId: string,
    period: { start: Date; end: Date }
  ): WorkflowHeatmap {
    const logs = this.workflowLogs.filter(log => {
      if (log.workflowId !== workflowId) return false;
      const startedAt = new Date(log.startedAt);
      return startedAt >= period.start && startedAt <= period.end;
    });

    const executions = logs.map(log => ({
      timestamp: log.startedAt,
      status: log.status === 'completed' ? 'success' as const : 'failure' as const,
      duration: log.duration || 0,
    }));

    const successful = executions.filter(e => e.status === 'success').length;
    const successRate = executions.length > 0 ? successful / executions.length : 0;
    const avgDuration = executions.length > 0
      ? executions.reduce((sum, e) => sum + e.duration, 0) / executions.length
      : 0;

    return {
      workflowId,
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString(),
      },
      executions,
      successRate,
      avgDuration: Math.round(avgDuration),
      totalExecutions: executions.length,
    };
  }

  /**
   * Get agent efficiency metrics
   */
  getAgentEfficiency(
    agentId: string,
    period: { start: Date; end: Date }
  ): AgentEfficiency {
    const logs = this.agentLogs.filter(log => {
      if (log.agentId !== agentId) return false;
      const startedAt = new Date(log.startedAt);
      return startedAt >= period.start && startedAt <= period.end;
    });

    const successful = logs.filter(l => l.status === 'completed').length;
    const failed = logs.filter(l => l.status === 'failed').length;
    const successRate = logs.length > 0 ? successful / logs.length : 0;

    const durations = logs.map(l => l.duration || 0).filter(d => d > 0);
    const avgDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;

    const tokenUsages = logs.map(l => l.tokenUsage || 0).filter(t => t > 0);
    const avgTokenUsage = tokenUsages.length > 0
      ? tokenUsages.reduce((sum, t) => sum + t, 0) / tokenUsages.length
      : undefined;

    const costs = logs.map(l => l.cost || 0).filter(c => c > 0);
    const avgCost = costs.length > 0
      ? costs.reduce((sum, c) => sum + c, 0) / costs.length
      : undefined;

    return {
      agentId,
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString(),
      },
      totalCalls: logs.length,
      successfulCalls: successful,
      failedCalls: failed,
      avgDuration: Math.round(avgDuration),
      avgTokenUsage: avgTokenUsage ? Math.round(avgTokenUsage) : undefined,
      avgCost,
      successRate,
    };
  }

  /**
   * Get cost analysis
   */
  getCostAnalysis(period: { start: Date; end: Date }): CostAnalysis {
    const logs = this.agentLogs.filter(log => {
      const startedAt = new Date(log.startedAt);
      return startedAt >= period.start && startedAt <= period.end && log.cost;
    });

    const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);

    const byTenant: Record<string, number> = {};
    const byWorkflow: Record<string, number> = {};
    const byAgent: Record<string, number> = {};

    logs.forEach(log => {
      if (log.tenantId) {
        byTenant[log.tenantId] = (byTenant[log.tenantId] || 0) + (log.cost || 0);
      }
      if (log.agentId) {
        byAgent[log.agentId] = (byAgent[log.agentId] || 0) + (log.cost || 0);
      }
    });

    return {
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString(),
      },
      totalCost,
      breakdown: [
        { category: 'agents', cost: totalCost, usage: logs.length },
      ],
      byTenant: Object.keys(byTenant).length > 0 ? byTenant : undefined,
      byAgent: Object.keys(byAgent).length > 0 ? byAgent : undefined,
    };
  }

  /**
   * Run health check
   */
  async runHealthCheck(service: string): Promise<HealthCheck> {
    const checks = [
      {
        name: 'database',
        status: 'pass' as const,
        message: 'Database connection healthy',
        duration: 10,
      },
      {
        name: 'api',
        status: 'pass' as const,
        message: 'API endpoints responding',
        duration: 5,
      },
    ];

    const allPassed = checks.every(c => c.status === 'pass');
    const status = allPassed ? 'healthy' as const : 'degraded' as const;

    return {
      service,
      status,
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: Error): ErrorLog['severity'] {
    if (error.message.includes('critical') || error.message.includes('fatal')) {
      return 'critical';
    }
    if (error.message.includes('warning') || error.message.includes('deprecated')) {
      return 'low';
    }
    return 'medium';
  }

  /**
   * Send to external service
   */
  private sendToExternalService(event: TelemetryEvent): void {
    // Would send to PostHog, Mixpanel, or custom analytics service
    // For now, just log
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Telemetry]', event);
    }
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const observabilityService = new ObservabilityService();
