/**
 * API Route: Agents
 * Handles agent CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { agentDefinitionSchema } from '@/lib/agents/schema';
import { createClient } from '@/lib/supabase/server';

const createAgentSchema = agentDefinitionSchema.omit({ id: true, createdAt: true, updatedAt: true });

export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
