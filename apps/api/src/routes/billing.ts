import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

// --- Stripe Webhook Endpoint ---
// Note: Use raw body for stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const stripeId = session.customer as string;
      const userId = session.metadata?.userId; // Passed during checkout creation

      if (userId) {
        // Map Tier to database Plan enum
        const lineItem = await stripe.checkout.sessions.listLineItems(session.id);
        const planName = lineItem.data[0]?.description?.toUpperCase() || 'FREE';

        await prisma.user.update({
          where: { id: userId },
          data: { 
            stripeId, 
            plan: planName as any // FREE, PRO, GROWTH, ENTERPRISE
          }
        });
        console.log(`[Stripe] User ${userId} upgraded to ${planName}.`);
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.user.update({
        where: { stripeId: subscription.customer as string },
        data: { plan: 'FREE' }
      });
      console.log(`[Stripe] User subscription cancelled.`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
