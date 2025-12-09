/**
 * API Route: Workflows
 * Handles workflow CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createGETHandler, createPOSTHandler, RouteContext } from '@/lib/api/route-handler';
import { logger } from '@/lib/logging/structured-logger';
import { createClient } from '@/lib/supabase/server';
import { workflowDefinitionSchema } from '@/lib/workflows/dsl';

const createWorkflowSchema = workflowDefinitionSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const GET = createGETHandler(
  async (context: RouteContext) => {
    const { request } = context;
    
    // Get authenticated user (Supabase uses cookies, not Bearer tokens)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    let query = supabase
      .from('workflows')
      .select('*')
      .eq('enabled', true)
      .eq('deprecated', false);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data: workflows, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ workflows: workflows || [] });
  },
  {
    requireAuth: false, // We handle auth manually for Supabase
    cache: { enabled: true, ttl: 60 }, // Cache for 1 minute
  }
);

export const POST = createPOSTHandler(
  async (context: RouteContext) => {
    const { request } = context;
    
    // Get authenticated user (Supabase uses cookies, not Bearer tokens)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createWorkflowSchema.parse(body);

    const { data: workflow, error } = await supabase
      .from('workflows')
      .insert({
        ...validated,
        created_by: user.id,
        tenant_id: body.tenantId || null,
      } as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ workflow }, { status: 201 });
  },
  {
    requireAuth: false, // We handle auth manually for Supabase
    validateBody: createWorkflowSchema,
    maxBodySize: 500 * 1024, // 500KB max for workflow definitions
  }
);
