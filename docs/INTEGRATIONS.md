# Integration Documentation

This document describes all external integrations available in the AIAS Platform, including setup instructions, API endpoints, and configuration requirements.

## Overview

The platform integrates with various external services for:
- **Marketing Analytics:** Meta Ads, TikTok Ads
- **E-commerce:** Shopify
- **AI/ML Services:** OpenAI, ElevenLabs
- **Automation:** Zapier, MindStudio, AutoDS
- **Media Processing:** CapCut

## Marketing & Ads Integrations

### Meta Ads (Facebook/Instagram)

**Purpose:** Pull advertising performance data from Meta Ads Manager

**Required Environment Variables:**
- `META_ACCESS_TOKEN` - Meta API access token
- `META_AD_ACCOUNT_ID` - Meta Ad Account ID

**Setup:**
1. Create Meta App at https://developers.facebook.com/
2. Generate access token with `ads_read` permission
3. Get Ad Account ID from Meta Ads Manager
4. Set environment variables in Vercel/GitHub Secrets

**API Endpoint:**
- `POST /api/etl/meta-ads` - Pull Meta Ads data (requires `ZAPIER_SECRET` auth)

**Usage:**
```bash
curl -X POST https://your-app.vercel.app/api/etl/meta-ads \
  -H "Authorization: Bearer $ZAPIER_SECRET"
```

**Data Stored:**
- Table: `spend`
- Fields: `platform`, `date`, `spend_cents`, `clicks`, `impressions`, `conversions`

**Scripts:**
- `scripts/etl/pull_ads_meta.ts` - Standalone ETL script

**Automation:**
- Zapier: Configured in `automations/zapier_spec.json`
- GitHub Actions: Primary automation (if configured)

---

### TikTok Ads

**Purpose:** Pull advertising performance data from TikTok Business API

**Required Environment Variables:**
- `TIKTOK_ACCESS_TOKEN` - TikTok API access token
- `TIKTOK_ADVERTISER_ID` - TikTok Advertiser ID

**Setup:**
1. Create TikTok Business account
2. Generate access token via TikTok Marketing API
3. Get Advertiser ID from TikTok Ads Manager
4. Set environment variables in Vercel/GitHub Secrets

**API Endpoint:**
- `POST /api/etl/tiktok-ads` - Pull TikTok Ads data (requires `ZAPIER_SECRET` auth)

**Usage:**
```bash
curl -X POST https://your-app.vercel.app/api/etl/tiktok-ads \
  -H "Authorization: Bearer $ZAPIER_SECRET"
```

**Data Stored:**
- Table: `spend`
- Fields: `platform`, `date`, `spend_cents`, `clicks`, `impressions`, `conversions`

**Scripts:**
- `scripts/etl/pull_ads_tiktok.ts` - Standalone ETL script

**Automation:**
- Zapier: Configured in `automations/zapier_spec.json`
- GitHub Actions: Primary automation (if configured)

---

## E-commerce Integrations

### Shopify

**Purpose:** Pull order data from Shopify store

**Required Environment Variables:**
- `SHOPIFY_API_KEY` - Shopify API key
- `SHOPIFY_PASSWORD` - Shopify API password
- `SHOPIFY_STORE` - Shopify store name (without .myshopify.com)

**Setup:**
1. Create Private App in Shopify Admin → Apps → Manage private apps
2. Enable "Read orders" permission
3. Copy API key and password
4. Set environment variables in Vercel/GitHub Secrets

**API Endpoint:**
- `POST /api/etl/shopify-orders` - Pull Shopify orders (requires `ZAPIER_SECRET` auth)

**Usage:**
```bash
curl -X POST https://your-app.vercel.app/api/etl/shopify-orders \
  -H "Authorization: Bearer $ZAPIER_SECRET"
```

**Data Stored:**
- Table: `orders`
- Fields: `shopify_id`, `order_number`, `email`, `created_at`, `total_cents`, `currency`, `source`, `metadata`

**Scripts:**
- `scripts/etl/pull_shopify_orders.ts` - Standalone ETL script

**Automation:**
- Zapier: Configured in `automations/zapier_spec.json`
- GitHub Actions: Primary automation (if configured)

---

## AI/ML Voice & Media Services

### ElevenLabs

**Purpose:** Voice generation and text-to-speech services

**Required Environment Variables:**
- `ELEVENLABS_API_KEY` - ElevenLabs API key

**Setup:**
1. Create account at https://elevenlabs.io/
2. Generate API key from dashboard
3. Set `ELEVENLABS_API_KEY` in Vercel/GitHub Secrets

**Status:** ⚠️ Integration not yet implemented

**Planned Features:**
- Voice generation for AI agents
- Text-to-speech for content
- Voice cloning (if needed)

---

### CapCut

**Purpose:** Video editing and media processing automation

**Required Environment Variables:**
- `CAPCUT_API_KEY` - CapCut API key (if available)

**Setup:**
1. Check CapCut API availability
2. Generate API key if available
3. Set `CAPCUT_API_KEY` in Vercel/GitHub Secrets

**Status:** ⚠️ Integration not yet implemented

**Planned Features:**
- Automated video editing
- Media processing workflows
- Content creation automation

---

## Automation Platforms

### Zapier

**Purpose:** Workflow automation and integration orchestration

**Required Environment Variables:**
- `ZAPIER_SECRET` - Secret token for authenticating Zapier webhooks

**Setup:**
1. Create Zapier account
2. Create new Zap with Schedule trigger (daily at 1am ET)
3. Add Webhook action for each ETL endpoint:
   - `/api/etl/meta-ads`
   - `/api/etl/tiktok-ads`
   - `/api/etl/shopify-orders`
   - `/api/etl/compute-metrics`
