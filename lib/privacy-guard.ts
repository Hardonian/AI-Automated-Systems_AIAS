/**
 * Re-export PrivacyGuard from ai/privacy_guard
 * This allows guardian/core.ts to import it without hitting tsconfig exclusions
 */

export { PrivacyGuard, type PIIPattern, type RedactionResult, type ComplianceReport } from '../ai/privacy_guard.js';
