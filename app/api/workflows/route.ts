/**
 * API Route: Workflows
 * Handles workflow CRUD operations
 */

import { NextResponse } from 'next/server';

import {
  createGETHandler,
  createPOSTHandler,
  RouteContext,
} from '@/lib/api/route-handler';
import { canCreateWorkflow } from '@/lib/entitlements/check';
import { createClient } from '@/lib/supabase/server';
import { workflowDefinitionSchema } from '@/lib/workflows/dsl';

const createWorkflowSchema = workflowDefinitionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const GET = createGETHandler(
  async (context: RouteContext) => {
    const { request, userId } = context;

    // userId is now validated by JWT verification in route-handler
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
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
    requireAuth: true, // Enable route handler JWT verification
    requireTenant: false, // Tenant is optional
    cache: { enabled: true, ttl: 60 }, // Cache for 1 minute
  }
);

export const POST = createPOSTHandler(
  async (context: RouteContext) => {
    const { request, userId } = context;

    // userId is now validated by JWT verification in route-handler
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check entitlement: Can user create more workflows?
    const entitlementCheck = await canCreateWorkflow(userId);
    if (!entitlementCheck.allowed) {
      return NextResponse.json(
        {
          error: entitlementCheck.reason || 'Workflow limit reached',
          upgradePlan: entitlementCheck.upgradePlan,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = createWorkflowSchema.parse(body);

    const supabase = await createClient();
    const { data: workflow, error } = await supabase
      .from('workflows')
      .insert({
        ...validated,
        created_by: userId,
        tenant_id: (body as { tenantId?: string }).tenantId || null,
      } as any)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ workflow }, { status: 201 });
  },
  {
    requireAuth: true, // Enable route handler JWT verification
    validateBody: createWorkflowSchema,
    maxBodySize: 500 * 1024, // 500KB max for workflow definitions
  }
);
