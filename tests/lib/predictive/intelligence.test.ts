/**
 * Tests for Predictive Intelligence Service
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { PredictiveIntelligenceService } from '@/lib/predictive/intelligence';

describe('PredictiveIntelligenceService', () => {
  let predictive: PredictiveIntelligenceService;

  beforeEach(() => {
    predictive = new PredictiveIntelligenceService();
  });

  describe('analyzeFrictionPoints', () => {
    it('should analyze friction points for workflow', async () => {
      // Mock workflow execution data would be needed
      const frictionPoints = await predictive.analyzeFrictionPoints('wf-1', {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      });

      expect(Array.isArray(frictionPoints)).toBe(true);
    });
  });

  describe('recommendAutomations', () => {
    it('should recommend automations', async () => {
      const recommendations = await predictive.recommendAutomations('user-1');
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalies', async () => {
      const anomalies = await predictive.detectAnomalies('metric-1', {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date(),
      }, {
        avg: 100,
        stdDev: 10,
      });

      expect(Array.isArray(anomalies)).toBe(true);
    });
  });

  describe('suggestRemediation', () => {
    it('should suggest remediation for anomaly', async () => {
      // First create an anomaly
      const anomalies = await predictive.detectAnomalies('metric-1', {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date(),
      }, {
        avg: 100,
        stdDev: 10,
      });

      if (anomalies.length > 0) {
        const suggestions = await predictive.suggestRemediation(anomalies[0].id);
        expect(Array.isArray(suggestions)).toBe(true);
      }
    });
  });

  describe('predictBacklog', () => {
    it('should predict workload backlog', async () => {
      const backlog = await predictive.predictBacklog('wf-1', 7);
      expect(backlog).toBeDefined();
      expect(backlog.predictedLoad).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(backlog.riskLevel);
      expect(Array.isArray(backlog.recommendations)).toBe(true);
    });
  });
});
