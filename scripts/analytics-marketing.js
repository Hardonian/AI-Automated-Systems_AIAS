// Analytics script to generate marketing dashboard data
// Run via GitHub Actions daily or manually: node scripts/analytics-marketing.js
//
// Setup:
// 1. Install dependencies: npm install @supabase/supabase-js (if using Supabase)
// 2. Set environment variables: SUPABASE_URL, SUPABASE_KEY
// 3. Customize data sources below

const fs = require('fs');
const path = require('path');

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

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

async function generateMarketingAnalytics() {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const readableDate = new Date().toISOString().split('T')[0];
    const reportsDir = path.join(__dirname, '../ops/dashboards/reports');
    
    // Ensure reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log(`Created reports directory: ${reportsDir}`);
    }

    // Initialize CSV header
    const marketingData = [
      ['Date', 'Platform', 'Post Type', 'Content Preview', 'URL', 'Engagements', 'Impressions', 'CTR', 'Leads Generated', 'Cost (CAD)', 'ROI']
    ];

    // OPTION 1: Fetch from Supabase (if using)
    if (supabase) {
      try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: posts, error } = await supabase
          .from('marketing_activities')
          .select('*')
          .eq('type', 'social_post')
          .gte('date', sevenDaysAgo)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (posts) {
          posts.forEach(post => {
            const impressions = post.impressions || 0;
            const engagements = post.engagements || 0;
            const cost = post.cost || 0;
            const leadsGenerated = post.leads_generated || 0;
            
            const ctr = impressions > 0 
              ? ((engagements / impressions) * 100).toFixed(2) + '%' 
              : '0%';
            const roi = cost > 0 
              ? (((leadsGenerated * 50 - cost) / cost) * 100).toFixed(0) + '%'
              : 'N/A';
            
            marketingData.push([
              post.date ? post.date.split('T')[0] : readableDate,
              post.platform || 'Unknown',
              post.post_type || 'Post',
              (post.content || '').substring(0, 50) + ((post.content || '').length > 50 ? '...' : ''),
              post.url || '',
              engagements,
              impressions,
              ctr,
              leadsGenerated,
              cost.toFixed(2),
              roi
            ]);
          });
        }
      } catch (error) {
        // Table may not exist, skip silently
        if (!error.message.includes('relation') && !error.message.includes('does not exist')) {
          console.error('Error fetching from Supabase:', error.message);
        }
      }
    }

    // If no data fetched, add sample row for testing
    if (marketingData.length === 1) {
      console.warn('⚠️  No data sources configured. Adding sample row for testing.');
      marketingData.push([
        readableDate,
        'LinkedIn',
        'Article',
        'Sample post - configure data sources to fetch real data',
        'https://example.com',
        '0',
        '0',
        '0%',
        '0',
        '0',
        'N/A'
      ]);
    }

    // Convert to CSV (handle commas in content)
    const csvContent = marketingData.map(row => {
      return row.map(cell => {
        // Escape commas and quotes in cell content
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',');
    }).join('\n');
    
    const outputPath = path.join(reportsDir, `marketing-${today}.csv`);
    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    
    console.log(`✅ Marketing analytics report generated: ${outputPath}`);
    console.log(`   Rows: ${marketingData.length - 1} (excluding header)`);
    
    return { success: true, file: outputPath, rows: marketingData.length - 1 };
    
  } catch (error) {
    console.error('❌ Error generating marketing analytics:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  generateMarketingAnalytics().catch(console.error);
}

module.exports = { generateMarketingAnalytics };
