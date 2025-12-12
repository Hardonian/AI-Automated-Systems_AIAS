# Billing System

The AIAS Platform uses Stripe for subscription management and billing.

## Subscription Tiers

### Free

- Limited workflows (3 workflows)
- 1 AI agent
- Community support
- 1,000 API calls/month
- Basic analytics

### Pro

- Unlimited workflows
- 10 custom AI agents
- Priority support
- 100,000 API calls/month
- Advanced analytics
- Custom integrations

**Pricing**: $99/month or $990/year

### Enterprise

- Everything in Pro
- Unlimited agents
- Dedicated support
- Custom integrations
- SLA guarantee
- On-premise option (available)

**Pricing**: Custom pricing

## Billing Flow

1. **User selects plan** → Redirected to Stripe Checkout
2. **Payment processed** → Stripe webhook updates subscription status
3. **Access granted** → User gains access to plan features
4. **Usage tracked** → API calls and features tracked per plan limits

## Implementation

### Stripe Configuration

Required environment variables:

```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### API Endpoints

- `POST /api/stripe/create-checkout-app` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/billing/subscription-status` - Get user subscription status
- `POST /api/billing/upgrade` - Upgrade subscription
- `POST /api/billing/downgrade` - Downgrade subscription

### Webhook Events

The platform handles these Stripe webhook events:

- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Payment succeeded
- `invoice.payment_failed` - Payment failed

## Usage Limits

Limits are enforced at the API level:

- **Rate Limiting**: Plan-based rate limits per hour
- **Feature Access**: Entitlement checks before feature access
- **API Calls**: Tracked and limited per plan

## Subscription Management

Users can manage subscriptions through:

- Dashboard → Settings → Billing
- Stripe Customer Portal (if configured)
- API endpoints for programmatic access

## Testing

For local development, use Stripe test mode:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Security

- Webhook signatures verified using `STRIPE_WEBHOOK_SECRET`
- Service role key never exposed to client
- Subscription status cached and validated per request
- Audit logs track all billing events

## Troubleshooting

### Webhook Not Receiving Events

1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. Check webhook endpoint is accessible: `/api/stripe/webhook`
3. Verify webhook URL in Stripe dashboard matches deployment URL

### Subscription Status Not Updating

1. Check webhook logs in Stripe dashboard
2. Verify database connection
3. Check application logs for errors

---

For implementation details, see the billing API routes in `app/api/billing/`.
