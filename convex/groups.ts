import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getFormDependencies = query({
  args: {},
  handler: async (ctx) => {
    // Solo categorías activas
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
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
    // Obtener primero las categorías activas
    const activeCategories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    const activeCategoryIds = new Set(activeCategories.map(c => c._id));
    
    const groups = await ctx.db.query("groups").collect();
    
    // Filtrar solo grupos con categorías activas
    const groupsWithActiveCategories = groups.filter(
      group => activeCategoryIds.has(group.categoryId)
    );
    
    // Enriquecer con info del distrito
    const groupsWithDistricts = await Promise.all(
        groupsWithActiveCategories.map(async group => {
            const district = await ctx.db.get(group.districtId);
            return {
                ...group,
                district
            };
        })
    );

    return groupsWithDistricts;
  },
});

export const getPublicGroups = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    district: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Modo Búsqueda
    if (args.search) {
       return await ctx.db
        .query("groups")
        .withSearchIndex("search_name", (q) => q.search("name", args.search!))
        .paginate(args.paginationOpts);
    }

    // Modo Filtrado 
    let q = ctx.db.query("groups");

    // Aplicar filtros condicionales
    if (args.category && args.category !== "all") {
        q = q.filter((q) => q.eq(q.field("categoryId"), args.category));
    }

    if (args.district && args.district !== "all") {
        q = q.filter((q) => q.eq(q.field("districtId"), args.district));
    }

    // Ordenar y Paginar
    return await q.order("desc").paginate(args.paginationOpts);
  },
});

export const getGroups = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    sortOrder: v.optional(v.string()), // "asc" | "desc"
    categoryId: v.optional(v.string()),
    districtId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchQuery) {
      return await ctx.db
        .query("groups")
        .withSearchIndex("search_name", (q) => 
          q.search("name", args.searchQuery!)
        )
        .paginate(args.paginationOpts);
    }

    const order = args.sortOrder === "asc" ? "asc" : "desc";

    let query = ctx.db.query("groups");

    // Aplicar filtros
    if (args.categoryId) {
      query = query.filter((q) => q.eq(q.field("categoryId"), args.categoryId));
    }

    if (args.districtId) {
      query = query.filter((q) => q.eq(q.field("districtId"), args.districtId));
    }

    return await query.order(order).paginate(args.paginationOpts);
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

    const existingGroup = await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existingGroup) {
      throw new ConvexError("Ya existe un grupo con este nombre");
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

    const existingGroup = await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("name"), updates.name))
      .first();

    if (existingGroup && existingGroup._id !== id) {
      throw new ConvexError("Ya existe un grupo con este nombre");
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
