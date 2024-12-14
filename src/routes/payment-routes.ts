import { Elysia, t } from 'elysia';
import { createCustomer, createPaymentIntent, createSubscription } from '../lib/stripe/stripe-utils';
import type { User as AuthUser, Session } from 'better-auth/types';
import type { Stripe } from 'stripe';
import { userMiddleware } from '../lib/middleware/auth-middleware';
import { prisma } from '../lib/prisma';

interface User extends AuthUser {
  stripeCustomerId?: string;
}


export const paymentRoutes = new Elysia({ prefix: '/api/payments' })
  .derive(async (context) => {
    const auth = await userMiddleware(context);
    return { store: { user: auth.user as User, session: auth.session } };
  })
  .post('/create-payment-intent',
    async ({ body, store: { user } }) => {
      try {
        // Ensure user has a Stripe customer ID
        if (!user.stripeCustomerId) {
          const customer = await createCustomer({ email: user.email, name: user.name });
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id }
          });
          user.stripeCustomerId = customer.id;
        }

        const paymentIntent = await createPaymentIntent({
          amount: body.amount,
          currency: body.currency || 'usd',
          customerId: user.stripeCustomerId,
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
    async ({ body, store: { user } }) => {
      try {
        if (!user.email) {
          throw new Error('User email is required');
        }

        // Ensure user has a Stripe customer ID
        if (!user.stripeCustomerId) {
          const customer = await createCustomer({ email: user.email, name: user.name });
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id }
          });
          user.stripeCustomerId = customer.id;
        }

        const subscription = await createSubscription(user.stripeCustomerId, body.priceId);
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        // Store subscription in database
        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            stripePriceId: body.priceId,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });

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