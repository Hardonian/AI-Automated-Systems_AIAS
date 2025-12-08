/**
 * Persona Engine & Adaptive UX System
 * Model user personas and adapt UX, explanations, and automation suggestions
 */

import { z } from 'zod';

/**
 * User Persona Types
 */
export const personaTypeSchema = z.enum([
  'ops_lead',
  'founder',
  'accountant',
  'consultant',
  'developer',
  'analyst',
]);

export type PersonaType = z.infer<typeof personaTypeSchema>;

/**
 * Persona Definition
 */
export const personaDefinitionSchema = z.object({
  id: z.string().uuid(),
  type: personaTypeSchema,
  name: z.string(),
  description: z.string(),
  characteristics: z.object({
    technicalLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    businessFocus: z.enum(['operations', 'strategy', 'finance', 'technical']),
    preferredDetailLevel: z.enum(['high-level', 'balanced', 'detailed']),
    preferredFormat: z.enum(['visual', 'text', 'data', 'mixed']),
    automationComfort: z.enum(['low', 'medium', 'high']),
  }),
  needs: z.array(z.string()),
  painPoints: z.array(z.string()),
  goals: z.array(z.string()),
});

export type PersonaDefinition = z.infer<typeof personaDefinitionSchema>;

/**
 * User Profile
 */
