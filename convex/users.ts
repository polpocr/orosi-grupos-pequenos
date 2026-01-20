import { mutation, query } from "./_generated/server";

/*
  Crea o actualiza un usuario en la tabla users cuando hace login
  Se ejecuta automáticamente la primera vez que un usuario se autentica
 */
export const storeUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("No autenticado");
    }

    // Verificar si el usuario ya existe
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    // Si ya existe, no hacer nada
    if (existingUser) {
      return existingUser._id;
    }

    // Si no existe, crear nuevo usuario con role "admin" por defecto
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      name: identity.name || identity.email!,
      role: "admin", 
    });

    return userId;
  },
});

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    return user;
  },
});
