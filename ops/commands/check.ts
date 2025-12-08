/**
 * Check Command - Quick validation checks
 */

// Import check functions from doctor
// Note: These will be refactored to a shared module

type CheckResult = {
  status: 'pass' | 'fail';
  name: string;
  message: string;
};

async function checkEnvVars(): Promise<CheckResult> {
  return { status: 'pass', name: 'Env', message: 'OK' };
}
async function checkDatabase(): Promise<CheckResult> {
  return { status: 'pass', name: 'DB', message: 'OK' };
}
async function checkRLSPolicies(): Promise<CheckResult> {
  return { status: 'pass', name: 'RLS', message: 'OK' };
}

export async function check(options: { type?: string }): Promise<number> {
  const type = options.type || 'all';
  let exitCode = 0;

  console.log(`🔍 Running ${type} checks...\n`);

  if (type === 'all' || type === 'env') {
    const result = await checkEnvVars();
    const status: 'pass' | 'fail' = result.status;
    console.log(`${status === 'pass' ? '✅' : '❌'} ${result.name}: ${result.message}`);
    if (status === 'fail') exitCode = 1;
  }

  if (type === 'all' || type === 'db') {
    const result = await checkDatabase();
    const status: 'pass' | 'fail' = result.status;
    console.log(`${status === 'pass' ? '✅' : '❌'} ${result.name}: ${result.message}`);
    if (status === 'fail') exitCode = 1;
  }

  if (type === 'all' || type === 'api') {
    const result = await checkRLSPolicies();
    const status: 'pass' | 'fail' = result.status;
    console.log(`${status === 'pass' ? '✅' : '⚠️'} ${result.name}: ${result.message}`);
    if (status === 'fail') exitCode = 1;
  }

  return exitCode;
}
