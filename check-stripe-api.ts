import Stripe from 'stripe';

// Check available methods on stripe.invoices and stripe.subscriptionItems
const stripe = new Stripe('sk_test_dummy', {
  apiVersion: '2025-12-15.clover' as any, // bypass type check to inspect API
});

console.log(
  'Invoice methods:',
  Object.getOwnPropertyNames(Object.getPrototypeOf(stripe.invoices))
);
console.log(
  'SubscriptionItem methods:',
  Object.getOwnPropertyNames(Object.getPrototypeOf(stripe.subscriptionItems))
);

// Try to find the correct method names
export {};
