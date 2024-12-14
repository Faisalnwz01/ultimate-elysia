import { Elysia, t } from 'elysia';
import { createCustomer, createPaymentIntent, createSubscription } from '../lib/stripe/stripe-utils';
import type { User, Session } from 'better-auth/types';
import type { Stripe } from 'stripe';
import { userMiddleware } from '../lib/middleware/auth-middleware';

type AuthData = { user: User; session: Session };

export const paymentRoutes = new Elysia({ prefix: '/api/payments' })
  .derive(async (data) => {
    const auth = await userMiddleware(data);
    return { store: auth as AuthData };
  })
  .post('/create-payment-intent',
    async ({ body, store: { user, session } }) => {
      try {
        const paymentIntent = await createPaymentIntent({
          amount: body.amount,
          currency: body.currency || 'usd',
          customerId: user.id,
          metadata: body.metadata
        });

        return {
          success: true,
          clientSecret: paymentIntent.client_secret
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Payment intent creation failed'
        };
      }
    }, {
      body: t.Object({
        amount: t.Number(),
        currency: t.Optional(t.String()),
        metadata: t.Optional(t.Record(t.String(), t.String()))
      })
    }
  )
  .post('/create-subscription',
    async ({ body, store: { user, session } }) => {
      try {
        if (!user.email) {
          throw new Error('User email is required');
        }

        const subscription = await createSubscription(user.id, body.priceId);
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        return {
          success: true,
          subscriptionId: subscription.id,
          clientSecret: paymentIntent?.client_secret
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Subscription creation failed'
        };
      }
    }, {
      body: t.Object({
        priceId: t.String()
      })
    }
  );