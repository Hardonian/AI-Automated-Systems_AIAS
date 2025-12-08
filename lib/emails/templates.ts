/**
 * Email Templates
 * Lifecycle email campaigns with dynamic content
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
}

export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to AI Automated Systems! 🚀',
    variables: ['userName', 'userEmail', 'trialDays'],
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Welcome to AI Automated Systems!</h1>
          </div>
          
          <p>Hi {{userName}},</p>
          
          <p>We're thrilled to have you join us! You now have access to powerful AI automation tools that will help you save time and grow your business.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Get Started in 3 Steps:</h2>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Explore our workflow templates</li>
              <li>Create your first automation</li>
              <li>Watch your productivity soar!</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{siteUrl}}/onboarding" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
          </div>
          
          <p>You have <strong>{{trialDays}} days</strong> to explore all features. No credit card required!</p>
          
          <p>Questions? Just reply to this email - we're here to help.</p>
          
          <p>Best regards,<br>The AIAS Team</p>
        </body>
      </html>
    `,
    text: `
Welcome to AI Automated Systems!

Hi {{userName}},

We're thrilled to have you join us! You now have access to powerful AI automation tools.

Get Started in 3 Steps:
1. Explore our workflow templates
2. Create your first automation
3. Watch your productivity soar!

Get Started: {{siteUrl}}/onboarding

You have {{trialDays}} days to explore all features. No credit card required!

Questions? Just reply to this email - we're here to help.

Best regards,
The AIAS Team
    `,
  },
  
  trial_ending: {
    id: 'trial_ending',
    name: 'Trial Ending Reminder',
    subject: 'Your free trial ends in {{daysRemaining}} days',
    variables: ['userName', 'daysRemaining', 'trialEndDate'],
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Don't Miss Out!</h1>
          
          <p>Hi {{userName}},</p>
          
          <p>Your free trial ends in <strong>{{daysRemaining}} days</strong> ({{trialEndDate}}).</p>
          
          <p>Upgrade now to keep all your workflows running and unlock:</p>
          <ul>
            <li>Unlimited workflows</li>
            <li>Advanced AI agents</li>
            <li>Priority support</li>
            <li>And much more!</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{siteUrl}}/pricing" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade Now</a>
          </div>
          
          <p>Questions? Reply to this email or schedule a call with our team.</p>
        </body>
      </html>
    `,
    text: `
Don't Miss Out!

Hi {{userName}},

Your free trial ends in {{daysRemaining}} days ({{trialEndDate}}).

Upgrade now to keep all your workflows running and unlock unlimited workflows, advanced AI agents, priority support, and more!

Upgrade: {{siteUrl}}/pricing

Questions? Reply to this email.
    `,
  },
  
  upgrade_success: {
    id: 'upgrade_success',
    name: 'Upgrade Success',
    subject: 'Welcome to {{planName}}! 🎉',
    variables: ['userName', 'planName', 'nextBillingDate'],
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">🎉 You're All Set!</h1>
          
          <p>Hi {{userName}},</p>
          
          <p>Thank you for upgrading to <strong>{{planName}}</strong>! You now have access to all premium features.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #10b981;">What's Next?</h2>
            <ul style="margin: 0;">
              <li>Create unlimited workflows</li>
              <li>Build custom AI agents</li>
              <li>Access advanced analytics</li>
              <li>Get priority support</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{siteUrl}}/dashboard" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a>
          </div>
          
          <p>Your next billing date is {{nextBillingDate}}. You can manage your subscription anytime in your account settings.</p>
          
          <p>Welcome aboard!</p>
        </body>
      </html>
    `,
    text: `
🎉 You're All Set!

Hi {{userName}},

Thank you for upgrading to {{planName}}! You now have access to all premium features.

What's Next?
- Create unlimited workflows
- Build custom AI agents
- Access advanced analytics
- Get priority support

Go to Dashboard: {{siteUrl}}/dashboard

Your next billing date is {{nextBillingDate}}.

Welcome aboard!
    `,
  },
  
  feature_announcement: {
    id: 'feature_announcement',
    name: 'Feature Announcement',
    subject: 'New Feature: {{featureName}}',
    variables: ['userName', 'featureName', 'featureDescription', 'featureUrl'],
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">🚀 New Feature Available!</h1>
          
          <p>Hi {{userName}},</p>
          
          <p>We're excited to announce <strong>{{featureName}}</strong>!</p>
          
          <p>{{featureDescription}}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{featureUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Try It Now</a>
          </div>
          
          <p>As always, we'd love to hear your feedback!</p>
        </body>
      </html>
    `,
    text: `
🚀 New Feature Available!

Hi {{userName}},

We're excited to announce {{featureName}}!

{{featureDescription}}

Try It Now: {{featureUrl}}

We'd love to hear your feedback!
    `,
  },
  
  renewal_reminder: {
    id: 'renewal_reminder',
    name: 'Renewal Reminder',
    subject: 'Your subscription renews in {{daysRemaining}} days',
    variables: ['userName', 'daysRemaining', 'renewalDate', 'planName', 'amount'],
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Subscription Renewal Reminder</h1>
          
          <p>Hi {{userName}},</p>
          
          <p>Your <strong>{{planName}}</strong> subscription will renew on <strong>{{renewalDate}}</strong>.</p>
          
          <p>Amount: <strong>$` + '{{amount}}' + `</strong></p>
          
          <p>Your payment method on file will be charged automatically. No action needed unless you want to make changes.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{siteUrl}}/billing" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Manage Subscription</a>
          </div>
          
          <p>Questions? Reply to this email.</p>
        </body>
      </html>
    `,
    text: `
Subscription Renewal Reminder

Hi {{userName}},

Your {{planName}} subscription will renew on {{renewalDate}}.

// @ts-ignore - Template variable placeholder, not object shorthand
Amount: ${{amount}}

Your payment method on file will be charged automatically.

Manage Subscription: {{siteUrl}}/billing
    `,
  },
};

/**
 * Render email template with variables
 */
export function renderEmailTemplate(
  templateId: string,
  variables: Record<string, string>
): { subject: string; html: string; text: string } {
  const template = emailTemplates[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiautomatedsystems.ca';
  const allVariables = { ...variables, siteUrl };

  const replaceVariables = (str: string): string => {
    let result = str;
    Object.entries(allVariables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    return result;
  };

  return {
    subject: replaceVariables(template.subject),
    html: replaceVariables(template.html),
    text: replaceVariables(template.text),
  };
}
