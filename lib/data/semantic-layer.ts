/**
 * Semantic Layer & Business Intelligence Engine
 * Canonical data models with semantic definitions
 */

import { z } from 'zod';

/**
 * Business Entity Types
 */
export const entityTypeSchema = z.enum([
  'customer',
  'order',
  'product',
  'transaction',
  'workflow',
  'agent',
  'report',
  'metric',
  'event',
]);

export type EntityType = z.infer<typeof entityTypeSchema>;

/**
 * Business State Definitions
 */
export const businessStateSchema = z.object({
  entityType: entityTypeSchema,
  state: z.string(),
  transitions: z.array(z.string()), // Valid next states
  metadata: z.record(z.unknown()).optional(),
});

export type BusinessState = z.infer<typeof businessStateSchema>;

/**
 * KPI Definition
 */
export const kpiDefinitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['revenue', 'efficiency', 'quality', 'growth', 'custom']),
  formula: z.string(), // Mathematical formula or query
  unit: z.string(), // e.g., 'CAD', 'hours', 'percentage'
  target: z.number().optional(),
  threshold: z.object({
    warning: z.number().optional(),
    critical: z.number().optional(),
  }).optional(),
  aggregation: z.enum(['sum', 'avg', 'min', 'max', 'count', 'custom']),
  timeRange: z.enum(['hour', 'day', 'week', 'month', 'quarter', 'year']),
});

export type KPIDefinition = z.infer<typeof kpiDefinitionSchema>;

/**
 * Business Metric
 */
export const businessMetricSchema = z.object({
  id: z.string().uuid(),
  kpiId: z.string().uuid(),
  value: z.number(),
  timestamp: z.string().datetime(),
  dimensions: z.record(z.string()), // e.g., { tenantId: '...', workflowId: '...' }
  metadata: z.record(z.unknown()).optional(),
});

export type BusinessMetric = z.infer<typeof businessMetricSchema>;

/**
 * Semantic Field Definition
 */
export const semanticFieldSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'date', 'enum', 'object', 'array']),
  description: z.string(),
  required: z.boolean().default(false),
  validation: z.record(z.unknown()).optional(),
  businessMeaning: z.string().optional(), // What this field means in business terms
  examples: z.array(z.unknown()).optional(),
});

export type SemanticField = z.infer<typeof semanticFieldSchema>;

/**
 * Semantic Entity Definition
 */
export const semanticEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  entityType: entityTypeSchema,
  description: z.string(),
  fields: z.array(semanticFieldSchema),
  relationships: z.array(z.object({
    targetEntity: z.string().uuid(),
    relationshipType: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
    foreignKey: z.string().optional(),
  })).optional(),
  businessRules: z.array(z.string()).optional(),
  validStates: z.array(businessStateSchema).optional(),
});

export type SemanticEntity = z.infer<typeof semanticEntitySchema>;

/**
 * Workflow Output Schema
 */
export const workflowOutputSchema = z.object({
  workflowId: z.string().uuid(),
  outputType: z.enum(['data', 'report', 'analysis', 'recommendation', 'action']),
  schema: z.record(z.unknown()), // JSON Schema
  semanticMapping: z.record(z.string()), // Maps output fields to semantic entities
  validation: z.record(z.unknown()).optional(),
});

export type WorkflowOutput = z.infer<typeof workflowOutputSchema>;

/**
 * Agent Output Schema
 */
export const agentOutputSchema = z.object({
  agentId: z.string().uuid(),
  outputType: z.enum(['text', 'structured', 'workflow', 'report', 'analysis']),
  schema: z.record(z.unknown()),
  semanticMapping: z.record(z.string()).optional(),
  validation: z.record(z.unknown()).optional(),
});

export type AgentOutput = z.infer<typeof agentOutputSchema>;

/**
 * Semantic Layer Registry
 */
export class SemanticLayer {
  private entities: Map<string, SemanticEntity> = new Map();
  private kpis: Map<string, KPIDefinition> = new Map();
  private states: Map<string, BusinessState[]> = new Map();

