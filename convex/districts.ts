import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("districts").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("districts", {
      name: args.name,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("districts"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, name } = args;
    await ctx.db.patch(id, { name });
  },
});

export const remove = mutation({
  args: {
    id: v.id("districts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
