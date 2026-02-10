#!/usr/bin/env tsx
/**
 * Test Sign-Up Flow
 *
 * End-to-end test of the user sign-up flow:
 * 1. Sign up user via Server Action
 * 2. Verify profile creation
 * 3. Verify activity log entry
 * 4. Clean up test data
 *
 * Usage:
 *   tsx scripts/test-signup-flow.ts
 */

import { createClient } from '@supabase/supabase-js';

import { signUpUser } from '../lib/actions/auth-actions';

async function testSignUpFlow() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('🧪 Testing Sign-Up Flow...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Generate test user data
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testDisplayName = 'Test User';

  console.log(`📝 Test User:`);
  console.log(`   Email: ${testEmail}`);
  console.log(`   Display Name: ${testDisplayName}\n`);

  try {
    // Step 1: Sign up user
    console.log('1️⃣  Testing user sign-up...');
    const signUpResult = await signUpUser(
      testEmail,
      testPassword,
      testDisplayName
    );

    if (!signUpResult.success || !signUpResult.data) {
      console.error('❌ Sign-up failed:', signUpResult.error);
      process.exit(1);
    }

    const { userId } = signUpResult.data;
    console.log(`✅ User created: ${userId}\n`);

    // Step 2: Verify profile creation
    console.log('2️⃣  Verifying profile creation...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ Profile not found:', profileError?.message);
      process.exit(1);
    }

    if (profile.email !== testEmail) {
      console.error('❌ Profile email mismatch');
      process.exit(1);
    }

    console.log(`✅ Profile verified:`);
    console.log(`   ID: ${profile.id}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Display Name: ${profile.display_name}\n`);

    // Step 3: Verify activity log entry
    console.log('3️⃣  Verifying activity log entry...');
    const { data: activities, error: activityError } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type', 'sign_up')
      .order('created_at', { ascending: false })
      .limit(1);

    if (activityError || !activities || activities.length === 0) {
      console.error('❌ Activity log entry not found:', activityError?.message);
      process.exit(1);
    }

    const activity = activities[0];
    console.log(`✅ Activity logged:`);
    console.log(`   Type: ${activity.activity_type}`);
    console.log(`   Entity: ${activity.entity_type}`);
    console.log(`   Created: ${activity.created_at}\n`);

    // Step 4: Test cleanup (optional - comment out to keep test user)
    console.log('4️⃣  Cleaning up test data...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.warn('⚠️  Could not delete test user:', deleteError.message);
      console.log('   (This is okay - you may need to delete manually)');
    } else {
      console.log('✅ Test user deleted\n');
    }

    console.log('='.repeat(50));
    console.log('✅ Sign-Up Flow Test: PASSED');
    console.log('='.repeat(50));
    console.log('\n🎉 All steps completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ User sign-up via Server Action');
    console.log('   ✅ Profile creation in database');
    console.log('   ✅ Activity log entry created');
    console.log('   ✅ Data flow verified end-to-end\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testSignUpFlow();
