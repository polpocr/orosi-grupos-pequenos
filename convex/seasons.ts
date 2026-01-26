import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all seasons sorted by creation time
export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("seasons").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    isActive: v.boolean(),
    registrationStart: v.string(),
    registrationEnd: v.string(),
    groupStart: v.string(),
    groupEnd: v.string(),
  },
  handler: async (ctx, args) => {
    // If setting as active, deactivate all others first
    if (args.isActive) {
      const activeSeasons = await ctx.db
        .query("seasons")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      for (const season of activeSeasons) {
        await ctx.db.patch(season._id, { isActive: false });
      }
    }

    // Create the new season
    return await ctx.db.insert("seasons", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("seasons"),
    name: v.string(),
    isActive: v.boolean(),
    registrationStart: v.string(),
    registrationEnd: v.string(),
    groupStart: v.string(),
    groupEnd: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    // If setting as active, deactivate all others first (excluding itself if it was already active)
    if (rest.isActive) {
      const activeSeasons = await ctx.db
        .query("seasons")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      for (const season of activeSeasons) {
        if (season._id !== id) {
          await ctx.db.patch(season._id, { isActive: false });
        }
      }
    }

    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: {
    id: v.id("seasons"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
