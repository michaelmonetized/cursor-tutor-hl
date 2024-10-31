import { v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getUserId } from "./utils";

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
  return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return undefined;
    }

    return getFullUser(ctx, userId);
  },
});

export const getUserByHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first();
  },
});

export const getUserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getUserSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return [];
    }

    return ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getUserActiveSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return [];
    }

    return ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.gt(q.field("expires"), Date.now()))
      .collect();
  },
});

export const isPro = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return [];
    }

    const priceIds = [
      "price_1QFOfmDQtisrXovAo0yulTQe",
      "price_1QFZPtDQtisrXovAEvcGfnCl",
    ];

    return ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.gt(q.field("expires"), Date.now()),
          q.or(
            q.eq(q.field("priceId"), priceIds[0]),
            q.eq(q.field("priceId"), priceIds[1])
          )
        )
      )
      .collect();
  },
});

export const isUnlimited = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return [];
    }

    const priceIds = [
      "price_1QFZPRDQtisrXovAxWAdWX2g",
      "price_1QFOjgDQtisrXovAmiXnYEzy",
    ];

    return ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.gt(q.field("expires"), Date.now()),
          q.or(
            q.eq(q.field("priceId"), priceIds[0]),
            q.eq(q.field("priceId"), priceIds[1])
          )
        )
      )
      .collect();
  },
});

export const createUser = internalMutation({
  args: { handle: v.optional(v.string()), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      userId: args.userId,
      handle: args.handle,
    });
  },
});

export const createUserPublic = mutation({
  args: { handle: v.optional(v.string()), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      userId: args.userId,
      handle: args.handle,
    });
  },
});

export const setUniqueUserHandle = mutation({
  args: { handle: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new Error("User not found");
    }

    // User already has a handle
    if (user.handle) {
      throw new Error("User already has a handle");
    }

    // Handle is already taken
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first();

    if (existingUser) {
      throw new Error(`Handle ${args.handle} already taken`);
    }

    return await ctx.db.patch(user._id, { handle: args.handle });
  },
});

export const createUserSubscription = internalMutation({
  args: {
    userId: v.string(),
    subscriptionId: v.string(),
    priceId: v.string(),
    expires: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getFullUser(ctx, args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.insert("subscriptions", {
      userId: args.userId,
      subscriptionId: args.subscriptionId,
      priceId: args.priceId,
      expires: args.expires,
    });
  },
});

export const renewUserSubscription = internalMutation({
  args: { subscriptionId: v.string(), expires: v.number() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscriptionId", (q) =>
        q.eq("subscriptionId", args.subscriptionId)
      )
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return await ctx.db.patch(subscription._id, { expires: args.expires });
  },
});
