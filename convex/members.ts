import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getByGroupId = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
  },
});

export const add = mutation({
  args: {
    groupId: v.id("groups"),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Obtener el grupo destino y su temporada
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError("Grupo no encontrado");
    }

    const targetSeasonId = group.seasonId;

    // 2. Buscar inscripciones existentes del email
    const existingMembers = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    // 3. Verificar si ya está inscrito en un grupo de la misma temporada
    for (const member of existingMembers) {
      const memberGroup = await ctx.db.get(member.groupId);
      if (memberGroup && memberGroup.seasonId === targetSeasonId) {
        throw new ConvexError("Ya estás inscrito en un grupo para esta temporada.");
      }
    }

    // 4. Validar capacidad del grupo
    if (group.currentMembersCount >= group.capacity) {
      throw new ConvexError("El grupo ha alcanzado su capacidad máxima");
    }

    // 5. Insertar el nuevo miembro
    const memberId = await ctx.db.insert("members", {
      groupId: args.groupId,
      fullName: args.fullName,
      email: args.email,
      phone: args.phone,
      timestamp: Date.now(),
    });

    // 6. Actualizar el contador del grupo
    await ctx.db.patch(args.groupId, {
      currentMembersCount: group.currentMembersCount + 1,
    });

    return memberId;
  },
});

export const remove = mutation({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member) {
      throw new ConvexError("Miembro no encontrado");
    }

    const group = await ctx.db.get(member.groupId);
    if (!group) {
        await ctx.db.delete(args.memberId);
        return;
    }

    // 1. Eliminar el miembro
    await ctx.db.delete(args.memberId);

    // 2. Restar al contador del grupo (asegurando que no baje de 0)
    const newCount = Math.max(0, group.currentMembersCount - 1);
    await ctx.db.patch(member.groupId, {
      currentMembersCount: newCount,
    });
  },
});

export const update = mutation({
  args: {
    memberId: v.id("members"),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const { memberId, ...updates } = args;
    await ctx.db.patch(memberId, updates);
  },
});
