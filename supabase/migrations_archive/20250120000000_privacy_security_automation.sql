-- Privacy, Security, and Automation Schema Extension
-- Comprehensive database schema for enterprise-grade features

-- Privacy and Compliance Tables
CREATE TABLE IF NOT EXISTS privacy_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_id TEXT UNIQUE NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}',
    jurisdiction TEXT NOT NULL DEFAULT 'EU',
    consent_version TEXT NOT NULL DEFAULT '2.1',
    ip_address INET,
    user_agent TEXT,
    data_processing_purposes TEXT[],
    retention_period INTEGER NOT NULL DEFAULT 365,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_id TEXT REFERENCES privacy_consents(consent_id),
    data_categories TEXT[],
    processing_basis TEXT NOT NULL DEFAULT 'consent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_subject_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction', 'objection')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Security and Threat Detection Tables
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS threat_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    threat_type TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    details JSONB,
    mitigated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS failed_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    attempt_count INTEGER DEFAULT 1,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation and Workflow Tables
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    trigger_config JSONB NOT NULL,
    steps JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
    category TEXT NOT NULL,
    tags TEXT[],
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    trigger_data JSONB,
    context JSONB,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS step_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    step_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE
);

-- Lead Generation Tables
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    phone TEXT,
    source TEXT,
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'converted', 'lost')),
    assigned_to UUID REFERENCES auth.users(id),
    qualification_data JSONB,
    enrichment_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    config JSONB,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointment Booking Tables
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_type TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
    organizer_id UUID REFERENCES auth.users(id),
    location TEXT,
    meeting_url TEXT,
    participants JSONB,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL,
    timing_hours INTEGER NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note Taking and Conferencing Tables
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    organizer_id UUID REFERENCES auth.users(id),
    participants JSONB,
    meeting_url TEXT,
    recording_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meeting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    transcription TEXT,
    summary TEXT,
    action_items JSONB,
    insights JSONB,
    format TEXT DEFAULT 'text' CHECK (format IN ('text', 'markdown', 'structured', 'ai_enhanced')),
    ai_enhanced BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sketching and Design Tables
CREATE TABLE IF NOT EXISTS design_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    project_type TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'completed', 'archived')),
    owner_id UUID REFERENCES auth.users(id),
    collaborators JSONB,
    ai_assistance BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS design_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES design_projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    design_data JSONB NOT NULL,
    ai_enhanced BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trust and Compliance Tables
CREATE TABLE IF NOT EXISTS trust_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    issuer TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    status TEXT DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'expired')),
    verification_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    target_value NUMERIC,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_privacy_consents_user_id ON privacy_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_consents_consent_id ON privacy_consents(consent_id);
CREATE INDEX IF NOT EXISTS idx_data_subjects_user_id ON data_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_threat_detections_user_id ON threat_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_user_ip ON failed_attempts(user_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_category ON automation_workflows(category);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_step_executions_execution_id ON step_executions(execution_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_organizer_id ON appointments(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_meeting_id ON meeting_notes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_design_projects_owner_id ON design_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_design_versions_project_id ON design_versions(project_id);

-- Row Level Security (RLS) Policies
ALTER TABLE privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_versions ENABLE ROW LEVEL SECURITY;

-- Privacy Consents Policies
CREATE POLICY "Users can view their own privacy consents" ON privacy_consents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy consents" ON privacy_consents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy consents" ON privacy_consents
    FOR UPDATE USING (auth.uid() = user_id);

-- Data Subjects Policies
CREATE POLICY "Users can view their own data subject records" ON data_subjects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data subject records" ON data_subjects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Data Subject Requests Policies
CREATE POLICY "Users can view their own data subject requests" ON data_subject_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data subject requests" ON data_subject_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Security Events Policies (Admin only)
CREATE POLICY "Admins can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Automation Workflows Policies
CREATE POLICY "Users can view workflows they created" ON automation_workflows
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create workflows" ON automation_workflows
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own workflows" ON automation_workflows
    FOR UPDATE USING (auth.uid() = created_by);

-- Leads Policies
CREATE POLICY "Users can view leads assigned to them" ON leads
    FOR SELECT USING (auth.uid() = assigned_to);

CREATE POLICY "Admins can view all leads" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Appointments Policies
CREATE POLICY "Users can view their own appointments" ON appointments
    FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Users can create appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own appointments" ON appointments
    FOR UPDATE USING (auth.uid() = organizer_id);

-- Meetings Policies
CREATE POLICY "Users can view meetings they organize" ON meetings
    FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Users can create meetings" ON meetings
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Design Projects Policies
CREATE POLICY "Users can view their own design projects" ON design_projects
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create design projects" ON design_projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own design projects" ON design_projects
    FOR UPDATE USING (auth.uid() = owner_id);

-- Functions for Automation
CREATE OR REPLACE FUNCTION log_automation_event(
    p_action TEXT,
    p_workflow_id UUID DEFAULT NULL,
    p_execution_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (
        action,
        resource_type,
        resource_id,
        metadata,
        user_id
    ) VALUES (
        p_action,
        'automation',
        COALESCE(p_workflow_id::TEXT, p_execution_id::TEXT),
        p_metadata,
        auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has valid consent
CREATE OR REPLACE FUNCTION has_valid_consent(
    p_user_id UUID,
    p_purpose TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    consent_record RECORD;
BEGIN
    SELECT pc.*, ds.data_categories
    INTO consent_record
    FROM privacy_consents pc
    LEFT JOIN data_subjects ds ON pc.consent_id = ds.consent_id
    WHERE pc.user_id = p_user_id
    ORDER BY pc.created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if consent is still valid (not expired)
    IF consent_record.created_at < NOW() - INTERVAL '1 year' THEN
        RETURN FALSE;
    END IF;
    
    -- Check if the specific purpose is enabled
    RETURN (consent_record.settings->>p_purpose)::BOOLEAN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's data processing purposes
CREATE OR REPLACE FUNCTION get_user_data_purposes(p_user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
    purposes TEXT[];
BEGIN
    SELECT data_processing_purposes
    INTO purposes
    FROM privacy_consents
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(purposes, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(p_lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    lead_record RECORD;
    score INTEGER := 0;
BEGIN
    SELECT * INTO lead_record FROM leads WHERE id = p_lead_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Basic scoring logic (can be enhanced with AI)
    IF lead_record.email IS NOT NULL THEN
        score := score + 10;
    END IF;
    
    IF lead_record.phone IS NOT NULL THEN
        score := score + 15;
    END IF;
    
    IF lead_record.company IS NOT NULL THEN
        score := score + 20;
    END IF;
    
    IF lead_record.first_name IS NOT NULL AND lead_record.last_name IS NOT NULL THEN
        score := score + 10;
    END IF;
    
    -- Update the lead with the calculated score
    UPDATE leads SET score = score WHERE id = p_lead_id;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check appointment conflicts
CREATE OR REPLACE FUNCTION check_appointment_conflicts(
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_organizer_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM appointments
    WHERE organizer_id = p_organizer_id
    AND status IN ('scheduled', 'confirmed')
    AND (
        (start_time <= p_start_time AND end_time > p_start_time) OR
        (start_time < p_end_time AND end_time >= p_end_time) OR
        (start_time >= p_start_time AND end_time <= p_end_time)
    );
    
    RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_privacy_consents_updated_at
    BEFORE UPDATE ON privacy_consents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_subjects_updated_at
    BEFORE UPDATE ON data_subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_workflows_updated_at
    BEFORE UPDATE ON automation_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meeting_notes_updated_at
    BEFORE UPDATE ON meeting_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_projects_updated_at
    BEFORE UPDATE ON design_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();