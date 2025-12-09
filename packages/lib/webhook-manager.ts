import { prisma } from './database';
import { PaymentService } from './payments';
import { paypalService } from './payments-paypal';
import { logger } from './observability';

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
}

export interface WebhookEvent {
  id: string;
  source: string;
  event: string;
  payload: any;
  processed: boolean;
  retryCount: number;
  lastAttempt?: Date;
  nextRetry?: Date;
  error?: string;
  createdAt: Date;
}

export class WebhookManager {
  private retryQueue: Map<string, NodeJS.Timeout> = new Map();
  private maxRetries = 5;
  private baseRetryDelay = 1000; // 1 second

  async registerWebhook(config: WebhookConfig, orgId: string): Promise<string> {
    const webhook = await prisma.webhookEvent.create({
      data: {
        source: 'webhook-registration',
        event: 'webhook.registered',
        payload: {
          url: config.url,
          events: config.events,
          retryAttempts: config.retryAttempts,
          retryDelay: config.retryDelay,
          timeout: config.timeout,
        },
        orgId,
      },
    });

    return webhook.id;
  }

  async processWebhook(webhookId: string, event: unknown): Promise<void> {
    try {
      // Store the webhook event
      const webhookEvent = await prisma.webhookEvent.create({
        data: {
          source: event.source || 'unknown',
          event: event.type || event.event || 'unknown',
          payload: event,
          orgId: event.orgId || 'unknown',
        },
      });

      // Process based on source
      switch (event.source || 'unknown') {
        case 'stripe':
          await this.processStripeWebhook(event);
          break;
        case 'paypal':
          await this.processPayPalWebhook(event);
          break;
        case 'github':
          await this.processGitHubWebhook(event);
          break;
        case 'slack':
          await this.processSlackWebhook(event);
          break;
        default:
          await this.processGenericWebhook(event);
      }

      // Mark as processed
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { processed: true },
      });

    } catch (error) {
      logger.error({ err: error, webhookId }, 'Webhook processing failed');
      
      // Schedule retry
      await this.scheduleRetry(webhookId, error);
    }
  }

  private async processStripeWebhook(event: { headers?: Record<string, string>; body?: unknown }): Promise<void> {
    try {
      // Verify webhook signature
      const signature = event.headers['stripe-signature'];
      const payload = JSON.stringify(event.body);
      
      if (signature) {
        const verifiedEvent = await PaymentService.verifyWebhookSignature(payload, signature);
        await PaymentService.handleWebhookEvent(verifiedEvent);
      }
    } catch (error) {
      logger.error({ err: error }, 'Stripe webhook processing failed');
      throw error;
    }
  }

  private async processPayPalWebhook(event: { headers?: Record<string, string>; body?: unknown }): Promise<void> {
    try {
      // Verify webhook signature
      const signature = event.headers['paypal-transmission-sig'];
      const payload = JSON.stringify(event.body);
      
      if (signature) {
        const isValid = await paypalService.verifyWebhookSignature(payload, signature);
        if (isValid) {
          await paypalService.handleWebhookEvent(event.body);
        }
      }
    } catch (error) {
      logger.error({ err: error }, 'PayPal webhook processing failed');
      throw error;
    }
  }

  private async processGitHubWebhook(event: { headers?: Record<string, string>; body?: unknown }): Promise<void> {
    try {
      // Process GitHub webhook events
      const githubEvent = event.headers['x-github-event'];
      const payload = event.body;

      switch (githubEvent) {
        case 'push':
          await this.handleGitHubPush(payload);
          break;
        case 'pull_request':
          await this.handleGitHubPullRequest(payload);
          break;
        case 'issues':
          await this.handleGitHubIssue(payload);
          break;
        default:
          logger.info({ event: githubEvent }, `Unhandled GitHub event: ${githubEvent}`);
      }
    } catch (error) {
      logger.error({ err: error }, 'GitHub webhook processing failed');
      throw error;
    }
  }

  private async processSlackWebhook(event: { body?: unknown }): Promise<void> {
    try {
      // Process Slack webhook events
      const slackEvent = event.body;
      
      if (slackEvent.type === 'event_callback') {
        await this.handleSlackEvent(slackEvent.event);
      } else if (slackEvent.type === 'url_verification') {
        // Handle Slack URL verification
        return { challenge: slackEvent.challenge } as any;
      }
    } catch (error) {
      logger.error({ err: error }, 'Slack webhook processing failed');
      throw error;
    }
  }

  private async processGenericWebhook(event: { source?: string; type?: string; orgId?: string }): Promise<void> {
    try {
      // Process generic webhook events
      logger.info({ event }, 'Processing generic webhook');
      
      // Store in database for later processing
      await prisma.webhookEvent.create({
        data: {
          source: event.source || 'generic',
          event: event.type || 'unknown',
          payload: event,
          orgId: event.orgId || 'unknown',
        },
      });
    } catch (error) {
      logger.error({ err: error }, 'Generic webhook processing failed');
      throw error;
    }
  }

  private async handleGitHubPush(payload: unknown): Promise<void> {
    const p = payload as { repository?: { full_name?: string } };
    logger.info({ repository: p.repository?.full_name }, 'GitHub push event');
    
    // Store push event
    await prisma.webhookEvent.create({
      data: {
        source: 'github',
        event: 'push',
        payload,
        orgId: 'github-integration',
      },
    });
  }

  private async handleGitHubPullRequest(payload: unknown): Promise<void> {
    const p = payload as { pull_request?: { title?: string } };
    logger.info({ title: p.pull_request?.title }, 'GitHub pull request event');
    
    // Store PR event
    await prisma.webhookEvent.create({
      data: {
        source: 'github',
        event: 'pull_request',
        payload,
        orgId: 'github-integration',
      },
    });
  }

  private async handleGitHubIssue(payload: unknown): Promise<void> {
    const p = payload as { issue?: { title?: string } };
    logger.info({ title: p.issue?.title }, 'GitHub issue event');
    
    // Store issue event
    await prisma.webhookEvent.create({
      data: {
        source: 'github',
        event: 'issue',
        payload,
        orgId: 'github-integration',
      },
    });
  }

  private async handleSlackEvent(event: unknown): Promise<void> {
    const e = event as { type?: string };
    logger.info({ eventType: e.type }, 'Slack event');
    
    // Store Slack event
    await prisma.webhookEvent.create({
      data: {
        source: 'slack',
        event: event.type,
        payload: event,
        orgId: 'slack-integration',
      },
    });
  }

  private async scheduleRetry(webhookId: string, error: any): Promise<void> {
    const webhookEvent = await prisma.webhookEvent.findUnique({
      where: { id: webhookId },
    });

    if (!webhookEvent) return;

    const retryCount = webhookEvent.retryCount || 0;
    
    if (retryCount >= this.maxRetries) {
      logger.error({ webhookId, retryCount }, `Webhook ${webhookId} exceeded max retries`);
      return;
    }

    const delay = this.baseRetryDelay * Math.pow(2, retryCount); // Exponential backoff
    const nextRetry = new Date(Date.now() + delay);

    // Update webhook event with retry info
    await prisma.webhookEvent.update({
      where: { id: webhookId },
      data: {
        retryCount: retryCount + 1,
        lastAttempt: new Date(),
        nextRetry,
        error: error.message,
      },
    });

    // Schedule retry
    const timeout = setTimeout(async () => {
      try {
        await this.processWebhook(webhookId, webhookEvent.payload);
      } catch (retryError) {
        logger.error({ err: retryError, webhookId }, `Webhook retry failed for ${webhookId}`);
      }
    }, delay);

    this.retryQueue.set(webhookId, timeout);
  }

  async getWebhookEvents(orgId: string, limit = 50, offset = 0): Promise<WebhookEvent[]> {
    const events = await prisma.webhookEvent.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return events.map((event: any) => ({
      id: event.id,
      source: event.source,
      event: event.event,
      payload: event.payload,
      processed: event.processed,
      retryCount: event.retryCount || 0,
      lastAttempt: event.lastAttempt,
      nextRetry: event.nextRetry,
      error: event.error,
      createdAt: event.createdAt,
    }));
  }

  async getWebhookStats(orgId: string): Promise<any> {
    const total = await prisma.webhookEvent.count({
      where: { orgId },
    });

    const processed = await prisma.webhookEvent.count({
      where: { orgId, processed: true },
    });

    const failed = await prisma.webhookEvent.count({
      where: { 
        orgId, 
        processed: false,
        retryCount: { gte: this.maxRetries },
      },
    });

    const pending = await prisma.webhookEvent.count({
      where: { 
        orgId, 
        processed: false,
        retryCount: { lt: this.maxRetries },
      },
    });

    return {
      total,
      processed,
      failed,
      pending,
      successRate: total > 0 ? (processed / total) * 100 : 0,
    };
  }

  async cleanupOldWebhooks(daysOld = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await prisma.webhookEvent.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        processed: true,
      },
    });
  }

  async cancelRetry(webhookId: string): Promise<void> {
    const timeout = this.retryQueue.get(webhookId);
    if (timeout) {
      clearTimeout(timeout);
      this.retryQueue.delete(webhookId);
    }

    await prisma.webhookEvent.update({
      where: { id: webhookId },
      data: {
        retryCount: this.maxRetries, // Mark as failed
        error: 'Cancelled by user',
      },
    });
  }

  async retryFailedWebhooks(orgId: string): Promise<void> {
    const failedWebhooks = await prisma.webhookEvent.findMany({
      where: {
        orgId,
        processed: false,
        retryCount: { lt: this.maxRetries },
      },
    });

    for (const webhook of failedWebhooks) {
      await this.scheduleRetry(webhook.id, new Error('Manual retry'));
    }
  }
}

export const webhookManager = new WebhookManager();
