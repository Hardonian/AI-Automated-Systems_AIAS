/**
 * Advanced Lead Scoring System
 * Multi-factor lead scoring with machine learning capabilities
 */

import { createClient } from '@supabase/supabase-js';

import { autopilotWorkflowService } from './autopilot-workflows';

import { env } from '@/lib/env';
import { logger } from '@/lib/logging/structured-logger';

export interface LeadScoringFactors {
  demographic: number; // 0-30
  behavioral: number; // 0-30
  engagement: number; // 0-20
  fit: number; // 0-20
}

export interface LeadScore {
  total: number; // 0-100
  factors: LeadScoringFactors;
  qualified: boolean;
  priority: 'hot' | 'warm' | 'cold';
  recommendations: string[];
}

export function calculateBehavioralScoreFromActivities(
  activities: Array<{ activity_type: string; created_at: string }>
): number {
  if (!activities || activities.length === 0) {
    return 0;
  }

  const highValueActivities = new Set([
    'demo_requested',
    'pricing_viewed',
    'trial_started',
  ]);
  const activityTypes = new Set<string>();
  const recentCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let hasRecentActivity = false;
  let hasHighValue = false;

  for (const activity of activities) {
    activityTypes.add(activity.activity_type);
    if (!hasRecentActivity) {
      const createdAt = new Date(activity.created_at).getTime();
      if (createdAt > recentCutoff) {
        hasRecentActivity = true;
      }
    }
    if (!hasHighValue && highValueActivities.has(activity.activity_type)) {
      hasHighValue = true;
    }
  }

  let score = 0;
  score += Math.min(activities.length * 2, 10);
  score += Math.min(activityTypes.size * 2, 10);
  if (hasRecentActivity) {
    score += 5;
  }
  if (hasHighValue) {
    score += 5;
  }

  return Math.min(score, 30);
}

export function calculateEngagementScoreFromData(
  emails:
    | Array<{ opened?: boolean; clicked?: boolean; replied?: boolean }>
    | null
    | undefined,
  sessions: Array<{ duration?: number; page_views?: number }> | null | undefined
): number {
  let score = 0;

  if (emails && emails.length > 0) {
    let opened = 0;
    let clicked = 0;
    let replied = 0;

    for (const email of emails) {
      if (email.opened) {
        opened += 1;
      }
      if (email.clicked) {
        clicked += 1;
      }
      if (email.replied) {
        replied += 1;
      }
    }

    score += Math.min(opened * 2, 8);
    score += Math.min(clicked * 3, 6);
    score += replied * 6;
  }

  if (sessions && sessions.length > 0) {
    let totalTime = 0;
    let pageViews = 0;

    for (const session of sessions) {
      totalTime += session.duration || 0;
      pageViews += session.page_views || 0;
    }

    if (totalTime > 300) {
      score += 3;
    }
    if (pageViews > 5) {
      score += 3;
    }
  }

  return Math.min(score, 20);
}

type LeadScoringData = {
  activities: Array<{ activity_type: string; created_at: string }>;
  emails: Array<{ opened?: boolean; clicked?: boolean; replied?: boolean }>;
  sessions: Array<{ duration?: number; page_views?: number }>;
};

interface Lead {
  id: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  job_title?: string;
  source?: string;
  campaign?: string;
  score?: number;
  status?: string;
  qualified?: boolean;
  metadata?: {
    company_size?: string;
    industry?: string;
    budget?: string;
    [key: string]: unknown;
  };
}

