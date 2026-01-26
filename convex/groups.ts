import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getFormDependencies = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const districts = await ctx.db.query("districts").collect();
    const seasons = await ctx.db.query("seasons").collect();

    return {
      categories,
      districts,
      seasons,
    };
  },
});

export const get = query({
  args: { id: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("groups").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    seasonId: v.id("seasons"),
    categoryId: v.id("categories"),
    districtId: v.id("districts"),
    day: v.string(),
    time: v.string(),
    modality: v.string(),
    address: v.optional(v.string()),
    geoReferencia: v.optional(v.string()),
    leaders: v.array(v.string()),
    targetAudience: v.optional(v.string()),
    minAge: v.number(),
    maxAge: v.number(),
    legacyId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.minAge > args.maxAge) {
      throw new ConvexError("La edad mínima no puede ser mayor a la máxima");
    }

    const groupId = await ctx.db.insert("groups", {
      ...args,
      currentMembersCount: 0,
    });

    return groupId;
  },
});

export const update = mutation({
  args: {
    id: v.id("groups"),
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    seasonId: v.id("seasons"),
    categoryId: v.id("categories"),
    districtId: v.id("districts"),
    day: v.string(),
    time: v.string(),
    modality: v.string(),
    address: v.optional(v.string()),
    geoReferencia: v.optional(v.string()),
    leaders: v.array(v.string()),
    targetAudience: v.optional(v.string()),
    minAge: v.number(),
    maxAge: v.number(),
    legacyId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    if (updates.minAge > updates.maxAge) {
      throw new ConvexError("La edad mínima no puede ser mayor a la máxima");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
    args: { id: v.id("groups") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
