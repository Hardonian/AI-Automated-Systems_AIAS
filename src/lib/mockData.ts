/**
 * Shared mock data for development and testing
 */

export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
];

export const mockOrganizations = [
  { id: '1', name: 'ACME Corp', slug: 'acme-corp', plan: 'enterprise' },
  { id: '2', name: 'TechStart Inc', slug: 'techstart', plan: 'pro' },
  { id: '3', name: 'Global Solutions', slug: 'global-solutions', plan: 'basic' },
];

export const mockMetrics = {
  revenue: {
    mrr: 125000,
    arr: 1500000,
    total: 1500000,
    growth: 0.15,
  },
  users: {
    total: 1250,
    active: 1100,
    new: 45,
    growth: 0.08,
  },
  conversion: {
    rate: 0.12,
    funnel: [
      { stage: 'Visitors', count: 10000, conversion: 1.0 },
      { stage: 'Leads', count: 1200, conversion: 0.12 },
      { stage: 'Trials', count: 360, conversion: 0.3 },
      { stage: 'Customers', count: 180, conversion: 0.5 },
    ],
  },
  performance: {
    uptime: 99.9,
    responseTime: 120,
    errorRate: 0.01,
  },
};

export const mockAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'High CPU Usage',
    message: 'Server CPU usage is above 80%',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    resolved: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New User Registration',
    message: '5 new users registered in the last hour',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    resolved: true,
  },
  {
    id: '3',
    type: 'error',
    title: 'Database Connection Failed',
    message: 'Unable to connect to primary database',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    resolved: false,
  },
];

export const mockActivities = [
  {
    id: '1',
    type: 'user_action',
    description: 'User completed onboarding flow',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    user: 'John Doe',
  },
  {
    id: '2',
    type: 'system_event',
    description: 'Automated backup completed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    user: 'System',
  },
  {
    id: '3',
    type: 'integration',
    description: 'New data sync from CRM completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    user: 'Integration Service',
  },
];

export const mockWorkflows = [
  {
    id: '1',
    name: 'Lead Qualification',
    status: 'active',
    triggers: 1250,
    executions: 1100,
    successRate: 0.88,
  },
  {
    id: '2',
    name: 'Customer Onboarding',
    status: 'active',
    triggers: 850,
    executions: 800,
    successRate: 0.94,
  },
  {
    id: '3',
    name: 'Support Ticket Routing',
    status: 'paused',
    triggers: 320,
    executions: 300,
    successRate: 0.94,
  },
];

export const mockBillingData = {
  currentPlan: {
    name: 'Enterprise',
    price: 999,
    period: 'month',
    features: ['Unlimited users', 'Advanced analytics', 'Priority support'],
  },
  usage: {
    apiCalls: 125000,
    storage: 2.5, // GB
    users: 45,
    limits: {
      apiCalls: 200000,
      storage: 10,
      users: 100,
    },
  },
  invoices: [
    {
      id: 'INV-001',
      date: new Date('2024-01-01'),
      amount: 999,
      status: 'paid',
    },
    {
      id: 'INV-002',
      date: new Date('2024-02-01'),
      amount: 999,
      status: 'paid',
    },
    {
      id: 'INV-003',
      date: new Date('2024-03-01'),
      amount: 999,
      status: 'pending',
    },
  ],
};

export const mockComplianceData = {
  gdpr: {
    dataProcessingAgreements: 12,
    consentRecords: 1250,
    dataBreaches: 0,
    lastAudit: new Date('2024-01-15'),
  },
  ccpa: {
    optOutRequests: 5,
    dataCategories: 8,
    thirdPartyDisclosures: 3,
    lastUpdate: new Date('2024-02-01'),
  },
  sox: {
    financialControls: 15,
    auditTrails: 2500,
    complianceScore: 0.95,
    lastReview: new Date('2024-01-30'),
  },
};