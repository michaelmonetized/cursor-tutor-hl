"use node";

import { v } from "convex/values";
import Stripe from "stripe";

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

type Metadata = {
  userId: string;
};

const apiVersion = "2024-09-30.acacia";

export const pay = action({
  args: {
    lineItems: v.array(
      v.object({
        price: v.string(), // priceId
        quantity: v.number(), // defaults to 1 if not set
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("you must be logged in to subscribe");
    }

    if (!user.emailVerified) {
      throw new Error("you must have a verified email to subscribe");
    }

    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion,
    });

    const defaultQuantity = 1;
    const lineItems = args.lineItems.map((item) => ({
      price: item.price,
      quantity: item.quantity ?? defaultQuantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      customer_email: user.email,
      metadata: {
        userId: user.subject,
      },
      mode: "subscription",
      success_url: `${domain}`,
      cancel_url: `${domain}`,
    });

    return session.url!;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion,
    });

    const webhookSecret = process.env.STRIPE_CONVEX_WEBHOOK_SECRET!;
    try {
      const event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );

      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        const userId = completedEvent.metadata.userId;

        await ctx.runMutation(internal.users.createUserSubscription, {
          userId,
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0]?.price.id,
          expires: subscription.current_period_end * 1000,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        await ctx.runMutation(internal.users.renewUserSubscription, {
          subscriptionId: subscription.items.data[0]?.price.id,
          expires: subscription.current_period_end * 1000,
        });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
