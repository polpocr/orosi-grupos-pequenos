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
    // 1. Validar Duplicados
    // Buscamos si ya existe un miembro con este email en el grupo específico
    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingMember) {
      throw new ConvexError("Este correo ya está registrado en este grupo.");
    }

    // 2. Validación de Cupo
    const group = await ctx.db.get(args.groupId);
    if (!group) {
        throw new ConvexError("El grupo no existe.");
    }

    if (group.currentMembersCount >= group.capacity) {
      throw new ConvexError("El grupo ya está lleno.");
    }

    // 3. Ejecución
    // Insertar miembro
    await ctx.db.insert("members", {
      groupId: args.groupId,
      fullName: args.fullName,
      email: args.email,
      phone: args.phone,
      timestamp: Date.now(),
      // userId se deja undefined
    });

    // Actualizar contador del grupo
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
