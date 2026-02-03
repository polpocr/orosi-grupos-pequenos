import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";

export const registerMember = mutation({
  args: {
    groupId: v.id("groups"),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Obtener el grupo destino y validar existencia
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError("El grupo no existe.");
    }

    const targetSeasonId = group.seasonId;

    // 2. Validar que el email no esté inscrito en otro grupo de la MISMA temporada
    const existingMembers = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    for (const member of existingMembers) {
      const memberGroup = await ctx.db.get(member.groupId);
      if (memberGroup && memberGroup.seasonId === targetSeasonId) {
        throw new ConvexError("Ya estás inscrito en un grupo para esta temporada.");
      }
    }

    // 3. Validación de cupo
    if (group.currentMembersCount >= group.capacity) {
      throw new ConvexError("El grupo ya está lleno.");
    }

    // 4. Insertar miembro
    await ctx.db.insert("members", {
      groupId: args.groupId,
      fullName: args.fullName,
      email: args.email,
      phone: args.phone,
      timestamp: Date.now(),
    });

    // 5. Actualizar contador del grupo
    await ctx.db.patch(args.groupId, {
      currentMembersCount: group.currentMembersCount + 1,
    });

    // 4. Agendar envío de Correo
    await ctx.scheduler.runAfter(0, internal.emails.sendRegistrationEmail, {
      email: args.email,
      name: args.fullName,
      groupName: group.name,
    });
  },
});
