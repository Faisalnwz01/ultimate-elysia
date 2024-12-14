import Stripe from 'stripe';

export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;