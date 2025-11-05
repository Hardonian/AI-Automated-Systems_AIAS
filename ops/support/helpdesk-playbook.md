# Helpdesk Playbook

**Purpose:** Standardized procedures for handling customer support tickets, ensuring consistent quality and quick resolution times.

## Support Channels

### Primary Channels
1. **Email Support** - support@yourdomain.com
2. **In-App Chat** - Intercom/Crisp widget
3. **Help Center** - Documentation site
4. **Social Media** - Twitter DMs, LinkedIn messages

### Response Time Targets
- **Critical (P0):** < 1 hour
- **High (P1):** < 4 hours
- **Medium (P2):** < 24 hours
- **Low (P3):** < 48 hours

## Ticket Classification

### Priority Levels

**P0 - Critical**
- Service completely down
- Data loss/security breach
- Payment processing failure
- Examples: "Can't log in", "Payment failed", "Data disappeared"

**P1 - High**
- Major feature broken
- Significant performance issues
- Billing discrepancies
- Examples: "Feature X not working", "Site very slow", "Charged twice"

**P2 - Medium**
- Minor feature issues
- General questions
- Feature requests
- Examples: "How do I do X?", "Can you add Y?", "Small bug in feature Z"

**P3 - Low**
- Documentation requests
- General feedback
- Non-urgent questions
- Examples: "Where is documentation?", "Suggestion for improvement"

### Category Tags

- **Technical:** Bug, Feature Request, Performance, Integration
- **Billing:** Payment, Refund, Invoice, Subscription
- **Account:** Login, Access, Settings, Profile
- **General:** Question, Feedback, Documentation

## Support Workflow

### Step 1: Ticket Receipt

**Automated Actions:**
1. Ticket created in helpdesk system
2. Confirmation email sent to customer
3. Slack notification to #support channel
4. Ticket assigned based on type/priority

**Manual Actions:**
1. Acknowledge receipt (if automated fails)
2. Review ticket details
3. Classify priority and category

### Step 2: Initial Response

**Response Template (P0-P1):**
```
Hi {{customer_name}},

Thanks for reaching out. We've received your ticket and understand this is urgent.

We're investigating the issue now and will update you within [timeframe].

If you have any additional information, please reply to this email.

Best regards,
[Your Name]
[Support Team]
```

**Response Template (P2-P3):**
```
Hi {{customer_name}},

Thanks for contacting us. We've received your message and will get back to you within [timeframe].

In the meantime, you might find this helpful: [relevant documentation link]

Best regards,
[Your Name]
[Support Team]
```

### Step 3: Investigation

**Checklist:**
- [ ] Reproduce the issue (if applicable)
- [ ] Check logs for errors
- [ ] Review customer account history
- [ ] Check known issues/knowledge base
- [ ] Consult internal documentation
- [ ] Escalate if needed

### Step 4: Resolution

**Resolution Steps:**
1. Provide solution or workaround
2. Update ticket status
3. Send resolution email
4. Request feedback/satisfaction rating
5. Close ticket if resolved

**Follow-up Template:**
```
Hi {{customer_name}},

Great news! We've resolved the issue you reported.

[Solution details]

If you have any other questions or if this issue persists, please let us know.

How was your support experience? [Link to feedback form]

Best regards,
[Your Name]
[Support Team]
```

### Step 5: Escalation

**When to Escalate:**
- Issue requires code changes
- Billing/legal matters
- Security concerns
- Customer threatening to churn
- Request for refund > $100 CAD

**Escalation Process:**
1. Tag ticket as "Escalated"
2. Assign to appropriate team member
3. Notify customer of escalation
4. Set follow-up date
5. Track resolution time

## Common Scenarios

### Login Issues

**Steps:**
1. Verify email exists in system
2. Check if account is locked/suspended
3. Send password reset link
4. Verify email delivery

**Template:**
```
Hi {{customer_name}},

I've reset your password. Please check your email for the reset link.

If you don't receive it within a few minutes:
- Check spam folder
- Verify email address: {{customer_email}}
- Try again in 15 minutes

If issues persist, reply to this email.

Best regards,
[Support Team]
```

### Billing Questions

**Steps:**
1. Pull up customer's billing history
2. Explain charges clearly
3. Provide invoice links
4. Offer refund if appropriate

