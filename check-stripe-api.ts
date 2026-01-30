import Stripe from 'stripe';

// Diagnostic script to check Stripe API methods
// This is intentionally bypassing type checking for runtime inspection
const stripe = new Stripe('sk_test_dummy', {
  apiVersion: '2025-12-15.clover' as unknown as Stripe.LatestApiVersion,
});

console.info(
  'Invoice methods:',
  Object.getOwnPropertyNames(Object.getPrototypeOf(stripe.invoices))
);
console.info(
  'SubscriptionItem methods:',
  Object.getOwnPropertyNames(Object.getPrototypeOf(stripe.subscriptionItems))
);

export {};
