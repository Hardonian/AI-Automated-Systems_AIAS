/**
 * Tests for feature flags
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import flagsConfig from '@/config/flags.json';
import { getAllFlags, getFlag, getFlagMetadata, isCanaryEnabled, isFlagEnabled } from '@/src/lib/flags';

describe('lib/flags', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalCanaryEnabled = flagsConfig.flags.canary_example.enabled;

  beforeEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    flagsConfig.flags.canary_example.enabled = originalCanaryEnabled;
  });

  it('should return false for unknown flags', () => {
    expect(isFlagEnabled('does_not_exist')).toBe(false);
    expect(getFlag('does_not_exist')).toBeNull();
  });

  it('should respect environment restrictions', () => {
    process.env.NODE_ENV = 'production';

    expect(isFlagEnabled('canary_example')).toBe(false);
  });

  it('should return enabled flags for the current environment', () => {
    process.env.NODE_ENV = 'production';

    const flags = getAllFlags();

    expect(flags.edge_ai_models).toBe(true);
    expect(flags.canary_example).toBeUndefined();
  });

  it('should only allow canary flags in staging', () => {
    process.env.NODE_ENV = 'staging';
    flagsConfig.flags.canary_example.enabled = true;

    expect(isCanaryEnabled('canary_example')).toBe(true);

    process.env.NODE_ENV = 'production';

    expect(isCanaryEnabled('canary_example')).toBe(false);
  });

  it('should expose flag metadata and enabled list', () => {
    process.env.NODE_ENV = 'production';

    const metadata = getFlagMetadata();

    expect(metadata.currentEnv).toBe('production');
    expect(metadata.flags.edge_ai_models.enabled).toBe(true);
    expect(metadata.enabledFlags).toContain('edge_ai_models');
  });
});
