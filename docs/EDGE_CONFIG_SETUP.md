# Edge Config Setup Guide

This guide will help you set up Vercel Edge Config for feature flags and dynamic configuration.

## What is Edge Config?

Edge Config is a globally distributed, read-optimized key-value store perfect for:
- **Feature flags** - Toggle features without redeploying
- **A/B testing** - Run experiments with instant updates
- **Dynamic configuration** - Update settings without code changes
- **Environment-specific values** - Different configs per environment

## Benefits

✅ **Instant updates** - Changes propagate globally in seconds  
✅ **No redeployment** - Update flags without rebuilding  
✅ **Edge-cached** - Ultra-fast reads from global edge network  
✅ **Free tier** - 1M reads/day included  
✅ **Type-safe** - Full TypeScript support  

## Setup Steps

### 1. Create Edge Config in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Storage** → **Edge Config**
4. Click **Create Database**
5. Give it a name (e.g., "production-config")
6. Copy the connection string (looks like: `https://edge-config.vercel.app/...`)

### 2. Add Environment Variable

Add the connection string to your environment variables:

**Local Development (.env.local):**
```bash
EDGE_CONFIG=https://edge-config.vercel.app/your-config-id?token=your-token
```

**Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add `EDGE_CONFIG` with the connection string
3. Apply to all environments (Production, Preview, Development)

### 3. Migrate Feature Flags

#### Option A: Use the Migration Script

```bash
# Validate connection
pnpm tsx scripts/setup-edge-config.ts validate

# See migration guide
pnpm tsx scripts/setup-edge-config.ts migrate
```

#### Option B: Manual Migration

1. Open your `featureflags/flags.json` file
2. Go to Vercel Dashboard → Edge Config
3. For each flag, add a key-value pair:
   - **Key format**: `feature:flag_name`
   - **Value**: The flag value (true/false, string, number, etc.)

**Example:**
```json
// featureflags/flags.json
{
  "trust_audit_enabled": true,
  "trust_ledger_enabled": true
}
```

**Edge Config entries:**
- Key: `feature:trust_audit_enabled`, Value: `true`
- Key: `feature:trust_ledger_enabled`, Value: `true`

### 4. Verify Setup

```bash
# Test the connection
pnpm tsx scripts/setup-edge-config.ts validate

# List current values
pnpm tsx scripts/setup-edge-config.ts list
```

## Usage in Code

### Feature Flags

```typescript
import { isFeatureEnabled, getFeatureFlag } from '@/lib/config/edge-config';

// Check if feature is enabled
const isNewUIEnabled = await isFeatureEnabled('new_ui');

// Get flag with default value
const maxUploadSize = await getFeatureFlag('max_upload_size', 10 * 1024 * 1024);
```

### Configuration Values

```typescript
import { getConfig } from '@/lib/config/edge-config';

// Get config with default
const apiEndpoint = await getConfig('api_endpoint', 'https://api.example.com');
```

### A/B Testing

```typescript
import { getABTestVariant } from '@/lib/config/edge-config';

// Get consistent variant for user
const variant = await getABTestVariant('homepage_redesign', userId);
// Returns: 'variant-a', 'variant-b', or null
```

### Server Components

```tsx
// app/page.tsx
import { isFeatureEnabled } from '@/lib/config/edge-config';

export default async function Page() {
  const showNewFeature = await isFeatureEnabled('new_feature');
  
  return (
    <div>
      {showNewFeature && <NewFeatureComponent />}
    </div>
  );
}
```

### API Routes

```typescript
// app/api/feature-check/route.ts
import { NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/config/edge-config';

export async function GET() {
  const features = {
    newDashboard: await isFeatureEnabled('new_dashboard'),
    betaFeatures: await isFeatureEnabled('beta_features'),
  };
  
  return NextResponse.json(features);
}
```

## Key Naming Conventions

We recommend these prefixes for organization:

- `feature:*` - Feature flags (e.g., `feature:new_ui`)
- `config:*` - Configuration values (e.g., `config:api_timeout`)
- `ab:*:variants` - A/B test variants (e.g., `ab:homepage:variants`)
- `env:*` - Environment-specific values (e.g., `env:staging_api_url`)

## Fallback Behavior

The code automatically falls back to file-based flags if Edge Config is not configured:

1. **Production**: Uses Edge Config (if configured)
2. **Development**: Falls back to `featureflags/flags.json`
3. **Default values**: Used if neither is available

This ensures:
- ✅ No breaking changes during migration
- ✅ Works in local development without Edge Config
- ✅ Graceful degradation if Edge Config is unavailable

## Best Practices

### 1. Use Descriptive Keys
```typescript
// ✅ Good
feature:trust_audit_enabled
feature:new_dashboard_ui

// ❌ Bad
flag1
enabled
```

### 2. Document Your Flags
Keep a list of all feature flags in your documentation:
- What the flag controls
- When it was added
- Expected removal date

### 3. Use Type-Safe Helpers
```typescript
// ✅ Type-safe with default
const timeout = await getFeatureFlag<number>('api_timeout', 5000);

// ❌ Unsafe
const timeout = await getEdgeConfigValue('api_timeout') || 5000;
```

### 4. Test Flag Changes
Before enabling a flag in production:
1. Test in Preview environment
2. Enable for a small percentage of users
3. Monitor metrics
4. Gradually roll out

### 5. Clean Up Old Flags
Regularly review and remove unused flags to keep Edge Config clean.

## Troubleshooting

### "Edge Config not configured" Warning

This is normal in local development. The code will fall back to file-based flags.

**To fix:**
1. Add `EDGE_CONFIG` to `.env.local`
2. Or ignore the warning (file fallback works fine for dev)

### Values Not Updating

Edge Config propagates globally in seconds, but:
- Clear your browser cache
- Wait a few seconds and refresh
- Check Vercel Dashboard to confirm the value was saved

### Connection Errors

1. Verify `EDGE_CONFIG` environment variable is set correctly
2. Check the connection string format
3. Ensure the token hasn't expired
4. Run: `pnpm tsx scripts/setup-edge-config.ts validate`

## Cost

**Free Tier:**
- 1M reads/day
- Unlimited writes
- Global edge distribution

**Pro Tier:**
- $0.20 per 1M additional reads
- Same unlimited writes

For most applications, the free tier is sufficient.

## Migration Checklist

- [ ] Create Edge Config in Vercel Dashboard
- [ ] Add `EDGE_CONFIG` to environment variables
- [ ] Run validation script: `pnpm tsx scripts/setup-edge-config.ts validate`
- [ ] Migrate flags from `featureflags/flags.json` to Edge Config
- [ ] Test feature flags in Preview environment
- [ ] Verify fallback works in local development
- [ ] Update team documentation
- [ ] Monitor Edge Config usage in Vercel Dashboard

## Next Steps

1. Set up Edge Config using the steps above
2. Migrate your existing feature flags
3. Start using Edge Config for new features
4. Gradually move all configuration to Edge Config

For questions or issues, check the [Vercel Edge Config documentation](https://vercel.com/docs/storage/edge-config).