  /**
   * Register semantic entity
   */
  registerEntity(entity: SemanticEntity): void {
    this.entities.set(entity.id, entity);
  }

  /**
   * Register KPI
   */
  registerKPI(kpi: KPIDefinition): void {
    this.kpis.set(kpi.id, kpi);
  }

  /**
   * Register business states
   */
  registerStates(entityType: EntityType, states: BusinessState[]): void {
    this.states.set(entityType, states);
  }

  /**
   * Validate data against semantic entity
   */
  validateEntity(entityId: string, data: unknown): {
    valid: boolean;
    errors: string[];
  } {
    const entity = this.entities.get(entityId);
    if (!entity) {
      return { valid: false, errors: [`Entity ${entityId} not found`] };
    }

    const errors: string[] = [];

    // Validate required fields
    entity.fields.forEach(field => {
      if (field.required) {
        const value = (data as Record<string, unknown>)[field.name];
        if (value === undefined || value === null) {
          errors.push(`Required field ${field.name} is missing`);
        }
      }
    });

    // Validate field types
    entity.fields.forEach(field => {
      const value = (data as Record<string, unknown>)[field.name];
      if (value !== undefined && value !== null) {
        const typeMatch = this.validateFieldType(field.type, value);
        if (!typeMatch) {
          errors.push(`Field ${field.name} has invalid type`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate field type
   */
  private validateFieldType(type: SemanticField['type'], value: unknown): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return value instanceof Date || typeof value === 'string';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Get semantic entity
   */
  getEntity(entityId: string): SemanticEntity | undefined {
    return this.entities.get(entityId);
  }

  /**
   * Get KPI definition
   */
  getKPI(kpiId: string): KPIDefinition | undefined {
    return this.kpis.get(kpiId);
  }

  /**
   * Get valid states for entity type
   */
  getStates(entityType: EntityType): BusinessState[] {
    return this.states.get(entityType) || [];
  }

  /**
   * Generate TypeScript types from semantic entity
   */
  generateTypeScriptType(entityId: string): string {
    const entity = this.entities.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }

    const fields = entity.fields.map(field => {
      const optional = field.required ? '' : '?';
      const tsType = this.mapToTypeScriptType(field.type);
      return `  ${field.name}${optional}: ${tsType};`;
    }).join('\n');

    return `export interface ${entity.name} {\n${fields}\n}`;
  }

  /**
   * Map semantic type to TypeScript type
   */
  private mapToTypeScriptType(type: SemanticField['type']): string {
    switch (type) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'date':
        return 'Date | string';
      case 'enum':
        return 'string'; // Would need enum values
      case 'object':
        return 'Record<string, unknown>';
      case 'array':
        return 'unknown[]';
      default:
        return 'unknown';
    }
  }

  /**
   * Generate Zod schema from semantic entity
   */
  generateZodSchema(entityId: string): string {
    const entity = this.entities.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }

    const fields = entity.fields.map(field => {
      let zodType = this.mapToZodType(field.type);
      if (!field.required) {
        zodType = `${zodType}.optional()`;
      }
      return `  ${field.name}: ${zodType},`;
    }).join('\n');

    return `export const ${entity.name.toLowerCase()}Schema = z.object({\n${fields}\n});`;
  }

  /**
   * Map semantic type to Zod type
   */
  private mapToZodType(type: SemanticField['type']): string {
    switch (type) {
      case 'string':
        return 'z.string()';
      case 'number':
        return 'z.number()';
      case 'boolean':
        return 'z.boolean()';
      case 'date':
        return 'z.string().datetime()';
      case 'enum':
        return 'z.string()';
      case 'object':
        return 'z.record(z.unknown())';
      case 'array':
        return 'z.array(z.unknown())';
      default:
        return 'z.unknown()';
    }
  }
}

// Export singleton instance
export const semanticLayer = new SemanticLayer();
