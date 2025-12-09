/**
 * Tests for Semantic Layer
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { SemanticLayer  } from '@/lib/data/semantic-layer';

describe('SemanticLayer', () => {
  let semanticLayer: SemanticLayer;

  beforeEach(() => {
    semanticLayer = new SemanticLayer();
  });

  describe('registerEntity', () => {
    it('should register a semantic entity', () => {
      const entity = {
        id: 'entity-1',
        name: 'Customer',
        entityType: 'customer' as const,
        description: 'Customer entity',
        fields: [
          {
            name: 'id',
            type: 'string' as const,
            description: 'Customer ID',
            required: true,
          },
          {
            name: 'name',
            type: 'string' as const,
            description: 'Customer name',
            required: true,
          },
        ],
      };

      semanticLayer.registerEntity(entity);
      const retrieved = semanticLayer.getEntity('entity-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Customer');
    });
  });

  describe('validateEntity', () => {
    it('should validate entity data correctly', () => {
      const entity = {
        id: 'entity-2',
        name: 'Order',
        entityType: 'order' as const,
        description: 'Order entity',
        fields: [
          {
            name: 'id',
            type: 'string' as const,
            description: 'Order ID',
            required: true,
          },
          {
            name: 'total',
            type: 'number' as const,
            description: 'Order total',
            required: true,
          },
        ],
      };

      semanticLayer.registerEntity(entity);

      const validData = { id: 'order-1', total: 100 };
      const invalidData = { id: 'order-1' }; // missing total

      const validResult = semanticLayer.validateEntity('entity-2', validData);
      const invalidResult = semanticLayer.validateEntity('entity-2', invalidData);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('registerKPI', () => {
    it('should register a KPI', () => {
      const kpi = {
        id: 'kpi-1',
        name: 'Revenue',
        description: 'Total revenue',
        category: 'revenue' as const,
        formula: 'SUM(orders.total)',
        unit: 'CAD',
        aggregation: 'sum' as const,
        timeRange: 'month' as const,
      };

      semanticLayer.registerKPI(kpi);
      const retrieved = semanticLayer.getKPI('kpi-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Revenue');
    });
  });

  describe('generateTypeScriptType', () => {
    it('should generate TypeScript type from entity', () => {
      const entity = {
        id: 'entity-3',
        name: 'Product',
        entityType: 'product' as const,
        description: 'Product entity',
        fields: [
          {
            name: 'id',
            type: 'string' as const,
            description: 'Product ID',
            required: true,
          },
          {
            name: 'price',
            type: 'number' as const,
            description: 'Product price',
            required: false,
          },
        ],
      };

      semanticLayer.registerEntity(entity);
      const typeScript = semanticLayer.generateTypeScriptType('entity-3');

      expect(typeScript).toContain('export interface Product');
      expect(typeScript).toContain('id: string');
      expect(typeScript).toContain('price?: number');
    });
  });

  describe('generateZodSchema', () => {
    it('should generate Zod schema from entity', () => {
      const entity = {
        id: 'entity-4',
        name: 'User',
        entityType: 'customer' as const,
        description: 'User entity',
        fields: [
          {
            name: 'email',
            type: 'string' as const,
            description: 'User email',
            required: true,
          },
        ],
      };

      semanticLayer.registerEntity(entity);
      const zodSchema = semanticLayer.generateZodSchema('entity-4');

      expect(zodSchema).toContain('userSchema');
      expect(zodSchema).toContain('z.string()');
    });
  });
});
