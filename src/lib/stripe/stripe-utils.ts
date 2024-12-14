import { stripe } from './stripe-config';
import type { Stripe } from 'stripe';

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent({
  amount,
  currency,
  customerId,
  metadata
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  return await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function createCustomer({
  email,
  name,
  metadata
}: CreateCustomerParams): Promise<Stripe.Customer> {
  if (!email) {
    throw new Error('Email is required');
  }

  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
  if (!customerId) {
    throw new Error('Customer ID is required');
  }

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    throw new Error('Customer has been deleted');
  }

  return customer as Stripe.Customer;
}

export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  if (!customerId) {
    throw new Error('Customer ID is required');
  }
  if (!priceId) {
    throw new Error('Price ID is required');
  }

  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}