/**
 * Predictive Intelligence & Proactive Automation Discovery
 * Predict friction points, recommend automations, detect anomalies
 */

import { z } from 'zod';
import { observabilityService } from '../observability/telemetry';

/**
 * Friction Point Prediction
 */
export const frictionPointSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'manual_task',
    'bottleneck',
    'error_prone',
    'time_consuming',
    'repetitive',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  affectedWorkflows: z.array(z.string().uuid()).optional(),
  estimatedImpact: z.object({
    timeSaved: z.number().int(), // hours per week
    costReduction: z.number().optional(),
    errorReduction: z.number().min(0).max(1).optional(),
  }),
  confidence: z.number().min(0).max(1),
});

export type FrictionPoint = z.infer<typeof frictionPointSchema>;

/**
 * Automation Recommendation
 */
export const automationRecommendationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['workflow', 'agent', 'integration', 'optimization']),
  estimatedValue: z.object({
    timeSaved: z.number().int(), // hours per week
    costReduction: z.number().optional(),
    efficiencyGain: z.number().min(0).max(100).optional(), // percentage
  }),
  complexity: z.enum(['low', 'medium', 'high']),
  confidence: z.number().min(0).max(1),
  relatedFrictionPoints: z.array(z.string().uuid()).optional(),
  prerequisites: z.array(z.string()).optional(),
});

export type AutomationRecommendation = z.infer<typeof automationRecommendationSchema>;

/**
 * Anomaly Detection
 */
export const anomalySchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'performance_degradation',
    'error_spike',
    'usage_anomaly',
    'cost_anomaly',
    'behavior_change',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  detectedAt: z.string().datetime(),
  metric: z.string(),
  expectedValue: z.number().optional(),
  actualValue: z.number(),
  deviation: z.number(), // percentage
  context: z.record(z.unknown()).optional(),
});

export type Anomaly = z.infer<typeof anomalySchema>;

/**
 * Remediation Suggestion
 */
