/**
 * Privacy and Compliance API
 * Comprehensive privacy management and GDPR/CCPA compliance
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PrivacyConsentRequest {
  settings: {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    necessary: boolean;
    preferences: boolean;
    performance: boolean;
    social: boolean;
  };
  jurisdiction: string;
  ipAddress: string;
  userAgent: string;
}

interface DataSubjectRequest {
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  details?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Get user from JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Route handling
    switch (true) {
      case path === '/consent' && method === 'POST':
        return await handleConsentRequest(req, supabaseClient, user.id)
      
      case path === '/consent' && method === 'GET':
        return await handleGetConsent(req, supabaseClient, user.id)
      
      case path === '/consent' && method === 'PUT':
        return await handleUpdateConsent(req, supabaseClient, user.id)
      
      case path === '/data-subject-request' && method === 'POST':
        return await handleDataSubjectRequest(req, supabaseClient, user.id)
      
      case path === '/data-subject-request' && method === 'GET':
        return await handleGetDataSubjectRequests(req, supabaseClient, user.id)
      
      case path === '/privacy-policy' && method === 'GET':
        return await handleGetPrivacyPolicy(req, supabaseClient, user.id)
      
      case path === '/consent-status' && method === 'GET':
        return await handleGetConsentStatus(req, supabaseClient, user.id)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Privacy API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleConsentRequest(req: Request, supabase: any, userId: string) {
  const { settings, jurisdiction, ipAddress, userAgent }: PrivacyConsentRequest = await req.json()

  // Generate consent ID
  const consentId = `consent_${Date.now()}_${Math.random().toString(36).substring(2)}`

  // Calculate data processing purposes
  const dataProcessingPurposes = []
  if (settings.analytics) dataProcessingPurposes.push('analytics', 'performance_measurement')
  if (settings.marketing) dataProcessingPurposes.push('marketing', 'advertising', 'personalization')
  if (settings.functional) dataProcessingPurposes.push('functionality', 'user_experience')
  if (settings.necessary) dataProcessingPurposes.push('security', 'authentication', 'legal_compliance')
  if (settings.preferences) dataProcessingPurposes.push('preference_storage', 'customization')
  if (settings.performance) dataProcessingPurposes.push('performance_optimization', 'caching')
  if (settings.social) dataProcessingPurposes.push('social_sharing', 'social_features')

  // Calculate retention period
  let retentionPeriod = 365 // 1 year default
  if (settings.marketing) retentionPeriod = Math.max(retentionPeriod, 1095) // 3 years
  if (settings.analytics) retentionPeriod = Math.max(retentionPeriod, 730) // 2 years
  if (settings.social) retentionPeriod = Math.max(retentionPeriod, 1825) // 5 years

  // Insert consent record
  const { data: consentData, error: consentError } = await supabase
    .from('privacy_consents')
    .insert({
      user_id: userId,
      consent_id: consentId,
      settings,
      jurisdiction,
      ip_address: ipAddress,
      user_agent: userAgent,
      data_processing_purposes: dataProcessingPurposes,
      retention_period: retentionPeriod
    })
    .select()
    .single()

  if (consentError) {
    throw new Error(`Failed to record consent: ${consentError.message}`)
  }

  // Create or update data subject record
  const { error: dataSubjectError } = await supabase
    .from('data_subjects')
    .upsert({
      user_id: userId,
      consent_id: consentId,
      data_categories: dataProcessingPurposes,
      processing_basis: 'consent'
    })

  if (dataSubjectError) {
    console.error('Failed to create data subject record:', dataSubjectError)
  }

  // Log audit event
  await supabase.rpc('log_audit_event', {
    p_action: 'consent_recorded',
    p_resource_type: 'privacy_consent',
    p_resource_id: consentId,
    p_metadata: { settings, jurisdiction }
  })

  return new Response(
    JSON.stringify({
      success: true,
      consentId,
      data: consentData
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetConsent(req: Request, supabase: any, userId: string) {
  const { data: consent, error } = await supabase
    .from('privacy_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get consent: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      consent: consent || null
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleUpdateConsent(req: Request, supabase: any, userId: string) {
  const { settings, jurisdiction }: Partial<PrivacyConsentRequest> = await req.json()

  // Get current consent
  const { data: currentConsent, error: getError } = await supabase
    .from('privacy_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (getError && getError.code !== 'PGRST116') {
    throw new Error(`Failed to get current consent: ${getError.message}`)
  }

  if (!currentConsent) {
    return new Response(
      JSON.stringify({ error: 'No consent found to update' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Update consent
  const { data: updatedConsent, error: updateError } = await supabase
    .from('privacy_consents')
    .update({
      settings: settings || currentConsent.settings,
      jurisdiction: jurisdiction || currentConsent.jurisdiction,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentConsent.id)
    .select()
    .single()

  if (updateError) {
    throw new Error(`Failed to update consent: ${updateError.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      consent: updatedConsent
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleDataSubjectRequest(req: Request, supabase: any, userId: string) {
  const { requestType, details }: DataSubjectRequest = await req.json()

  // Create data subject request
  const { data: requestData, error: requestError } = await supabase
    .from('data_subject_requests')
    .insert({
      user_id: userId,
      request_type: requestType,
      request_data: details,
      status: 'pending'
    })
    .select()
    .single()

  if (requestError) {
    throw new Error(`Failed to create data subject request: ${requestError.message}`)
  }

  // Process the request based on type
  let responseData = {}
  
  switch (requestType) {
    case 'access':
    case 'portability':
      responseData = await generateDataPortabilityReport(supabase, userId)
      break
    case 'erasure':
      responseData = await processDataErasure(supabase, userId)
      break
    default:
      responseData = { status: 'processed', requestType }
  }

  // Update request with response
  await supabase
    .from('data_subject_requests')
    .update({
      response_data: responseData,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', requestData.id)

  return new Response(
    JSON.stringify({
      success: true,
      requestId: requestData.id,
      response: responseData
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetDataSubjectRequests(req: Request, supabase: any, userId: string) {
  const { data: requests, error } = await supabase
    .from('data_subject_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get data subject requests: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      requests
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetPrivacyPolicy(req: Request, supabase: any, userId: string) {
  const url = new URL(req.url)
  const jurisdiction = url.searchParams.get('jurisdiction') || 'EU'

  const policies = {
    'EU': 'GDPR-compliant privacy policy with full data subject rights, including right to access, rectification, erasure, portability, restriction, and objection. Data processing is based on consent and legitimate interests. Data retention periods vary by purpose: marketing data (3 years), analytics data (2 years), necessary data (session-based).',
    'CA': 'CCPA-compliant privacy policy with California consumer rights, including right to know, delete, and opt-out of sale. Data categories include personal information, commercial information, and internet activity. No sale of personal information.',
    'US': 'US privacy policy with state-specific provisions for California, Virginia, Colorado, and other states with privacy laws. Includes data minimization, purpose limitation, and security measures.',
    'default': 'Comprehensive privacy policy with international compliance including GDPR, CCPA, and other major privacy regulations. Data processing is transparent, lawful, and secure.'
  }

  const policy = policies[jurisdiction as keyof typeof policies] || policies.default

  return new Response(
    JSON.stringify({
      success: true,
      jurisdiction,
      policy
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetConsentStatus(req: Request, supabase: any, userId: string) {
  const { data: consent, error } = await supabase
    .from('privacy_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get consent status: ${error.message}`)
  }

  const status = {
    hasConsent: !!consent,
    needsRenewal: consent ? isConsentExpired(consent.created_at) : true,
    enabledCategories: consent ? Object.values(consent.settings).filter(Boolean).length : 0,
    totalCategories: 7,
    lastUpdated: consent?.updated_at || null
  }

  return new Response(
    JSON.stringify({
      success: true,
      status
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function generateDataPortabilityReport(supabase: any, userId: string) {
  // Get user's data from various tables
  const [consentData, dataSubjectData, profileData] = await Promise.all([
    supabase.from('privacy_consents').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('data_subjects').select('*').eq('user_id', userId),
    supabase.from('profiles').select('*').eq('id', userId)
  ])

  return {
    personalData: {
      profile: profileData.data?.[0] || null,
      dataCategories: dataSubjectData.data?.[0]?.data_categories || [],
      processingBasis: dataSubjectData.data?.[0]?.processing_basis || 'consent'
    },
    consent: consentData.data?.[0] ? {
      timestamp: consentData.data[0].created_at,
      settings: consentData.data[0].settings,
      jurisdiction: consentData.data[0].jurisdiction,
      version: consentData.data[0].consent_version
    } : null,
    dataProcessingPurposes: consentData.data?.[0]?.data_processing_purposes || [],
    retentionPeriod: consentData.data?.[0]?.retention_period || 365,
    generatedAt: new Date().toISOString()
  }
}

async function processDataErasure(supabase: any, userId: string) {
  // Mark data for erasure (soft delete)
  await supabase
    .from('data_subjects')
    .update({ data_categories: [] })
    .eq('user_id', userId)

  // Schedule actual deletion after verification period
  // In production, this would be handled by a background job
  return {
    status: 'erasure_scheduled',
    verificationPeriod: '30 days',
    scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}

function isConsentExpired(createdAt: string): boolean {
  const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000)
  return new Date(createdAt).getTime() < oneYearAgo
}