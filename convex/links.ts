import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getFullUser,
  getUserActiveSubscriptions,
  getUserByHandle,
} from "@/convex/users";
import { getUserId } from "@/convex/utils";
import { randomHSL } from "@/utils";

export const createLink = mutation({
  args: {
    anchor: v.string(),
    href: v.string(),
    color: v.optional(v.string()), // pro feature
    weight: v.optional(v.number()), // pro feature
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new Error("User not found");
    }

    const subscriptions = await getUserActiveSubscriptions(ctx, userId);

    const randomColor = randomHSL();

    const data = {
      userId,
      anchor: args.anchor,
      href: args.href,
      color:
        args.color ??
        `hsl(${randomColor.hue}, ${randomColor.sat}%, ${randomColor.lum}%)`,
      weight: args.weight ?? 0,
    };

    if (subscriptions.length === 0) {
      data.color = `hsl(${randomColor.hue}, ${randomColor.sat}%, ${randomColor.lum}%)`;
      data.weight = 0;
    }

    await ctx.db.insert("user_links", { ...data });
  },
});

export const readLinks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("user_links")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const readUserLinksByHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByHandle(ctx, args);

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user.userId;

    return await ctx.db
      .query("user_links")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const updateLink = mutation({
  args: {
    id: v.id("user_links"),
    userId: v.string(),
    anchor: v.string(),
    href: v.string(),
    color: v.optional(v.string()),
    weight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new Error("User not found");
    }

    // check if user owns the link
    const link = await ctx.db.get(args.id);

    if (link?.userId !== userId) {
      throw new Error("User does not own this link");
    }

    const subscriptions = await getUserActiveSubscriptions(ctx, userId);

    const randomColor = randomHSL();

    const data = {
      userId,
      anchor: args.anchor,
      href: args.href,
      color:
        args.color ??
        `hsl(${randomColor.hue}, ${randomColor.sat}%, ${randomColor.lum}%)`,
      weight: args.weight ?? 0,
    };

    if (subscriptions.length === 0) {
      data.color = `hsl(${randomColor.hue}, ${randomColor.sat}%, ${randomColor.lum}%)`;
      data.weight = 0;
    }
    await ctx.db.patch(args.id, { ...data });
  },
});

export const deleteLink = mutation({
  args: {
    id: v.id("user_links"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }

    const user = await getFullUser(ctx, userId);

    if (!user) {
      throw new Error("User not found");
    }

    // check if user owns the link
    const link = await ctx.db.get(args.id);

    if (link?.userId !== userId) {
      throw new Error("User does not own this link");
    }

    await ctx.db.delete(args.id);
  },
});
