// Analytics script to generate KPI dashboard data
// Run via GitHub Actions daily or manually: node scripts/analytics-kpi.js

const fs = require('fs');
const path = require('path');

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Initialize Supabase client if available
let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (e) {
    console.warn('⚠️  @supabase/supabase-js not installed. Install with: npm install @supabase/supabase-js');
  }
}

// Initialize Stripe client if available
let stripe = null;
if (STRIPE_SECRET_KEY) {
  try {
    stripe = require('stripe')(STRIPE_SECRET_KEY);
  } catch (e) {
    console.warn('⚠️  stripe not installed. Install with: npm install stripe');
  }
}

async function generateKPIAnalytics() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const readableDate = new Date().toISOString().split('T')[0];
  const reportsDir = path.join(__dirname, '../ops/dashboards/reports');
  
  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Initialize metrics with defaults
  const kpiData = {
    date: readableDate,
    timestamp: new Date().toISOString(),
    metrics: {
      activeUsers: 0,
      newSignups: 0,
      mrrCAD: 0,
      churnRate: 0,
      customerLTV: 0,
      supportTickets: 0,
      avgResponseTime: 0,
      featureRequests: 0,
      npsScore: 0,
      conversionRate: 0
    },
    sources: {
      supabase: !!supabase,
      stripe: !!stripe
    }
  };

  // Fetch active users from Supabase
  if (supabase) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Active users (logged in within last 30 days)
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', thirtyDaysAgo.toISOString());
      
      if (activeUsers !== null) {
        kpiData.metrics.activeUsers = activeUsers;
      }

      // New signups (last 30 days)
      const { count: newSignups } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (newSignups !== null) {
        kpiData.metrics.newSignups = newSignups;
      }

      // Support tickets (if support_tickets table exists)
      try {
        const { count: tickets } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
        
        if (tickets !== null) {
          kpiData.metrics.supportTickets = tickets;
        }
      } catch (e) {
        // Table may not exist, skip
      }

      // Feature requests (if feature_requests table exists)
      try {
        const { count: requests } = await supabase
          .from('feature_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
        
        if (requests !== null) {
          kpiData.metrics.featureRequests = requests;
        }
      } catch (e) {
        // Table may not exist, skip
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error.message);
    }
  }

  // Fetch revenue metrics from Stripe
  if (stripe) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

      // Get subscriptions for MRR calculation
      const subscriptions = await stripe.subscriptions.list({
        status: 'active',
        limit: 100,
      });

      let mrr = 0;
      for (const sub of subscriptions.data) {
        // Convert to CAD if needed (assuming prices are in CAD)
        const amount = (sub.items.data[0]?.price?.unit_amount || 0) / 100;
        mrr += amount;
      }

      kpiData.metrics.mrrCAD = Math.round(mrr * 100) / 100;

      // Calculate churn rate (cancelled subscriptions in last 30 days)
      const cancelledSubs = await stripe.subscriptions.list({
        status: 'canceled',
        limit: 100,
        created: { gte: thirtyDaysAgo },
      });

      const totalSubs = subscriptions.data.length + cancelledSubs.data.length;
      if (totalSubs > 0) {
        kpiData.metrics.churnRate = Math.round((cancelledSubs.data.length / totalSubs) * 100 * 100) / 100;
      }

      // Estimate LTV (average subscription value * average months)
      if (subscriptions.data.length > 0) {
        const avgMonthlyValue = mrr / subscriptions.data.length;
        const avgLifetimeMonths = 12; // Default assumption
        kpiData.metrics.customerLTV = Math.round(avgMonthlyValue * avgLifetimeMonths * 100) / 100;
      }
    } catch (error) {
      console.error('Error fetching from Stripe:', error.message);
    }
  }

  // Calculate conversion rate (signups / visitors - requires analytics)
  // This would typically come from analytics platform
  if (kpiData.metrics.newSignups > 0) {
    // Placeholder - would need actual visitor data
    kpiData.metrics.conversionRate = 0;
  }

  const outputPath = path.join(reportsDir, `kpi-${today}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(kpiData, null, 2));
  
  console.log(`KPI analytics report generated: ${outputPath}`);
  
  // Also generate CSV version for compatibility
  const csvData = [
    ['Date', 'Active Users', 'New Signups', 'MRR (CAD)', 'Churn Rate (%)', 'Customer LTV (CAD)', 'Support Tickets', 'Avg Response Time (hrs)', 'Feature Requests', 'NPS Score', 'Conversion Rate (%)'],
    [
      today,
      kpiData.metrics.activeUsers,
      kpiData.metrics.newSignups,
      kpiData.metrics.mrrCAD,
      kpiData.metrics.churnRate,
      kpiData.metrics.customerLTV,
      kpiData.metrics.supportTickets,
      kpiData.metrics.avgResponseTime,
      kpiData.metrics.featureRequests,
      kpiData.metrics.npsScore,
      kpiData.metrics.conversionRate
    ]
  ];
  
  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const csvPath = path.join(reportsDir, `kpi-${today}.csv`);
  fs.writeFileSync(csvPath, csvContent);
  
  console.log(`KPI analytics CSV generated: ${csvPath}`);
}

// Run if executed directly
if (require.main === module) {
  generateKPIAnalytics().catch(console.error);
}

module.exports = { generateKPIAnalytics };
