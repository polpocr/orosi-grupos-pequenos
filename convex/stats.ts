import { query } from "./_generated/server";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const groups = await ctx.db.query("groups").collect();
        const members = await ctx.db.query("members").collect();
        const categories = await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();

        const totalGroups = groups.length;
        const totalMembers = members.length;
        const totalCapacity = groups.reduce((sum, g) => sum + g.capacity, 0);
        const occupancyRate = totalCapacity > 0 
            ? Math.round((totalMembers / totalCapacity) * 100) 
            : 0;

        // Grupos llenos (100% capacidad)
        const fullGroups = groups.filter(g => g.currentMembersCount >= g.capacity).length;

        // Distribución por categoría
        const groupsByCategory = categories.map(cat => {
            const categoryGroups = groups.filter(g => g.categoryId === cat._id);
            return {
                name: cat.name,
                color: cat.color,
                count: categoryGroups.length,
                totalCapacity: categoryGroups.reduce((sum, g) => sum + g.capacity, 0),
                totalMembers: categoryGroups.reduce((sum, g) => sum + g.currentMembersCount, 0),
            };
        });

        return {
            totalGroups,
            totalMembers,
            occupancyRate,
            fullGroups,
            availableSpots: totalCapacity - totalMembers,
            groupsByCategory,
        };
    },
});