class LeadScoringService {
  private supabase = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey
  );

  /**
   * Calculate comprehensive lead score
   */
  async calculateScore(leadId: string, tenantId?: string): Promise<LeadScore> {
    // Get lead data
    const lead = await this.getLead(leadId, tenantId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    const scoringData = await this.fetchScoringData(leadId);

    // Calculate factor scores
    const demographic = await this.calculateDemographicScore(lead);
    const behavioral = await this.calculateBehavioralScore(
      leadId,
      tenantId,
      scoringData.activities
    );
    const engagement = await this.calculateEngagementScore(
      leadId,
      tenantId,
      scoringData.emails,
      scoringData.sessions
    );
    const fit = await this.calculateFitScore(lead, tenantId);

    const factors: LeadScoringFactors = {
      demographic,
      behavioral,
      engagement,
      fit,
    };

    const total = demographic + behavioral + engagement + fit;
    const qualified = total >= 70;
    const priority = this.determinePriority(total);
    const recommendations = this.generateRecommendations(factors, total);

    const score: LeadScore = {
      total,
      factors,
      qualified,
      priority,
      recommendations,
    };

    // Update lead score
    await this.updateLeadScore(leadId, score, tenantId);

    // Trigger autopilot workflows
    await autopilotWorkflowService.executeWorkflows(
      score.qualified ? 'lead_qualified' : 'lead_unqualified',
      {
        leadId,
        score: score.total,
        qualified: score.qualified,
      },
      tenantId
    );

    return score;
  }

  /**
   * Calculate demographic score
   */
  private async calculateDemographicScore(lead: {
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    phone?: string;
    job_title?: string;
    metadata?: { company_size?: string; [key: string]: unknown };
  }): Promise<number> {
    let score = 0;

    // Email quality
    if (lead.email) {
      score += 5;
      const domain = lead.email.split('@')[1];
      const corporateDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
      if (domain && !corporateDomains.includes(domain.toLowerCase())) {
        score += 5; // Corporate email bonus
      }
    }

    // Name completeness
    if (lead.first_name) {
      score += 3;
    }
    if (lead.last_name) {
      score += 3;
    }

    // Company information
    if (lead.company) {
      score += 5;
      // Company size bonus (if available)
      if (lead.metadata?.company_size) {
        const size = lead.metadata.company_size as string;
        if (size.includes('50+') || size.includes('100+')) {
          score += 4;
        }
      }
    }

    // Phone number
    if (lead.phone) {
      score += 5;
    }

    return Math.min(score, 30);
  }

  /**
   * Calculate behavioral score
   */
  private async calculateBehavioralScore(
    leadId: string,
    _tenantId?: string,
    activities?: Array<{ activity_type: string; created_at: string }>
  ): Promise<number> {
    if (activities) {
      return calculateBehavioralScoreFromActivities(activities);
    }

    const { data } = await this.supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(50);

    return calculateBehavioralScoreFromActivities(
      (data as Array<{ activity_type: string; created_at: string }>) || []
    );
  }

  /**
   * Calculate engagement score
   */
  private async calculateEngagementScore(
    leadId: string,
    _tenantId?: string,
    emails?: Array<{ opened?: boolean; clicked?: boolean; replied?: boolean }>,
    sessions?: Array<{ duration?: number; page_views?: number }>
  ): Promise<number> {
    if (emails || sessions) {
      return calculateEngagementScoreFromData(emails, sessions);
    }

    const { data: fetchedEmails } = await this.supabase
      .from('email_interactions')
      .select('*')
      .eq('lead_id', leadId);

    const { data: fetchedSessions } = await this.supabase
      .from('lead_sessions')
      .select('*')
      .eq('lead_id', leadId);
    return calculateEngagementScoreFromData(
      fetchedEmails as
        | Array<{ opened?: boolean; clicked?: boolean; replied?: boolean }>
        | null
        | undefined,
      fetchedSessions as
        | Array<{ duration?: number; page_views?: number }>
        | null
        | undefined
    );
  }

  private async fetchScoringData(leadId: string): Promise<LeadScoringData> {
    const [activitiesResult, emailsResult, sessionsResult] = await Promise.all([
      this.supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(50),
      this.supabase
        .from('email_interactions')
        .select('*')
        .eq('lead_id', leadId),
      this.supabase.from('lead_sessions').select('*').eq('lead_id', leadId),
    ]);

    return {
      activities:
        (activitiesResult.data as Array<{
          activity_type: string;
          created_at: string;
        }>) || [],
      emails:
        (emailsResult.data as Array<{
          opened?: boolean;
          clicked?: boolean;
          replied?: boolean;
        }>) || [],
      sessions:
        (sessionsResult.data as Array<{
          duration?: number;
          page_views?: number;
        }>) || [],
    };
  }

  /**
   * Calculate fit score
   */
  private async calculateFitScore(
    lead: {
      email?: string;
      source?: string;
      company?: string;
      campaign?: string;
      metadata?: { industry?: string; budget?: string; [key: string]: unknown };
    },
    _tenantId?: string
  ): Promise<number> {
    let score = 0;

    // Source quality
    const highQualitySources = ['referral', 'partner', 'event'];
    if (lead.source && highQualitySources.includes(lead.source.toLowerCase())) {
      score += 10;
    }

    // Campaign quality
    if (lead.campaign) {
      const highValueCampaigns = ['enterprise', 'partnership', 'webinar'];
      if (
        highValueCampaigns.some(c => lead.campaign!.toLowerCase().includes(c))
      ) {
        score += 5;
      } else {
        score += 2;
      }
    }

    // Industry fit (if available)
    if (lead.metadata?.industry) {
      // This would check against ideal customer profile
      score += 3;
    }

    // Budget fit (if available)
    if (lead.metadata?.budget) {
      const budget = lead.metadata.budget as string;
      if (budget.includes('10k+') || budget.includes('50k+')) {
        score += 2;
      }
    }

    return Math.min(score, 20);
  }

  /**
   * Determine priority
   */
  private determinePriority(score: number): 'hot' | 'warm' | 'cold' {
    if (score >= 80) {
      return 'hot';
    }
    if (score >= 50) {
      return 'warm';
    }
    return 'cold';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    factors: LeadScoringFactors,
    total: number
  ): string[] {
    const recommendations: string[] = [];

    if (factors.demographic < 20) {
      recommendations.push(
        'Collect more demographic information (company, phone, etc.)'
      );
    }

    if (factors.behavioral < 15) {
      recommendations.push('Encourage more website activity and engagement');
    }

    if (factors.engagement < 10) {
      recommendations.push(
        'Send targeted email campaigns to increase engagement'
      );
    }

    if (factors.fit < 10) {
      recommendations.push('Qualify lead fit through discovery questions');
    }

    if (total < 50) {
      recommendations.push('Consider nurturing campaign before sales outreach');
    }

    if (total >= 70) {
      recommendations.push('Lead is qualified - assign to sales team');
    }

    return recommendations;
  }

  /**
   * Get lead data
   */
  private async getLead(
    leadId: string,
    tenantId?: string
  ): Promise<Lead | null> {
    let query = this.supabase.from('leads').select('*').eq('id', leadId);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.single();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Update lead score
   */
  private async updateLeadScore(
    leadId: string,
    score: LeadScore,
    _tenantId?: string
  ): Promise<void> {
    await this.supabase
      .from('leads')
      .update({
        score: score.total,
        qualified: score.qualified,
        priority: score.priority,
        score_factors: score.factors,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);
  }

  /**
   * Batch score leads
   */
  async batchScoreLeads(
    leadIds: string[],
    tenantId?: string
  ): Promise<LeadScore[]> {
    const scores: LeadScore[] = [];

    for (const leadId of leadIds) {
      try {
        const score = await this.calculateScore(leadId, tenantId);
        scores.push(score);
      } catch (error) {
        logger.error(
          'Failed to score lead',
          error instanceof Error ? error : new Error(String(error)),
          {
            leadId,
          }
        );
      }
    }

    return scores;
  }
}

export const leadScoringService = new LeadScoringService();