export const remediationSuggestionSchema = z.object({
  id: z.string().uuid(),
  anomalyId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  action: z.enum([
    'scale_resources',
    'optimize_workflow',
    'update_configuration',
    'investigate_error',
    'contact_support',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimatedImpact: z.string(),
  steps: z.array(z.string()),
});

export type RemediationSuggestion = z.infer<typeof remediationSuggestionSchema>;

/**
 * Predictive Intelligence Service
 */
export class PredictiveIntelligenceService {
  private frictionPoints: FrictionPoint[] = [];
  private recommendations: AutomationRecommendation[] = [];
  private anomalies: Anomaly[] = [];

  /**
   * Analyze workflow patterns and predict friction points
   */
  async analyzeFrictionPoints(
    workflowId: string,
    period: { start: Date; end: Date }
  ): Promise<FrictionPoint[]> {
    const heatmap = observabilityService.getWorkflowHeatmap(workflowId, period);

    const frictionPoints: FrictionPoint[] = [];

    // Detect high failure rate
    if (heatmap.successRate < 0.8) {
      frictionPoints.push({
        id: this.generateId(),
        type: 'error_prone',
        severity: heatmap.successRate < 0.5 ? 'critical' : 'high',
        description: `Workflow has ${(1 - heatmap.successRate) * 100}% failure rate`,
        affectedWorkflows: [workflowId],
        estimatedImpact: {
          timeSaved: Math.round((1 - heatmap.successRate) * 10), // Estimated hours
          errorReduction: heatmap.successRate,
        },
        confidence: 0.8,
      });
    }

    // Detect slow execution
    if (heatmap.avgDuration > 60000) { // > 1 minute
      frictionPoints.push({
        id: this.generateId(),
        type: 'time_consuming',
        severity: heatmap.avgDuration > 300000 ? 'high' : 'medium',
        description: `Workflow takes ${Math.round(heatmap.avgDuration / 1000)}s on average`,
        affectedWorkflows: [workflowId],
        estimatedImpact: {
          timeSaved: Math.round(heatmap.avgDuration / 1000 / 60), // Minutes saved per execution
        },
        confidence: 0.7,
      });
    }

    // Detect high frequency (potential automation opportunity)
    if (heatmap.totalExecutions > 100) {
      frictionPoints.push({
        id: this.generateId(),
        type: 'repetitive',
        severity: 'medium',
        description: `Workflow executed ${heatmap.totalExecutions} times in period`,
        affectedWorkflows: [workflowId],
        estimatedImpact: {
          timeSaved: Math.round(heatmap.totalExecutions * 0.5), // Estimated hours
        },
        confidence: 0.6,
      });
    }

    this.frictionPoints.push(...frictionPoints);
    return frictionPoints;
  }

  /**
   * Recommend automations based on patterns
   */
  async recommendAutomations(
    userId: string,
    tenantId?: string
  ): Promise<AutomationRecommendation[]> {
    const recommendations: AutomationRecommendation[] = [];

    // Analyze friction points
    const userFrictionPoints = this.frictionPoints.filter(fp => {
      // Would filter by user/tenant
      return true;
    });

    userFrictionPoints.forEach(frictionPoint => {
      if (frictionPoint.type === 'repetitive' && frictionPoint.confidence > 0.6) {
        recommendations.push({
          id: this.generateId(),
          title: `Automate ${frictionPoint.description}`,
          description: `This workflow is executed frequently and could be automated`,
          category: 'workflow',
          estimatedValue: {
            timeSaved: frictionPoint.estimatedImpact.timeSaved,
            efficiencyGain: 50,
          },
          complexity: 'medium',
          confidence: frictionPoint.confidence,
          relatedFrictionPoints: [frictionPoint.id],
        });
      }

      if (frictionPoint.type === 'error_prone') {
        recommendations.push({
          id: this.generateId(),
          title: `Add error handling to ${frictionPoint.description}`,
          description: `This workflow has high error rate and could benefit from improved error handling`,
          category: 'optimization',
          estimatedValue: {
            timeSaved: frictionPoint.estimatedImpact.timeSaved,
            errorReduction: frictionPoint.estimatedImpact.errorReduction,
          },
          complexity: 'low',
          confidence: frictionPoint.confidence,
          relatedFrictionPoints: [frictionPoint.id],
        });
      }
    });

    this.recommendations.push(...recommendations);
    return recommendations;
  }

  /**
   * Detect anomalies in metrics
   */
  async detectAnomalies(
    metric: string,
    period: { start: Date; end: Date },
    baseline?: { avg: number; stdDev: number }
  ): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Simplified anomaly detection
    // Would use statistical methods (Z-score, moving average, etc.)
    if (baseline) {
      const threshold = baseline.avg + (2 * baseline.stdDev); // 2-sigma rule
      
      // Would fetch actual metric values
      const actualValue = baseline.avg * 1.5; // Mock value
      
      if (actualValue > threshold) {
        const deviation = ((actualValue - baseline.avg) / baseline.avg) * 100;
        
        anomalies.push({
          id: this.generateId(),
          type: 'usage_anomaly',
          severity: deviation > 50 ? 'high' : 'medium',
          description: `${metric} is ${deviation.toFixed(1)}% above baseline`,
          detectedAt: new Date().toISOString(),
          metric,
          expectedValue: baseline.avg,
          actualValue,
          deviation,
        });
      }
    }

    this.anomalies.push(...anomalies);
    return anomalies;
  }

  /**
   * Suggest remediation for anomaly
   */
  async suggestRemediation(anomalyId: string): Promise<RemediationSuggestion[]> {
    const anomaly = this.anomalies.find(a => a.id === anomalyId);
    if (!anomaly) {
      return [];
    }

    const suggestions: RemediationSuggestion[] = [];

    switch (anomaly.type) {
      case 'performance_degradation':
        suggestions.push({
          id: this.generateId(),
          anomalyId,
          title: 'Optimize workflow performance',
          description: 'Review workflow steps and optimize slow operations',
          action: 'optimize_workflow',
          priority: anomaly.severity === 'critical' ? 'urgent' : 'high',
          estimatedImpact: 'Reduce execution time by 30-50%',
          steps: [
            'Review workflow execution logs',
            'Identify slow steps',
            'Optimize or parallelize operations',
            'Test improvements',
          ],
        });
        break;

      case 'error_spike':
        suggestions.push({
          id: this.generateId(),
          anomalyId,
          title: 'Investigate error patterns',
          description: 'Analyze recent errors to identify root cause',
          action: 'investigate_error',
          priority: 'high',
          estimatedImpact: 'Reduce error rate significantly',
          steps: [
            'Review error logs',
            'Identify common error patterns',
            'Fix root causes',
            'Add error handling',
          ],
        });
        break;

      case 'cost_anomaly':
        suggestions.push({
          id: this.generateId(),
          anomalyId,
          title: 'Review resource usage',
          description: 'Investigate unexpected cost increase',
          action: 'optimize_workflow',
          priority: 'medium',
          estimatedImpact: 'Reduce costs by 20-40%',
          steps: [
            'Review usage metrics',
            'Identify cost drivers',
            'Optimize resource-intensive operations',
            'Set up cost alerts',
          ],
        });
        break;
    }

    return suggestions;
  }

  /**
   * Predict workload backlog
   */
  async predictBacklog(
    workflowId: string,
    lookaheadDays: number = 7
  ): Promise<{
    predictedLoad: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    // Simplified prediction
    const heatmap = observabilityService.getWorkflowHeatmap(workflowId, {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    });

    const avgDailyExecutions = heatmap.totalExecutions / 7;
    const predictedLoad = avgDailyExecutions * lookaheadDays;

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (predictedLoad > 1000) {
      riskLevel = 'high';
    } else if (predictedLoad > 500) {
      riskLevel = 'medium';
    }

    const recommendations: string[] = [];
    if (riskLevel === 'high') {
      recommendations.push('Consider scaling resources', 'Optimize workflow performance');
    }

    return {
      predictedLoad: Math.round(predictedLoad),
      riskLevel,
      recommendations,
    };
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const predictiveIntelligence = new PredictiveIntelligenceService();
