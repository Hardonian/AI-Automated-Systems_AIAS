/**
 * Vercel Build Environment Diagnostic Script
 * 
 * This script safely audits the Vercel build environment to identify
 * missing environment variables and configuration issues.
 * 
 * Usage: Run during Vercel build to diagnose environment problems
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

interface EnvVar {
  name: string;
  required: boolean;
  present: boolean;
  value?: string;
  masked: boolean;
}

// Required environment variables for Vercel build
const REQUIRED_ENV_VARS = [
  // Supabase (at least one set)
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  // Database
  'DATABASE_URL',
  'UPSTASH_POSTGRES_URL',
  // Application
  'NODE_ENV',
] as const;

// Optional but recommended
const RECOMMENDED_ENV_VARS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'RESEND_API_KEY',
] as const;

// Vercel-specific variables
const VERCEL_ENV_VARS = [
  'VERCEL',
  'VERCEL_ENV',
  'VERCEL_URL',
  'VERCEL_REGION',
  'NODE_VERSION',
] as const;

function maskValue(value: string): string {
  if (value.length <= 8) {return '***';}
  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
}

function checkEnvVar(name: string): EnvVar {
  const value = process.env[name];
  const isSecret = name.includes('SECRET') || name.includes('KEY') || name.includes('PASSWORD') || name.includes('TOKEN');
  
  return {
    name,
    required: REQUIRED_ENV_VARS.includes(name as typeof REQUIRED_ENV_VARS[number]),
    present: value !== undefined && value !== '',
    value: value ? (isSecret ? maskValue(value) : value) : undefined,
    masked: isSecret,
  };
}

function generateReport(): string {
  const report: string[] = [];
  report.push('='.repeat(80));
  report.push('VERCEL BUILD ENVIRONMENT DIAGNOSTIC REPORT');
  report.push('='.repeat(80));
  report.push('');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push(`Node Version: ${process.version}`);
  report.push(`Platform: ${process.platform}`);
  report.push(`Architecture: ${process.arch}`);
  report.push('');

  // Check Vercel-specific variables
  report.push('VERCEL PLATFORM VARIABLES:');
  report.push('-'.repeat(80));
  const vercelVars = VERCEL_ENV_VARS.map(checkEnvVar);
  vercelVars.forEach(v => {
    const status = v.present ? '✓' : '✗';
    report.push(`${status} ${v.name}: ${v.present ? (v.value || 'set') : 'NOT SET'}`);
  });
  report.push('');

  // Check required variables
  report.push('REQUIRED ENVIRONMENT VARIABLES:');
  report.push('-'.repeat(80));
  const requiredVars = REQUIRED_ENV_VARS.map(checkEnvVar);
  const missingRequired = requiredVars.filter(v => v.required && !v.present);
  
  requiredVars.forEach(v => {
    const status = v.present ? '✓' : '✗';
    const required = v.required ? '[REQUIRED]' : '';
    report.push(`${status} ${v.name} ${required}: ${v.present ? (v.value || 'set') : 'NOT SET'}`);
  });
  
  if (missingRequired.length > 0) {
    report.push('');
    report.push('⚠️  MISSING REQUIRED VARIABLES:');
    missingRequired.forEach(v => {
      report.push(`  - ${v.name}`);
    });
  }
  report.push('');

  // Check recommended variables
  report.push('RECOMMENDED ENVIRONMENT VARIABLES:');
  report.push('-'.repeat(80));
  const recommendedVars = RECOMMENDED_ENV_VARS.map(checkEnvVar);
  const missingRecommended = recommendedVars.filter(v => !v.present);
  
  recommendedVars.forEach(v => {
    const status = v.present ? '✓' : '○';
    report.push(`${status} ${v.name}: ${v.present ? (v.value || 'set') : 'NOT SET (optional)'}`);
  });
  
  if (missingRecommended.length > 0) {
    report.push('');
    report.push('ℹ️  MISSING RECOMMENDED VARIABLES (non-blocking):');
    missingRecommended.forEach(v => {
      report.push(`  - ${v.name}`);
    });
  }
  report.push('');

  // Database URL validation
  report.push('DATABASE CONFIGURATION:');
  report.push('-'.repeat(80));
  const dbUrl = process.env.DATABASE_URL || process.env.UPSTASH_POSTGRES_URL;
  if (dbUrl) {
    const isValid = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
    report.push(`${isValid ? '✓' : '✗'} Database URL: ${isValid ? 'Valid format' : 'Invalid format'}`);
    report.push(`  Format: ${dbUrl.substring(0, 20)}...`);
  } else {
    report.push('✗ Database URL: NOT SET');
  }
  report.push('');

  // Supabase configuration check
  report.push('SUPABASE CONFIGURATION:');
  report.push('-'.repeat(80));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  report.push(`${supabaseUrl ? '✓' : '✗'} Supabase URL: ${supabaseUrl ? 'Set' : 'NOT SET'}`);
  report.push(`${supabaseKey ? '✓' : '✗'} Supabase Anon Key: ${supabaseKey ? 'Set' : 'NOT SET'}`);
  report.push(`${serviceKey ? '✓' : '✗'} Supabase Service Key: ${serviceKey ? 'Set' : 'NOT SET'}`);
  report.push('');

  // Summary
  report.push('SUMMARY:');
  report.push('-'.repeat(80));
  const totalRequired = requiredVars.filter(v => v.required).length;
  const presentRequired = requiredVars.filter(v => v.required && v.present).length;
  const allRequiredPresent = missingRequired.length === 0;
  
  report.push(`Required Variables: ${presentRequired}/${totalRequired} present`);
  report.push(`Status: ${allRequiredPresent ? '✓ READY FOR BUILD' : '✗ BUILD WILL FAIL'}`);
  report.push('');
  
  if (!allRequiredPresent) {
    report.push('ACTION REQUIRED:');
    report.push('  Set the missing required variables in:');
    report.push('  - Vercel Dashboard → Settings → Environment Variables');
    report.push('  - Ensure variables are available to "Build" environment');
    report.push('');
  }

  // Check Node.js version
  report.push('NODE.JS VERSION:');
  report.push('-'.repeat(80));
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0] || '0');
  const isLTS = majorVersion === 18 || majorVersion === 20 || majorVersion === 22;
  report.push(`Current: ${nodeVersion}`);
  report.push(`Status: ${isLTS ? '✓ LTS Version' : '⚠️  Non-LTS Version'}`);
  if (!isLTS) {
    report.push('  Recommendation: Use Node.js 18.x, 20.x, or 22.x LTS');
  }
  report.push('');

  report.push('='.repeat(80));
  
  return report.join('\n');
}

// Main execution
try {
  const report = generateReport();
  console.log(report);
  
  // Write report to file for Vercel build logs
  const reportPath = join(process.cwd(), 'vercel-build-diagnostic.txt');
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`\nDiagnostic report written to: ${reportPath}`);
  
  // Exit with error if required variables are missing
  const requiredVars = REQUIRED_ENV_VARS.map(checkEnvVar);
  const missingRequired = requiredVars.filter(v => v.required && !v.present);
  
  // Check for at least Supabase or Database URL
  const hasSupabase = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
                      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
  const hasDatabase = process.env.DATABASE_URL || process.env.UPSTASH_POSTGRES_URL;
  
  if (!hasSupabase && !hasDatabase) {
    console.error('\n❌ FATAL: Missing critical configuration (Supabase or Database)');
    process.exit(1);
  }
  
  if (missingRequired.length > 0 && !hasDatabase) {
    console.error('\n❌ FATAL: Missing required environment variables');
    process.exit(1);
  }
  
  console.log('\n✓ Environment check passed');
  process.exit(0);
} catch (error) {
  console.error('Error generating diagnostic report:', error);
  process.exit(1);
}
