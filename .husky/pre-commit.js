const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running type-check...');
try {
  execSync('pnpm type-check', { stdio: 'inherit' });
} catch (error) {
  console.error(
    '❌ Type-check failed. Please fix type errors before committing.'
  );
  process.exit(1);
}

console.log('🔍 Running lint-staged...');
try {
  execSync('npx lint-staged', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Lint-staged failed.');
  process.exit(1);
}

console.log('🔒 Running secrets scan...');
try {
  const stagedFiles = execSync(
    'git diff --cached --name-only --diff-filter=ACMR',
    { encoding: 'utf-8' }
  )
    .split('\n')
    .filter(f => f.trim());

  if (stagedFiles.length > 0) {
    const fileContents = execSync('git diff --cached', { encoding: 'utf-8' });

    // Check for database URLs with passwords
    if (/postgresql:\/\/[^\s]+:[^\s]+@/.test(fileContents)) {
      console.error(
        '❌ Potential credential detected: postgresql://user:password@...'
      );
      console.error(
        '   Use environment variables and placeholders; never commit real DB URLs.'
      );
      process.exit(1);
    }

    // Check for Supabase service role key
    if (/SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"][^'"]+['"]/.test(fileContents)) {
      console.error(
        '❌ Potential secret detected: SUPABASE_SERVICE_ROLE_KEY="..."'
      );
      process.exit(1);
    }

    // Check for API keys
    if (
      /sk_live_[0-9A-Za-z]{16,}|AKIA[0-9A-Z]{16}|xox[baprs]-[0-9A-Za-z-]{10,}/.test(
        fileContents
      )
    ) {
      console.error('❌ Potential API key detected in staged changes.');
      process.exit(1);
    }
  }

  console.log('✅ No secrets detected');
} catch (error) {
  // If ripgrep or other tools fail, just warn but don't block
  console.warn('⚠️  Secrets scan could not run:', error.message);
}

console.log('✅ Pre-commit checks passed!');
