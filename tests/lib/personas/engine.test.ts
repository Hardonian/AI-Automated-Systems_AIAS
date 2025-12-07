/**
 * Tests for Persona Engine
 */

import { describe, it, expect } from 'vitest';
import { PersonaEngine } from '@/lib/personas/engine';

describe('PersonaEngine', () => {
  const personaEngine = new PersonaEngine();

  describe('getPersona', () => {
    it('should get persona definition', () => {
      const persona = personaEngine.getPersona('ops_lead');
      expect(persona).toBeDefined();
      expect(persona?.type).toBe('ops_lead');
      expect(persona?.name).toBe('Operations Lead');
    });

    it('should return undefined for non-existent persona', () => {
      const persona = personaEngine.getPersona('non_existent' as any);
      expect(persona).toBeUndefined();
    });
  });

  describe('detectPersona', () => {
    it('should detect persona from user ID', () => {
      const persona = personaEngine.detectPersona('user-1');
      expect(['ops_lead', 'founder', 'accountant', 'consultant']).toContain(persona);
    });
  });

  describe('createUserProfile', () => {
    it('should create user profile', () => {
      personaEngine.createUserProfile({
        userId: 'user-profile-1',
        primaryPersona: 'founder',
      });

      const profile = personaEngine.getUserProfile('user-profile-1');
      expect(profile).toBeDefined();
      expect(profile?.primaryPersona).toBe('founder');
    });
  });

  describe('getAdaptiveContentConfig', () => {
    it('should get adaptive content config for persona', () => {
      const config = personaEngine.getAdaptiveContentConfig('founder');
      expect(config).toBeDefined();
      expect(config.explanationDepth).toBe('simple');
      expect(config.includeTechnicalDetails).toBe(false);
    });

    it('should get detailed config for consultant', () => {
      const config = personaEngine.getAdaptiveContentConfig('consultant');
      expect(config).toBeDefined();
      expect(config.explanationDepth).toBe('detailed');
      expect(config.includeTechnicalDetails).toBe(true);
    });
  });

  describe('adaptDashboard', () => {
    it('should adapt dashboard for persona', () => {
      const content = {
        metrics: [
          { name: 'Revenue', value: 1000 },
          { name: 'Users', value: 100 },
        ],
        workflows: [
          { id: 'wf-1', name: 'Workflow 1', status: 'active' },
        ],
      };

      const adapted = personaEngine.adaptDashboard('founder', content);
      expect(adapted).toBeDefined();
      expect(adapted.layout).toBeDefined();
      expect(['compact', 'standard', 'detailed']).toContain(adapted.layout);
    });
  });

  describe('getAutomationSuggestions', () => {
    it('should get automation suggestions for persona', () => {
      const suggestions = personaEngine.getAutomationSuggestions('ops_lead');
      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});
