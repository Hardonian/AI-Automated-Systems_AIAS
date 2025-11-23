# Email Templates Suite

Comprehensive email templates covering all stages of the sales funnel and selling cycle for AIAS Platform.

## Overview

This suite includes email templates aligned with AIAS brand messaging:
- **Systems Thinking** — THE critical skill for the AI age
- **AI Automation** — AI amplifies systems thinking, doesn't replace it
- **Canadian Roots** — Built in Canada, serving the world
- **Privacy First** — PIPEDA compliant, Canadian data residency
- **Multi-Currency** — CAD, USD, EUR, GBP support

## Template Categories

### Top of Funnel (Awareness)
- **Welcome Email** — Introduces systems thinking + AI, brand values
- **Systems Thinking Introduction** — Explains why systems thinking matters
- **Use Case Showcase** — 10 real-world business problems solved

### Middle of Funnel (Consideration)
- **Features Overview** — 6 ways AIAS transforms businesses
- **Canadian Integrations Highlight** — 20+ Canadian integrations
- **Social Proof & Testimonials** — Real results from businesses

### Bottom of Funnel (Decision)
- **Pricing Comparison** — Simple, transparent pricing starting at $49/month
- **Demo Invitation** — Book a free demo to see AIAS in action
- **Trial Reminder** — Start 14-day free trial (no credit card)

### Post-Purchase (Onboarding)
- **Onboarding Welcome** — Quick start guide, first steps
- **First Automation Success** — Celebrate first automation, next steps

### Retention (Nurturing)
- **Advanced Features Highlight** — GenAI Content Engine, advanced systems thinking
- **Success Tips** — 5 tips to maximize results

### Re-Engagement (Win-Back)
- **Win-Back: Inactive User** — What's new, return to dashboard
- **Win-Back: Special Offer** — 20% off next 3 months

## Usage

### Basic Usage

```typescript
import { getTemplateById, replaceTemplateVariables } from '@/lib/email-templates';

// Get a template
const template = getTemplateById('welcome');

if (template) {
  // Replace variables
  const htmlBody = replaceTemplateVariables(template.body, {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  });

  // Send email
  await sendEmail({
    to: 'john@example.com',
    subject: template.subject,
    html: htmlBody,
    text: replaceTemplateVariables(template.textBody || '', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    }),
  });
}
```

### Get Templates by Stage

```typescript
import { getTemplatesByStage } from '@/lib/email-templates';

// Get all awareness stage templates
const awarenessTemplates = getTemplatesByStage('awareness');

// Get all decision stage templates
const decisionTemplates = getTemplatesByStage('decision');
```

### Get Templates by Category

```typescript
import { getTemplatesByCategory } from '@/lib/email-templates';

// Get all welcome emails
const welcomeEmails = getTemplatesByCategory('welcome');

// Get all pricing emails
const pricingEmails = getTemplatesByCategory('pricing');
```

## Template Variables

Each template supports different variables. Common variables include:

- `firstName` — User's first name
- `lastName` — User's last name
- `email` — User's email address
- `planName` — User's plan name (e.g., "Starter", "Pro")
- `automationName` — Name of automation (for success emails)

## Template Structure

Each template includes:

- **id** — Unique identifier
- **name** — Human-readable name
- **subject** — Email subject line
- **stage** — Funnel stage (awareness, consideration, decision, onboarding, retention, reengagement)
- **category** — Template category
- **body** — HTML email body
- **textBody** — Plain text fallback (optional)
- **variables** — Array of supported template variables

## Brand Alignment

All templates align with AIAS brand messaging:

### Core Value Propositions
1. **Systems Thinking** — THE critical skill for the AI age
2. **AI Amplifies Systems Thinking** — Doesn't replace it
3. **Multi-Perspective Analysis** — 6 perspectives (process, technology, people, data, systems, automation)
4. **Root Cause Identification** — Find underlying causes, not symptoms
5. **Holistic Solution Design** — Integrated solutions that work together

### Brand Values
- **Privacy First** — PIPEDA compliant, Canadian data residency
- **Multi-Currency** — CAD, USD, EUR, GBP support
- **No-Code First** — Visual workflow builder, 30-minute setup
- **Global Perspective** — Built in Canada, serving the world

### Services & Features Highlighted
- AI Agent Marketplace
- Visual Workflow Builder
- GenAI Content Engine
- Global Integrations (100+)
- Automation & Workflows
- Analytics & Insights
- Security & Compliance (PIPEDA, SOC 2)

## Integration with Lead Generation System

These templates integrate seamlessly with the Lead Generation System:

- **Lead Capture** — Welcome email sent automatically
- **Lead Scoring** — Feature emails sent based on lead score
- **Lead Nurturing** — Automated nurturing sequences use these templates
- **Conversion Tracking** — Success emails sent on conversion

## Customization

Templates can be customized by:

1. **Modifying template content** — Edit HTML/text in `templates.ts`
2. **Adding new templates** — Add to `emailTemplates` array
3. **Creating template variants** — Duplicate and modify existing templates
4. **A/B Testing** — Create multiple versions for testing

## Best Practices

1. **Personalization** — Always use `firstName` and other available variables
2. **Mobile Responsive** — Templates are designed for mobile-first viewing
3. **Clear CTAs** — Each template includes clear call-to-action buttons
4. **Brand Consistency** — Maintain systems thinking + AI messaging throughout
5. **Canadian Focus** — Highlight Canadian integrations and PIPEDA compliance where relevant

## Examples

### Welcome Email Sequence
1. **Welcome Email** (Day 0)
2. **Systems Thinking Introduction** (Day 2)
3. **Use Case Showcase** (Day 5)

### Consideration Sequence
1. **Features Overview** (Day 7)
2. **Canadian Integrations Highlight** (Day 10)
3. **Social Proof & Testimonials** (Day 12)

### Decision Sequence
1. **Pricing Comparison** (Day 14)
2. **Demo Invitation** (Day 16)
3. **Trial Reminder** (Day 18)

### Onboarding Sequence
1. **Onboarding Welcome** (Immediate)
2. **First Automation Success** (After first automation)

### Retention Sequence
1. **Advanced Features Highlight** (Month 1)
2. **Success Tips** (Month 2)

### Win-Back Sequence
1. **Win-Back: Inactive User** (30 days inactive)
2. **Win-Back: Special Offer** (60 days inactive)

## Support

For questions about email templates:
- Check template variables in `templates.ts`
- Review brand messaging in `VALUE_PROPOSITION.md`
- See services/features in `app/features/page.tsx` and `app/services/page.tsx`
