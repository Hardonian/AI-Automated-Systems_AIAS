/**
 * API Route: Agents
 * Handles agent CRUD operations
 */

import { NextResponse } from 'next/server';

import { agentDefinitionSchema } from '@/lib/agents/schema';
import { createGETHandler, createPOSTHandler, RouteContext } from '@/lib/api/route-handler';
import { createClient } from '@/lib/supabase/server';

const createAgentSchema = agentDefinitionSchema.omit({ id: true, createdAt: true, updatedAt: true });

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
      .from('agents')
      .select('*')
      .eq('enabled', true)
      .eq('deprecated', false);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data: agents, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ agents: agents || [] });
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
    const validated = createAgentSchema.parse(body);

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        ...validated,
        created_by: user.id,
        tenant_id: body.tenantId || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ agent }, { status: 201 });
  },
  {
    requireAuth: false, // We handle auth manually for Supabase
    validateBody: createAgentSchema,
    maxBodySize: 100 * 1024, // 100KB max
  }
);
