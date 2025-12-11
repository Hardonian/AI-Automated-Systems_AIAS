import { config } from '@ai-consultancy/config';
import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

// import { AIGenerators } from './ai/generators'; // Temporarily disabled due to build issues
import { prisma } from './database';
// Note: aiClient import reserved for future AI queue processing
import { logger } from './observability';

// Create Redis connection with proper typing for ES modules
const connection = new Redis(config.redis.url || 'redis://localhost:6379');

// Queue definitions
export const feedIngestQueue = new Queue('feeds:ingest', { connection });
export const aiGenerateQueue = new Queue('ai:generate', { connection });
export const reportPdfQueue = new Queue('reports:pdf', { connection });
export const billingSyncQueue = new Queue('billing:sync', { connection });

// Job types
export interface FeedIngestJob {
  sourceId: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AIGenerateJob {
  type: 'audit' | 'estimate' | 'content' | 'workflow';
  userId: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ReportPdfJob {
  reportId: string;
  userId: string;
  data: Record<string, unknown>;
}

export interface BillingSyncJob {
  orgId: string;
  subscriptionId: string;
  event: string;
}

// Queue processors
export class QueueProcessors {
  static async processFeedIngest(job: Job<FeedIngestJob>): Promise<void> {
    const { sourceId, data, metadata: _metadata } = job.data;
    
    try {
      // Update ingest event status
      const ingestEvent = await prisma.ingestEvent.create({
        data: {
          sourceId,
          status: 'RUNNING',
          stats: { startedAt: new Date() },
        },
      });

      // Get source configuration
      const source = await prisma.source.findUnique({
        where: { id: sourceId },
      });

      if (!source) {
        throw new Error('Source not found');
      }

      let processedData: Record<string, unknown>[] = [];

      // Process based on source type
      switch (source.type) {
        case 'SHOPIFY_JSON':
          processedData = await this.processShopifyData(data);
          break;
        case 'GOOGLE_TRENDS_CSV':
          processedData = await this.processGoogleTrendsData(data);
          break;
        case 'TIKTOK_BUSINESS_JSON':
          processedData = await this.processTikTokData(data);
          break;
        case 'ALIEXPRESS_CSV':
          processedData = await this.processAliExpressData(data);
          break;
        case 'GENERIC_CSV':
          processedData = await this.processGenericCsvData(data);
          break;
        case 'GENERIC_JSON':
          processedData = await this.processGenericJsonData(data);
          break;
        default:
          throw new Error(`Unsupported source type: ${source.type}`);
      }

      // Store processed data
      await this.storeProcessedData(source.type, processedData, source.orgId);

      // Update source last run
      await prisma.source.update({
        where: { id: sourceId },
        data: { lastRun: new Date() },
      });

      // Update ingest event
      await prisma.ingestEvent.update({
        where: { id: ingestEvent.id },
        data: {
          status: 'COMPLETED',
          stats: {
            startedAt: ingestEvent.stats?.startedAt,
            completedAt: new Date(),
            recordsProcessed: processedData.length,
          },
        },
      });

      logger.info({ sourceId, recordCount: processedData.length }, `Processed ${processedData.length} records for source ${sourceId}`);
    } catch (error: unknown) {
      logger.error({ err: error, sourceId }, 'Feed ingest error');
      
      // Update ingest event with error
      await prisma.ingestEvent.updateMany({
        where: { sourceId },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  static async processAIGenerate(job: Job<AIGenerateJob>): Promise<unknown> {
    const { type, userId, data, metadata: _metadata } = job.data;
    
    try {
      let result: unknown;

      // Temporarily stubbed out - AI generators module disabled due to build issues
      // TODO: Re-enable when AI module build issues are resolved
      switch (type) {
        case 'audit': {
          const website: string = typeof data.website === 'string' ? data.website : String(data.website);
          const auditType: 'seo' | 'performance' | 'accessibility' | 'security' | 'comprehensive' = 
            typeof data.type === 'string' && ['seo', 'performance', 'accessibility', 'security', 'comprehensive'].includes(data.type)
              ? data.type as 'seo' | 'performance' | 'accessibility' | 'security' | 'comprehensive'
              : 'comprehensive';
          // Stub result - AI generation temporarily disabled
          result = {
            overallScore: 75,
            categories: [],
            criticalIssues: [],
            quickWins: [],
            estimatedImpact: 'AI generation temporarily disabled',
            nextSteps: ['Re-enable AI module when build issues are resolved']
          };
          break;
        }
        case 'estimate': {
          const projectType: 'website' | 'ecommerce' | 'saas' | 'mobile' | 'ai-integration' = 
            typeof data.projectType === 'string' && ['website', 'ecommerce', 'saas', 'mobile', 'ai-integration'].includes(data.projectType)
              ? data.projectType as 'website' | 'ecommerce' | 'saas' | 'mobile' | 'ai-integration'
              : 'website';
          const scope: { pages: number; features: string[]; integrations: string[]; timeline: 'rush' | 'standard' | 'flexible' } = 
            typeof data.scope === 'object' && data.scope !== null ? data.scope as { pages: number; features: string[]; integrations: string[]; timeline: 'rush' | 'standard' | 'flexible' } : { pages: 0, features: [], integrations: [], timeline: 'standard' };
          const requirementsData = typeof data.requirements === 'object' && data.requirements !== null ? data.requirements as Record<string, unknown> : {};
          const requirements: { design: boolean; development: boolean; testing: boolean; deployment: boolean; maintenance: boolean } = { 
            design: Boolean(requirementsData.design),
            development: Boolean(requirementsData.development),
            testing: Boolean(requirementsData.testing),
            deployment: Boolean(requirementsData.deployment),
            maintenance: Boolean(requirementsData.maintenance)
          };
          // Stub result - AI generation temporarily disabled
          result = {
            totalCost: { min: 10000, max: 50000, currency: 'USD' },
            timeline: { min: 4, max: 12 },
            phases: [],
            assumptions: ['AI generation temporarily disabled'],
            risks: [],
            recommendations: ['Re-enable AI module when build issues are resolved']
          };
          break;
        }
        case 'content': {
          const topic: string = typeof data.topic === 'string' ? data.topic : String(data.topic);
          const contentType: 'blog-post' | 'social-media' | 'email' | 'ad-copy' | 'product-description' = 
            typeof data.type === 'string' && ['blog-post', 'social-media', 'email', 'ad-copy', 'product-description'].includes(data.type)
              ? data.type as 'blog-post' | 'social-media' | 'email' | 'ad-copy' | 'product-description'
              : 'blog-post';
          const tone: 'professional' | 'casual' | 'technical' | 'creative' | 'persuasive' = 
            typeof data.tone === 'string' && ['professional', 'casual', 'technical', 'creative', 'persuasive'].includes(data.tone)
              ? data.tone as 'professional' | 'casual' | 'technical' | 'creative' | 'persuasive'
              : 'professional';
          const targetAudience: string | undefined = typeof data.targetAudience === 'string' ? data.targetAudience : undefined;
          const keywords: string[] | undefined = Array.isArray(data.keywords) ? data.keywords.map(k => String(k)) : undefined;
          // Stub result - AI generation temporarily disabled
          result = {
            title: `Content Plan for ${topic}`,
            outline: [],
            targetKeywords: keywords || [],
            estimatedReadTime: 5,
            callToAction: 'AI generation temporarily disabled',
            socialMediaVariants: []
          };
          break;
        }
        case 'workflow': {
          const businessType: string = typeof data.businessType === 'string' ? data.businessType : String(data.businessType);
          const goals: string[] = Array.isArray(data.goals) ? data.goals.map(g => String(g)) : [];
          const currentProcesses: string[] = Array.isArray(data.currentProcesses) ? data.currentProcesses.map(p => String(p)) : [];
          const painPoints: string[] = Array.isArray(data.painPoints) ? data.painPoints.map(p => String(p)) : [];
          const budget: 'low' | 'medium' | 'high' = 
            typeof data.budget === 'string' && ['low', 'medium', 'high'].includes(data.budget)
              ? data.budget as 'low' | 'medium' | 'high'
              : 'medium';
          const timeline: 'immediate' | '1-3months' | '3-6months' | '6-12months' = 
            typeof data.timeline === 'string' && ['immediate', '1-3months', '3-6months', '6-12months'].includes(data.timeline)
              ? data.timeline as 'immediate' | '1-3months' | '3-6months' | '6-12months'
              : '3-6months';
          // Stub result - AI generation temporarily disabled
          result = {
            name: `Workflow for ${businessType}`,
            description: 'AI generation temporarily disabled',
            steps: [],
            integrations: [],
            metrics: [],
            estimatedROI: 'N/A',
            implementationTimeline: 'N/A'
          };
          break;
        }
        default:
          throw new Error(`Unsupported AI generation type: ${type}`);
      }

      // Store AI run record
      await prisma.aiRun.create({
        data: {
          userId,
          kind: type.toUpperCase() as 'AUDIT' | 'ESTIMATE' | 'CONTENT' | 'WORKFLOW',
          provider: 'openai', // This would be determined by the AI client
          model: 'gpt-4',
          tokensIn: 0, // This would be populated by the AI client
          tokensOut: 0,
          cost: 0,
          durationMs: 0,
          metadata: {
            type,
            data,
            result,
          },
        },
      });

      logger.info({ type, userId }, `Generated ${type} for user ${userId}`);
      return result;
    } catch (error: unknown) {
      logger.error({ err: error, type, userId }, 'AI generation error');
      throw error;
    }
  }

  static async processReportPdf(job: Job<ReportPdfJob>): Promise<void> {
    const { reportId, userId: _userId, data } = job.data;
    
    try {
      // Update report status
      await prisma.report.update({
        where: { id: reportId },
        data: { status: 'GENERATING' },
      });

      // Generate PDF (this would use a PDF generation library)
      const pdfBuffer: Buffer = await this.generatePdf(data);

      // Upload to storage (this would use Supabase storage)
      const fileUrl: string = await this.uploadPdf(pdfBuffer, reportId);

      // Update report with file URL
      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'COMPLETED',
          fileUrl,
        },
      });

      logger.info({ reportId }, `Generated PDF report ${reportId}`);
    } catch (error: unknown) {
      logger.error({ err: error, reportId }, 'PDF generation error');
      
      await prisma.report.update({
        where: { id: reportId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }

  static async processBillingSync(job: Job<BillingSyncJob>): Promise<void> {
    const { orgId, subscriptionId, event } = job.data;
    
    try {
      // Sync subscription data with Stripe
      // This would fetch the latest subscription data and update the database
      logger.info({ orgId, subscriptionId, event }, `Syncing billing for org ${orgId}, subscription ${subscriptionId}, event ${event}`);
    } catch (error: unknown) {
      logger.error({ err: error, orgId, subscriptionId }, 'Billing sync error');
      throw error;
    }
  }

  // Helper methods for data processing
  private static async processShopifyData(data: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // Process Shopify product data
    const products: unknown = data.products;
    if (products !== undefined && Array.isArray(products)) {
      return products.map((product: unknown): Record<string, unknown> => {
        const productRecord: Record<string, unknown> = typeof product === 'object' && product !== null ? product as Record<string, unknown> : {};
        const variants: unknown = productRecord.variants;
        const variantsArray: unknown[] = Array.isArray(variants) ? variants : [];
        const firstVariant: Record<string, unknown> = variantsArray[0] !== undefined && typeof variantsArray[0] === 'object' && variantsArray[0] !== null ? variantsArray[0] as Record<string, unknown> : {};
        const price: unknown = firstVariant.price;
        const priceString: string = typeof price === 'string' ? price : String(price ?? '0');
        const tags: unknown = productRecord.tags;
        const tagsString: string = typeof tags === 'string' ? tags : '';
        return {
          name: typeof productRecord.title === 'string' ? productRecord.title : String(productRecord.title ?? ''),
          description: typeof productRecord.body_html === 'string' ? productRecord.body_html : String(productRecord.body_html ?? ''),
          price: parseFloat(priceString),
          currency: 'USD',
          category: typeof productRecord.product_type === 'string' ? productRecord.product_type : String(productRecord.product_type ?? ''),
          tags: tagsString ? tagsString.split(',').map((tag: string): string => tag.trim()) : [],
          metadata: {
            shopifyId: productRecord.id,
            handle: productRecord.handle,
            vendor: productRecord.vendor,
            createdAt: productRecord.created_at,
            updatedAt: productRecord.updated_at,
          },
        };
      });
    }
    return [];
  }

  private static async processGoogleTrendsData(_data: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // Process Google Trends CSV data
    // This would parse CSV and extract trend data
    return [];
  }

  private static async processTikTokData(_data: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // Process TikTok Business API data
    return [];
  }

  private static async processAliExpressData(_data: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // Process AliExpress CSV data
    return [];
  }

  private static async processGenericCsvData(_data: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // Process generic CSV data
    return [];
  }

  private static async processGenericJsonData(_data: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // Process generic JSON data
    return [];
  }

  private static async storeProcessedData(type: string, data: Record<string, unknown>[], _orgId: string): Promise<void> {
    // Store processed data in appropriate tables
    switch (type) {
      case 'SHOPIFY_JSON':
        await prisma.product.createMany({
          data: data.map((item: Record<string, unknown>): Record<string, unknown> => ({
            ...item,
            metadata: (typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {}) as Record<string, unknown>,
          })),
        });
        break;
      case 'GOOGLE_TRENDS_CSV':
        await prisma.trend.createMany({
          data: data.map((item: Record<string, unknown>): Record<string, unknown> => ({
            ...item,
            metadata: (typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {}) as Record<string, unknown>,
          })),
        });
        break;
      // Add other cases as needed
    }
  }

  private static async generatePdf(_data: Record<string, unknown>): Promise<Buffer> {
    // This would use a PDF generation library like Puppeteer or @react-pdf/renderer
    // For now, return a dummy buffer
    return Buffer.from('PDF content would be generated here');
  }

  private static async uploadPdf(_buffer: Buffer, reportId: string): Promise<string> {
    // Get Supabase URL from environment variables dynamically
    const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.SUPABASE_URL || 
                       '';
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is required for PDF upload');
    }
    
    // Extract project ref from Supabase URL to construct storage URL
    const matchResult: RegExpMatchArray | null = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
    const projectRef: string = matchResult?.[1] ?? '';
    
    if (!projectRef) {
      throw new Error('Invalid Supabase URL format');
    }
    
    return `https://${projectRef}.supabase.co/storage/v1/object/public/reports/${reportId}.pdf`;
  }
}

// Start workers
export function startWorkers(): void {
  // Feed ingest worker
  new Worker('feeds:ingest', QueueProcessors.processFeedIngest, { connection });

  // AI generate worker
  new Worker('ai:generate', QueueProcessors.processAIGenerate, { connection });

  // Report PDF worker
  new Worker('reports:pdf', QueueProcessors.processReportPdf, { connection });

  // Billing sync worker
  new Worker('billing:sync', QueueProcessors.processBillingSync, { connection });

  logger.info('All queue workers started');
}