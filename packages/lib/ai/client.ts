import { logger } from '../observability.js';

import { createAIProvider, createFallbackAIProvider } from './providers.js';
import { ChatRequest, AuditRequest, EstimateRequest, ContentGenerationRequest, WorkflowGenerationRequest , AIProvider } from './types.js';


export class AIClient {
  private primaryProvider: AIProvider | null;
  private fallbackProvider: AIProvider | null;

  constructor() {
    try {
      this.primaryProvider = createAIProvider();
    } catch (error) {
      logger.warn({ err: error }, 'Failed to initialize primary AI provider');
      this.primaryProvider = null;
    }

    try {
      this.fallbackProvider = createFallbackAIProvider();
    } catch (error) {
      logger.warn({ err: error }, 'Failed to initialize fallback AI provider');
      this.fallbackProvider = null;
    }
  }

  private async executeWithFallback<T>(
    operation: (provider: AIProvider) => Promise<T>,
    operationName: string
  ): Promise<T> {
    if (this.primaryProvider) {
      try {
        return await operation(this.primaryProvider);
      } catch (error) {
        logger.warn({ err: error, operation: operationName }, `Primary provider failed for ${operationName}`);
      }
    }

    if (this.fallbackProvider) {
      try {
        return await operation(this.fallbackProvider);
      } catch (error) {
        logger.warn({ err: error, operation: operationName }, `Fallback provider failed for ${operationName}`);
      }
    }

    throw new Error(`All AI providers failed for ${operationName}`);
  }

  async chat(request: ChatRequest) {
    return this.executeWithFallback(
      (provider) => provider.chat(request),
      'chat'
    );
  }

  async *streamChat(request: ChatRequest) {
    if (this.primaryProvider) {
      try {
        yield* this.primaryProvider.streamChat(request);
        return;
      } catch (error) {
        logger.warn({ err: error }, 'Primary provider failed for streamChat');
      }
    }

    if (this.fallbackProvider) {
      try {
        yield* this.fallbackProvider.streamChat(request);
        return;
      } catch (error) {
        logger.warn({ err: error }, 'Fallback provider failed for streamChat');
      }
    }

    throw new Error('All AI providers failed for streamChat');
  }

  async generateAudit(request: AuditRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateAudit(request),
      'generateAudit'
    );
  }

  async generateEstimate(request: EstimateRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateEstimate(request),
      'generateEstimate'
    );
  }

  async generateContent(request: ContentGenerationRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateContent(request),
      'generateContent'
    );
  }

  async generateWorkflow(request: WorkflowGenerationRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateWorkflow(request),
      'generateWorkflow'
    );
  }
}

export const aiClient = new AIClient();