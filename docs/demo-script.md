# Demo Script

**Last Updated:** 2025-01-XX  
**Purpose:** Guide for demonstrating the AIAS Platform

---

## Demo Environment

### Preview Deployment

**URL Format:** `https://{project-name}-{hash}.vercel.app`

**Access:**
- Automatically deployed for every Pull Request
- Preview URL commented on PR
- Protected by Vercel Access Controls (if configured)

### Production Deployment

**URL:** `https://aias-platform.com` (or configured custom domain)

**Access:**
- Public (or protected by Vercel Access Controls)
- Deployed automatically on `main` branch push

---

## Demo User Persona

### Primary Demo User

**Name:** Demo User  
**Email:** demo@aias-platform.com  
**Role:** Platform Administrator  

**Capabilities:**
- Create AI agents
- Build workflows
- Manage integrations
- View analytics

---

## Demo Flow

### 1. Landing Page (2 minutes)

**URL:** `/` (homepage)

**Actions:**
1. **View Hero Section**
   - Explain value proposition: "Save 10+ hours/week with AI automation"
   - Highlight key features: AI agents, workflows, integrations

2. **Navigate Features**
   - Click "Features" link
   - Showcase: AI Agent Marketplace, Workflow Builder, Multi-tenant Architecture

3. **View Pricing**
   - Click "Pricing" link
   - Show plans: Free, Starter, Pro, Enterprise
   - Highlight: CAD $49/month starting price

**Key Points:**
- Canadian-built, PIPEDA compliant
- 30-minute setup
- 100+ integrations

---

### 2. Authentication (1 minute)

**URL:** `/account` or `/login`

**Actions:**
1. **Sign Up / Sign In**
   - Use demo credentials or create new account
   - Show Supabase Auth integration
   - Highlight: Email, OAuth (GitHub, Google)

**Key Points:**
- Secure authentication
- Multi-provider support
- Session management

---

### 3. Dashboard (3 minutes)

**URL:** `/dashboard` or `/`

**Actions:**
1. **View Dashboard**
   - Show overview metrics
   - Display recent activity
   - Highlight key actions

2. **Navigate Sections**
   - **Agents:** View/create AI agents
   - **Workflows:** View/create automation workflows
   - **Integrations:** Manage third-party integrations
   - **Analytics:** View usage metrics

**Key Points:**
- Clean, intuitive interface
- Real-time updates
- Multi-tenant isolation

---

### 4. AI Agent Marketplace (5 minutes)

**URL:** `/marketplace` or `/agents`

**Actions:**
1. **Browse Agents**
   - Show available AI agents
   - Filter by category
   - Search functionality

2. **Create Agent**
   - Click "Create Agent"
   - Fill in agent details:
     - Name: "Customer Support Bot"
     - Description: "Handles customer inquiries"
     - Model: GPT-4
     - Instructions: Custom prompt
   - Save agent

3. **Deploy Agent**
   - Click "Deploy"
   - Show deployment status
   - Test agent via chat interface

**Key Points:**
- Custom AI agents
- Multiple AI models (OpenAI, Claude, Gemini)
- Instant deployment

---

### 5. Workflow Builder (5 minutes)

**URL:** `/workflows` or `/workflows/create`

**Actions:**
1. **Create Workflow**
   - Click "Create Workflow"
   - Name: "Lead Qualification"

2. **Add Steps**
   - **Trigger:** Webhook or scheduled
   - **Action 1:** Fetch lead data
   - **Action 2:** AI agent analyzes lead
   - **Action 3:** Update CRM
   - **Action 4:** Send notification

3. **Connect Steps**
   - Drag and drop connections
   - Configure step parameters
   - Add conditions/branches

4. **Test Workflow**
   - Click "Test"
   - Show execution flow
   - Display results

**Key Points:**
- Visual workflow builder
- No coding required
- Real-time execution

---

### 6. Integrations (3 minutes)

**URL:** `/integrations`

**Actions:**
1. **Browse Integrations**
   - Show available integrations:
     - Stripe (payments)
     - Shopify (e-commerce)
     - Slack (notifications)
     - Google Sheets (data)
     - And 100+ more

2. **Connect Integration**
   - Click "Connect" on Stripe
   - Show OAuth flow
   - Display connected status

3. **Use Integration**
   - Create workflow using Stripe
   - Show data flow
   - Display results

**Key Points:**
- 100+ integrations
- Easy connection (OAuth)
- Secure credential storage

---

### 7. Analytics (2 minutes)

**URL:** `/analytics` or `/dashboard/analytics`

**Actions:**
1. **View Metrics**
   - Agent usage
   - Workflow executions
   - API calls
   - Cost tracking

2. **Filter Data**
   - By date range
   - By agent/workflow
   - By tenant

**Key Points:**
- Real-time analytics
- Cost tracking
- Performance metrics

---

## Demo Scenarios

### Scenario 1: E-commerce Automation

**Goal:** Automate inventory sync and order processing

**Steps:**
1. Connect Shopify integration
2. Create workflow:
   - Trigger: New order
   - Action: Update inventory
   - Action: Send confirmation email
   - Action: Update analytics
3. Deploy workflow
4. Show execution

**Time:** 5 minutes

---

### Scenario 2: Customer Support Bot

**Goal:** Deploy AI customer support agent

**Steps:**
1. Create AI agent
2. Configure with support knowledge base
3. Deploy to website
4. Test chat interface
5. Show analytics

**Time:** 5 minutes

---

### Scenario 3: Lead Generation

**Goal:** Automate lead capture and qualification

**Steps:**
1. Create lead capture form
2. Build workflow:
   - Trigger: Form submission
   - Action: AI agent qualifies lead
   - Action: Add to CRM
   - Action: Send notification
3. Deploy
4. Show results

**Time:** 5 minutes

---

## Demo Checklist

### Pre-Demo

- [ ] Preview/production deployment is live
- [ ] Demo user account created
- [ ] Sample data seeded (if needed)
- [ ] Integrations configured (optional)
- [ ] Test all key flows

### During Demo

- [ ] Landing page loads
- [ ] Authentication works
- [ ] Dashboard displays
- [ ] Agent creation works
- [ ] Workflow builder works
- [ ] Integrations connect
- [ ] Analytics display

### Post-Demo

- [ ] Clean up test data (optional)
- [ ] Document any issues
- [ ] Gather feedback

---

## Troubleshooting

### Demo Fails to Load

**Check:**
1. Deployment is live (check Vercel dashboard)
2. Environment variables are set
3. Database is accessible
4. No recent errors in logs

### Authentication Fails

**Check:**
1. Supabase credentials are correct
2. Supabase Auth is enabled
3. OAuth providers are configured (if using)

### Workflows Don't Execute

**Check:**
1. Workflow is saved
2. Trigger conditions are met
3. Integrations are connected
4. API keys are valid

---

## Seed Data (Optional)

### For Demo Environments

**Script:** `scripts/seed-demo.ts` (to be created)

**Data:**
- Demo user account
- Sample AI agents
- Sample workflows
- Sample integrations
- Sample analytics data

**Usage:**
```bash
pnpm run db:seed:demo
```

---

## Conclusion

**Demo Duration:** 15-20 minutes  
**Key Highlights:** AI agents, workflows, integrations, analytics  
**Next Steps:** Customize demo flow based on audience  

**Remember:**
- Focus on value, not features
- Show real-world use cases
- Highlight time savings
- Emphasize ease of use
