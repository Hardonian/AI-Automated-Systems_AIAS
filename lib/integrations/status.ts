/**
 * Integration Status Checker
 * Verifies which integrations are actually implemented vs. coming soon
 */

export type IntegrationStatus = "available" | "coming-soon" | "beta" | "deprecated";

export interface IntegrationInfo {
  name: string;
  provider: string;
  status: IntegrationStatus;
  hasOAuth: boolean;
  hasWebhook: boolean;
  hasAPI: boolean;
}

/**
 * Integration registry - single source of truth
 */
export const INTEGRATIONS: Record<string, IntegrationInfo> = {
  shopify: {
    name: "Shopify",
    provider: "shopify",
    status: "available",
    hasOAuth: true,
    hasWebhook: true,
    hasAPI: true,
  },
  wave: {
    name: "Wave Accounting",
    provider: "wave",
    status: "available",
    hasOAuth: true,
    hasWebhook: false,
    hasAPI: true,
  },
  stripe: {
    name: "Stripe",
    provider: "stripe",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: true, // Stripe webhook handler exists
    hasAPI: false,
  },
  // All others are coming-soon
  woocommerce: {
    name: "WooCommerce",
    provider: "woocommerce",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
  quickbooks: {
    name: "QuickBooks",
    provider: "quickbooks",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
  xero: {
    name: "Xero",
    provider: "xero",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
  salesforce: {
    name: "Salesforce",
    provider: "salesforce",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
  hubspot: {
    name: "HubSpot",
    provider: "hubspot",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
  gmail: {
    name: "Gmail",
    provider: "gmail",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
  slack: {
    name: "Slack",
    provider: "slack",
    status: "coming-soon",
    hasOAuth: false,
    hasWebhook: false,
    hasAPI: false,
  },
};

/**
 * Check if an integration is available
 */
export function isIntegrationAvailable(provider: string): boolean {
  const integration = INTEGRATIONS[provider.toLowerCase()];
  return integration?.status === "available";
}

/**
 * Get integration info
 */
export function getIntegrationInfo(provider: string): IntegrationInfo | null {
  return INTEGRATIONS[provider.toLowerCase()] || null;
}

/**
 * Get all available integrations
 */
export function getAvailableIntegrations(): IntegrationInfo[] {
  return Object.values(INTEGRATIONS).filter((i) => i.status === "available");
}