export const userProfileSchema = z.object({
  userId: z.string().uuid(),
  primaryPersona: personaTypeSchema,
  secondaryPersonas: z.array(personaTypeSchema).optional(),
  preferences: z.object({
    dashboardLayout: z.enum(['compact', 'standard', 'detailed']).default('standard'),
    notificationFrequency: z.enum(['realtime', 'daily', 'weekly']).default('daily'),
    reportDepth: z.enum(['summary', 'standard', 'detailed']).default('standard'),
  }).optional(),
  behavior: z.object({
    loginFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    featureUsage: z.record(z.number().int()).optional(),
    commonWorkflows: z.array(z.string().uuid()).optional(),
  }).optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Adaptive Content Configuration
 */
export const adaptiveContentConfigSchema = z.object({
  explanationDepth: z.enum(['simple', 'moderate', 'detailed']),
  includeTechnicalDetails: z.boolean(),
  includeBusinessContext: z.boolean(),
  visualizationPreference: z.enum(['charts', 'tables', 'narrative', 'mixed']),
  automationSuggestions: z.boolean(),
});

export type AdaptiveContentConfig = z.infer<typeof adaptiveContentConfigSchema>;

/**
 * Persona Engine
 */
export class PersonaEngine {
  private personas: Map<PersonaType, PersonaDefinition> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeDefaultPersonas();
  }

  /**
   * Initialize default personas
   */
  private initializeDefaultPersonas(): void {
    const defaultPersonas: PersonaDefinition[] = [
      {
        id: 'persona_ops_lead',
        type: 'ops_lead',
        name: 'Operations Lead',
        description: 'Manages day-to-day operations and process efficiency',
        characteristics: {
          technicalLevel: 'intermediate',
          businessFocus: 'operations',
          preferredDetailLevel: 'balanced',
          preferredFormat: 'mixed',
          automationComfort: 'high',
        },
        needs: [
          'Process visibility',
          'Efficiency metrics',
          'Automation recommendations',
          'Team coordination',
        ],
        painPoints: [
          'Manual repetitive tasks',
          'Lack of visibility into workflows',
          'Difficulty tracking performance',
        ],
        goals: [
          'Reduce manual work',
          'Improve team efficiency',
          'Scale operations',
        ],
      },
      {
        id: 'persona_founder',
        type: 'founder',
        name: 'Founder/CEO',
        description: 'Strategic decision maker focused on growth and vision',
        characteristics: {
          technicalLevel: 'beginner',
          businessFocus: 'strategy',
          preferredDetailLevel: 'high-level',
          preferredFormat: 'visual',
          automationComfort: 'medium',
        },
        needs: [
          'High-level insights',
          'Strategic recommendations',
          'ROI metrics',
          'Growth opportunities',
        ],
        painPoints: [
          'Information overload',
          'Lack of strategic insights',
          'Difficulty prioritizing',
        ],
        goals: [
          'Make data-driven decisions',
          'Identify growth opportunities',
          'Optimize resource allocation',
        ],
      },
      {
        id: 'persona_accountant',
        type: 'accountant',
        name: 'Accountant/Finance',
        description: 'Manages financial data, reconciliation, and reporting',
        characteristics: {
          technicalLevel: 'intermediate',
          businessFocus: 'finance',
          preferredDetailLevel: 'detailed',
          preferredFormat: 'data',
          automationComfort: 'high',
        },
        needs: [
          'Accurate reconciliation',
          'Detailed financial reports',
          'Audit trails',
          'Compliance',
        ],
        painPoints: [
          'Manual data entry',
          'Reconciliation errors',
          'Time-consuming reporting',
        ],
        goals: [
          'Ensure accuracy',
          'Reduce manual work',
          'Improve auditability',
        ],
      },
      {
        id: 'persona_consultant',
        type: 'consultant',
        name: 'Consultant',
        description: 'Provides expert analysis and recommendations',
        characteristics: {
          technicalLevel: 'advanced',
          businessFocus: 'strategy',
          preferredDetailLevel: 'detailed',
          preferredFormat: 'mixed',
          automationComfort: 'high',
        },
        needs: [
          'Deep analysis capabilities',
          'Custom workflows',
          'Client-specific insights',
          'Professional reports',
        ],
        painPoints: [
          'Limited customization',
          'Generic outputs',
          'Time-consuming analysis',
        ],
        goals: [
          'Deliver expert insights',
          'Customize solutions',
          'Scale consulting services',
        ],
      },
    ];

    defaultPersonas.forEach(persona => {
      this.personas.set(persona.type, persona);
    });
  }

  /**
   * Get persona definition
   */
  getPersona(type: PersonaType): PersonaDefinition | undefined {
    return this.personas.get(type);
  }

  /**
   * Detect user persona from behavior
   */
  detectPersona(userId: string): PersonaType {
    const profile = this.userProfiles.get(userId);
    if (profile) {
      return profile.primaryPersona;
    }

    // Default detection logic (would be more sophisticated)
    return 'ops_lead';
  }

  /**
   * Create or update user profile
   */
  createUserProfile(profile: UserProfile): void {
    this.userProfiles.set(profile.userId, profile);
  }

  /**
   * Get user profile
   */
  getUserProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  /**
   * Get adaptive content configuration for persona
   */
  getAdaptiveContentConfig(personaType: PersonaType): AdaptiveContentConfig {
    const persona = this.personas.get(personaType);
    if (!persona) {
      return this.getDefaultConfig();
    }

    const { characteristics } = persona;

    let explanationDepth: AdaptiveContentConfig['explanationDepth'] = 'moderate';
    if (characteristics.preferredDetailLevel === 'high-level') {
      explanationDepth = 'simple';
    } else if (characteristics.preferredDetailLevel === 'detailed') {
      explanationDepth = 'detailed';
    }

    return {
      explanationDepth,
      includeTechnicalDetails: characteristics.technicalLevel !== 'beginner',
      includeBusinessContext: true,
      visualizationPreference: characteristics.preferredFormat === 'visual' ? 'charts' :
                                characteristics.preferredFormat === 'data' ? 'tables' :
                                characteristics.preferredFormat === 'text' ? 'narrative' : 'mixed',
      automationSuggestions: characteristics.automationComfort !== 'low',
    };
  }

  /**
   * Adapt dashboard content for persona
   */
  adaptDashboard(personaType: PersonaType, content: {
    metrics: Array<{ name: string; value: number; details?: unknown }>;
    workflows: Array<{ id: string; name: string; status: string }>;
  }): {
    metrics: Array<{ name: string; value: number; details?: unknown }>;
    workflows: Array<{ id: string; name: string; status: string }>;
    layout: 'compact' | 'standard' | 'detailed';
  } {
    const persona = this.personas.get(personaType);
    const _config = this.getAdaptiveContentConfig(personaType);

    let layout: 'compact' | 'standard' | 'detailed' = 'standard';
    if (persona?.characteristics.preferredDetailLevel === 'high-level') {
      layout = 'compact';
    } else if (persona?.characteristics.preferredDetailLevel === 'detailed') {
      layout = 'detailed';
    }

    // Filter metrics based on persona needs
    const adaptedMetrics = content.metrics.filter(metric => {
      if (personaType === 'founder') {
        // Founders care about high-level metrics
        return ['revenue', 'growth', 'roi'].some(keyword => 
          metric.name.toLowerCase().includes(keyword)
        );
      }
      return true;
    });

    return {
      metrics: adaptedMetrics,
      workflows: content.workflows,
      layout,
    };
  }

  /**
   * Adapt report depth for persona
   */
  adaptReportDepth(personaType: PersonaType): 'summary' | 'standard' | 'detailed' {
    const persona = this.personas.get(personaType);
    if (!persona) return 'standard';

    switch (persona.characteristics.preferredDetailLevel) {
      case 'high-level':
        return 'summary';
      case 'detailed':
        return 'detailed';
      default:
        return 'standard';
    }
  }

  /**
   * Get automation suggestions for persona
   */
  getAutomationSuggestions(personaType: PersonaType): string[] {
    const persona = this.personas.get(personaType);
    if (!persona) return [];

    const suggestions: string[] = [];

    if (persona.type === 'ops_lead') {
      suggestions.push(
        'Automate daily reconciliation tasks',
        'Set up workflow monitoring alerts',
        'Create automated performance reports'
      );
    } else if (persona.type === 'founder') {
      suggestions.push(
        'Get weekly strategic insights',
        'Automate executive reporting',
        'Set up growth opportunity alerts'
      );
    } else if (persona.type === 'accountant') {
      suggestions.push(
        'Automate monthly reconciliation',
        'Set up compliance checks',
        'Create automated audit reports'
      );
    } else if (persona.type === 'consultant') {
      suggestions.push(
        'Create custom client workflows',
        'Automate analysis generation',
        'Set up client-specific reporting'
      );
    }

    return suggestions;
  }

  /**
   * Get default config
   */
  private getDefaultConfig(): AdaptiveContentConfig {
    return {
      explanationDepth: 'moderate',
      includeTechnicalDetails: true,
      includeBusinessContext: true,
      visualizationPreference: 'mixed',
      automationSuggestions: true,
    };
  }
}

// Export singleton instance
export const personaEngine = new PersonaEngine();