**Template:**
```
Hi {{customer_name}},

I've reviewed your billing history. Here's what I found:

[Charge breakdown]
- Date: {{date}}
- Amount: ${{amount}} CAD
- Description: {{description}}

View invoice: [link]

If you believe there's an error, please let me know and I'll investigate further.

Best regards,
[Support Team]
```

### Feature Requests

**Steps:**
1. Acknowledge the request
2. Check if already planned
3. Add to feature request board
4. Notify customer of status

**Template:**
```
Hi {{customer_name}},

Thanks for the suggestion! I've added it to our feature request board.

[Feature request details]

We review all requests monthly. If this feature is prioritized, we'll notify you.

You can track the status here: [link]

Best regards,
[Support Team]
```

### Bug Reports

**Steps:**
1. Acknowledge the report
2. Try to reproduce
3. Log bug in tracking system
4. Provide workaround if available
5. Update when fixed

**Template:**
```
Hi {{customer_name}},

Thanks for reporting this bug. I've been able to reproduce it and logged it for our development team.

[Bug details]
- Issue: {{description}}
- Ticket: {{bug_id}}
- Status: In Progress

[Workaround if available]

I'll update you when this is fixed. Expected timeline: {{timeline}}

Best regards,
[Support Team]
```

## Automation Setup

### Zapier/Make Workflows

**New Ticket → Notion Task:**
```json
{
  "trigger": "New ticket in Intercom/Zendesk",
  "action": "Create Notion page",
  "database": "Support Tickets",
  "mapping": {
    "Title": "{{ticket.subject}}",
    "Customer": "{{ticket.customer_email}}",
    "Priority": "{{ticket.priority}}",
    "Status": "Open"
  }
}
```

**Ticket Resolved → Customer Survey:**
```json
{
  "trigger": "Ticket status = Resolved",
  "action": "Send email",
  "template": "satisfaction-survey",
  "delay": "1 hour"
}
```

**High Priority → Slack Alert:**
```json
{
  "trigger": "Ticket priority = P0 or P1",
  "action": "Send Slack message",
  "channel": "#support-urgent",
  "message": "🚨 {{ticket.subject}} from {{ticket.customer_email}}"
}
```

## Metrics & Reporting

### Daily Metrics
- Tickets received
- Average response time
- Resolution rate
- Customer satisfaction score

### Weekly Metrics
- Total tickets by category
- Top issues/bugs
- Escalation rate
- First response time

### Monthly Metrics
- Customer satisfaction trend
- Resolution time trend
- Ticket volume trends
- Support cost per ticket

### Dashboard Integration
- Export to `/ops/dashboards/kpi-tracker-template.csv`
- Update weekly
- Review in daily routine

## Knowledge Base

### Building a Knowledge Base

**Structure:**
1. Getting Started
2. Common Questions
3. Troubleshooting
4. Feature Guides
5. API Documentation
6. Billing & Account

**Tools:**
- Notion (free, easy to use)
- Intercom Articles
- Help Scout Docs
- Custom documentation site

**Content Guidelines:**
- Use clear, simple language
- Include screenshots/videos
- Keep it updated
- Link related articles
- Add search functionality

## Customer Satisfaction

### CSAT Survey

**After ticket resolution:**
```
How would you rate your support experience?
[1-5 stars]

Any additional feedback?
[Text box]
```

### NPS Survey

**Quarterly:**
```
How likely are you to recommend us to a friend?
[0-10 scale]

Why did you give that score?
[Text box]
```

### Follow-up Actions

**If CSAT < 3:**
- Review ticket details
- Reach out personally
- Address concerns
- Document learnings

## Best Practices

1. **Empathy First** - Always acknowledge customer's frustration
2. **Clear Communication** - Use simple language, avoid jargon
3. **Set Expectations** - Be honest about timelines
4. **Follow Up** - Check in if issue persists
5. **Document Everything** - Notes help future support
6. **Learn & Improve** - Review tickets for patterns

## Tools & Resources

### Recommended Helpdesk Tools
- **Intercom** ($74/month) - Chat + email + knowledge base
- **Zendesk** ($55/month) - Full-featured helpdesk
- **Help Scout** ($25/month) - Simple, email-focused
- **Crisp** ($25/month) - Chat-first, affordable

### Free Alternatives
- **Google Workspace** - Email + shared inbox
- **Notion** - Ticket tracking + knowledge base
- **Airtable** - Custom helpdesk setup

---

**Last Updated:** 2025-01-XX  
**Next Review:** Quarterly
