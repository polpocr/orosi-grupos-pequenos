import { query } from "./_generated/server";

export const getAdminData = query({
  handler: async (ctx) => {
    // Verificar autenticación
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("No autenticado");
    }

    // Buscar usuario en la tabla users
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    // Verificar que exista en la BD
    if (!user) {
      throw new Error("Usuario no encontrado en la base de datos");
    }

    // Verificar que sea admin
    if (user.role !== "admin") {
      throw new Error("No autorizado. Solo administradores pueden acceder.");
    }

    // Si pasa todas las validaciones, retornar datos
    return {
      message: "Acceso autorizado",
      user: {
        email: identity.email,
        name: identity.name,
        role: user.role,
      },
    };
  },
});
