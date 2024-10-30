import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    handle: v.optional(v.string()),
    userId: v.string(),
  })
    .searchIndex("search_by_handle", { searchField: "handle" })
    .index("by_userId", ["userId"])
    .index("by_handle", ["handle"]),
  subscriptions: defineTable({
    userId: v.string(),
    subscriptionId: v.string(),
    expires: v.number(),
    priceId: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_subscriptionId", ["subscriptionId"])
    .index("by_priceId", ["priceId"]),
  user_links: defineTable({
    userId: v.string(),
    anchor: v.string(),
    href: v.string(),
    weight: v.number(),
    color: v.string(),
  }).index("by_userId", ["userId"]),
});
