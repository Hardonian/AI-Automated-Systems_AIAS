import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(5000, "Message too long (max 5000 characters)"),
  conversationId: z.string().uuid().optional(),
});

// Distributed rate limit check using Supabase function
async function checkRateLimit(supabaseAdmin: unknown, userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_identifier: userId,
    p_endpoint: 'chat-api',
    p_max_requests: 20,
    p_window_seconds: 60
  });

  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Fail open for now
  }

  return data === true;
}

// Log audit event
async function logAudit(supabaseAdmin: unknown, userId: string, action: string, resourceType: string, resourceId?: string, metadata?: Record<string, unknown>) {
  await supabaseAdmin.rpc('log_audit_event', {
    p_user_id: userId,
    p_action: action,
    p_resource_type: resourceType,
    p_resource_id: resourceId,
    p_metadata: metadata || {}
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    
    // Validate input with Zod
    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationId } = validation.data;

    // Distributed rate limiting
    const isAllowed = await checkRateLimit(supabaseAdmin, user.id);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in 1 minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize message content (basic XSS prevention)
    const sanitizedMessage = message.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, title: sanitizedMessage.substring(0, 50) })
        .select()
        .single();

      if (convError) throw convError;
      convId = newConv.id;
    }

    // Save user message
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convId,
        content: sanitizedMessage,
        role: 'user',
      });

    if (msgError) throw msgError;

    // Log audit event
    await logAudit(supabaseAdmin, user.id, 'message_sent', 'chat_message', convId, { message_length: sanitizedMessage.length });

    // Get conversation history (last 20 messages for context)
    const { data: conversationHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
      // Continue without history if fetch fails
    }

    // Integrate with OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    let aiResponse: string;

    if (!openaiApiKey) {
      console.warn('OPENAI_API_KEY not set, returning placeholder response');
      aiResponse = "I'm your AI automation assistant. OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.";
    } else {
      try {
        // Build messages array for OpenAI
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          { role: 'system', content: 'You are a helpful AI automation assistant. You help users build workflows, automate tasks, and solve business problems using AI and automation tools.' }
        ];

        // Add conversation history
        if (conversationHistory && conversationHistory.length > 0) {
          for (const msg of conversationHistory) {
            if (msg.role === 'user' || msg.role === 'assistant') {
              messages.push({
                role: msg.role as 'user' | 'assistant',
                content: msg.content || ''
              });
            }
          }
        }

        // Add current user message
        messages.push({ role: 'user', content: sanitizedMessage });

        // Call OpenAI API with retry logic
        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: Deno.env.get('OPENAI_MODEL') || 'gpt-4',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            aiResponse = data.choices[0]?.message?.content || 'No response from AI';

            // Log successful API call
            await logAudit(supabaseAdmin, user.id, 'openai_api_call', 'chat_message', convId, {
              model: Deno.env.get('OPENAI_MODEL') || 'gpt-4',
              tokens_used: data.usage?.total_tokens,
              attempt: attempt + 1,
            });

            break; // Success, exit retry loop
          } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`OpenAI API call attempt ${attempt + 1} failed:`, lastError);

            // If this is not the last attempt, wait before retrying (exponential backoff)
            if (attempt < maxRetries - 1) {
              const delayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
              await new Promise(resolve => setTimeout(resolve, delayMs));
            }
          }
        }

        // If all retries failed, use fallback response
        if (!aiResponse && lastError) {
          console.error('All OpenAI API retry attempts failed:', lastError);
          aiResponse = "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment.";
          
          // Log the failure
          await logAudit(supabaseAdmin, user.id, 'openai_api_failure', 'chat_message', convId, {
            error: lastError.message,
            attempts: maxRetries,
          });
        }
      } catch (error) {
        console.error('Unexpected error in OpenAI integration:', error);
        aiResponse = "I encountered an unexpected error. Please try again.";
      }
    }

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convId,
        content: aiResponse,
        role: 'assistant',
      });

    if (aiMsgError) throw aiMsgError;

    return new Response(
      JSON.stringify({ reply: aiResponse, conversationId: convId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-api:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error for monitoring
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (supabaseUrl && serviceKey) {
        const supabaseAdmin = createClient(supabaseUrl, serviceKey);
        await logAudit(supabaseAdmin, 'system', 'chat_api_error', 'error', undefined, {
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    } catch (logError) {
      // Ignore logging errors to prevent cascading failures
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