4. Set Authorization header: `Bearer {{ZAPIER_SECRET}}`
5. Configure error notifications (email/Slack)

**Specification:**
- `automations/zapier_spec.json` - Complete Zapier automation specification

**Usage:**
Zapier will automatically call ETL endpoints on schedule. Ensure `ZAPIER_SECRET` matches in both Zapier and your environment variables.

**Fallback:**
This is a fallback automation. Primary automation is via GitHub Actions (`infra/gh-actions/nightly-etl.yml`).

---

### MindStudio

**Purpose:** AI agent orchestration and workflow management

**Required Environment Variables:**
- `MINDSTUDIO_API_KEY` - MindStudio API key

**Setup:**
1. Create MindStudio account
2. Generate API key
3. Set `MINDSTUDIO_API_KEY` in Vercel/GitHub Secrets

**Status:** ⚠️ Integration not yet implemented

**Planned Features:**
- AI agent orchestration
- Workflow management
- Cross-platform agent communication

---

### AutoDS

**Purpose:** Dropshipping automation and order management

**Required Environment Variables:**
- `AUTODS_API_KEY` - AutoDS API key

**Setup:**
1. Create AutoDS account
2. Generate API key from dashboard
3. Set `AUTODS_API_KEY` in Vercel/GitHub Secrets

**Status:** ⚠️ Integration not yet implemented

**Planned Features:**
- Automated order processing
- Inventory management
- Product synchronization

---

## ETL Endpoints

All ETL endpoints require authentication via `ZAPIER_SECRET` Bearer token.

### Common Authentication

```bash
Authorization: Bearer $ZAPIER_SECRET
```

### Available Endpoints

1. **Meta Ads ETL**
   - `POST /api/etl/meta-ads`
   - Pulls last 30 days of Meta Ads data

2. **TikTok Ads ETL**
   - `POST /api/etl/tiktok-ads`
   - Pulls last 30 days of TikTok Ads data

3. **Shopify Orders ETL**
   - `POST /api/etl/shopify-orders`
   - Pulls last 30 days of Shopify orders

4. **Compute Metrics**
   - `POST /api/etl/compute-metrics`
   - Computes aggregated metrics from spend/order data
   - Optional body: `{ "start": "2025-01-01", "end": "2025-01-31" }`

### Response Format

All endpoints return:

```json
{
  "success": true,
  "recordsInserted": 42,
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "duration_ms": 1234
}
```

### Error Format

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

---

## Integration Status Summary

| Integration | Status | Environment Variables | API Endpoint | Documentation |
|-------------|--------|----------------------|--------------|---------------|
| **Meta Ads** | ✅ Active | `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` | `/api/etl/meta-ads` | ✅ Complete |
| **TikTok Ads** | ✅ Active | `TIKTOK_ACCESS_TOKEN`, `TIKTOK_ADVERTISER_ID` | `/api/etl/tiktok-ads` | ✅ Complete |
| **Shopify** | ✅ Active | `SHOPIFY_API_KEY`, `SHOPIFY_PASSWORD`, `SHOPIFY_STORE` | `/api/etl/shopify-orders` | ✅ Complete |
| **Zapier** | ✅ Active | `ZAPIER_SECRET` | Multiple ETL endpoints | ✅ Complete |
| **ElevenLabs** | ⚠️ Planned | `ELEVENLABS_API_KEY` | N/A | 📝 Planned |
| **CapCut** | ⚠️ Planned | `CAPCUT_API_KEY` | N/A | 📝 Planned |
| **MindStudio** | ⚠️ Planned | `MINDSTUDIO_API_KEY` | N/A | 📝 Planned |
| **AutoDS** | ⚠️ Planned | `AUTODS_API_KEY` | N/A | 📝 Planned |

---

## Testing Integrations

### Test ETL Endpoints Locally

1. Set environment variables in `.env.local`
2. Start development server: `pnpm run dev`
3. Test endpoint:

```bash
curl -X POST http://localhost:3000/api/etl/meta-ads \
  -H "Authorization: Bearer $ZAPIER_SECRET" \
  -H "Content-Type: application/json"
```

### Test in Production

1. Ensure all environment variables are set in Vercel
2. Test endpoint:

```bash
curl -X POST https://your-app.vercel.app/api/etl/meta-ads \
  -H "Authorization: Bearer $ZAPIER_SECRET" \
  -H "Content-Type: application/json"
```

---

## Troubleshooting

### Authentication Failures

**Error:** `Invalid authorization token`

**Solution:**
- Verify `ZAPIER_SECRET` matches in both Zapier and environment variables
- Check Bearer token format: `Bearer <token>`

### Missing Environment Variables

**Error:** `Missing required environment variables`

**Solution:**
- Check `.env.example` for required variables
- Verify variables are set in Vercel/GitHub Secrets
- Restart application after adding variables

### API Rate Limits

**Error:** `429 Too Many Requests`

**Solution:**
- Implement rate limiting in Zapier
- Use exponential backoff
- Consider using GitHub Actions as primary automation

### Data Not Appearing

**Check:**
1. Verify API credentials are correct
2. Check database tables exist (`spend`, `orders`)
3. Review application logs for errors
4. Verify date ranges are correct

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables only
2. **Rotate secrets regularly** - Update API keys quarterly
3. **Use least privilege** - Only grant necessary API permissions
4. **Monitor usage** - Track API calls and costs
5. **Secure webhooks** - Always use `ZAPIER_SECRET` authentication

---

## Support

For integration issues:

1. Check this documentation
2. Review environment variable configuration
3. Test endpoints manually with curl
4. Check application logs
5. Contact platform team

---

**Last Updated:** 2025-01-27  
**Maintained By:** Platform Team
