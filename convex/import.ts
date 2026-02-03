import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener datos necesarios para la plantilla de importación
export const getImportTemplate = query({
    args: {},
    handler: async (ctx) => {
        const categories = await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();
        const districts = await ctx.db.query("districts").collect();
        const seasons = await ctx.db.query("seasons").collect();

        return {
            categories: categories.map((c) => c.name),
            districts: districts.map((d) => d.name),
            seasons: seasons.map((s) => s.name),
            modalities: ["Presencial", "Virtual", "Híbrido"],
            days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        };
    },
});

// Tipo para un grupo del CSV
const csvGroupValidator = v.object({
    name: v.string(),
    description: v.string(),
    capacity: v.number(),
    seasonName: v.string(),
    categoryName: v.string(),
    districtName: v.string(),
    day: v.string(),
    time: v.string(),
    modality: v.string(),
    leaders: v.string(), // Viene como string separado por comas
    minAge: v.number(),
    maxAge: v.number(),
    address: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
});

interface ValidationResult {
    row: number;
    isValid: boolean;
    errors: string[];
    data?: {
        name: string;
        description: string;
        capacity: number;
        seasonId: string;
        categoryId: string;
        districtId: string;
        day: string;
        time: string;
        modality: string;
        leaders: string[];
        minAge: number;
        maxAge: number;
        address?: string;
        targetAudience?: string;
    };
}

// Normaliza la modalidad a un valor estándar
function normalizeModality(modality: string): string | null {
    const lower = modality?.toLowerCase() || "";
    
    if (lower.includes("presencial")) return "Presencial";
    if (lower.includes("virtual") || lower.includes("zoom") || lower.includes("teams") || lower.includes("online")) return "Virtual";
    if (lower.includes("híbrido") || lower.includes("hibrido") || lower.includes("mixto")) return "Híbrido";
    
    return null;
}

// Capitaliza la primera letra
function capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Validar grupos antes de insertar
export const validateGroups = mutation({
    args: {
        groups: v.array(csvGroupValidator),
    },
    handler: async (ctx, args) => {
        const categories = await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();
        const districts = await ctx.db.query("districts").collect();
        const seasons = await ctx.db.query("seasons").collect();
        const existingGroups = await ctx.db.query("groups").collect();
        const existingNames = new Set(existingGroups.map((g) => g.name.toLowerCase()));

        const results: ValidationResult[] = [];

        for (let i = 0; i < args.groups.length; i++) {
            const group = args.groups[i];
            const errors: string[] = [];

            // Validar campos obligatorios
            if (!group.name?.trim()) errors.push("Nombre es obligatorio");
            if (!group.description?.trim()) errors.push("Descripción es obligatoria");
            if (!group.capacity || group.capacity <= 0) errors.push("Capacidad debe ser mayor a 0");

            // Buscar IDs por nombre
            const category = categories.find(
                (c) => c.name.toLowerCase() === group.categoryName?.toLowerCase()
            );
            if (!category) errors.push(`Categoría '${group.categoryName}' no encontrada`);

            const district = districts.find(
                (d) => d.name.toLowerCase() === group.districtName?.toLowerCase()
            );
            if (!district) errors.push(`Distrito '${group.districtName}' no encontrado`);

            const season = seasons.find(
                (s) => s.name.toLowerCase() === group.seasonName?.toLowerCase()
            );
            if (!season) errors.push(`Temporada '${group.seasonName}' no encontrada`);

            // Validar nombre duplicado
            if (group.name && existingNames.has(group.name.toLowerCase())) {
                errors.push(`Ya existe un grupo llamado '${group.name}'`);
            }

            // Validar edades
            if (group.minAge > group.maxAge) {
                errors.push("Edad mínima no puede ser mayor que la máxima");
            }

            // Validar día y modalidad
            const validDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
            if (!validDays.includes(group.day?.toLowerCase())) {
                errors.push(`Día '${group.day}' no válido`);
            }

            // Normalizar y validar modalidad (acepta variaciones)
            const normalizedModality = normalizeModality(group.modality);
            if (!normalizedModality) {
                errors.push(`Modalidad '${group.modality}' no válida`);
            }

            results.push({
                row: i + 2, // +2 porque la fila 1 es el header y los arrays empiezan en 0
                isValid: errors.length === 0,
                errors,
                data: errors.length === 0 ? {
                    name: group.name.trim(),
                    description: group.description.trim(),
                    capacity: group.capacity,
                    seasonId: season!._id,
                    categoryId: category!._id,
                    districtId: district!._id,
                    day: capitalizeFirst(group.day),
                    time: group.time,
                    modality: normalizedModality || group.modality,
                    leaders: group.leaders?.split(",").map((l) => l.trim()).filter(Boolean) || [],
                    minAge: group.minAge,
                    maxAge: group.maxAge,
                    address: group.address?.trim() || undefined,
                    targetAudience: group.targetAudience?.trim() || undefined,
                } : undefined,
            });
        }

        const validCount = results.filter((r) => r.isValid).length;
        const invalidCount = results.filter((r) => !r.isValid).length;

        return {
            results,
            summary: {
                total: args.groups.length,
                valid: validCount,
                invalid: invalidCount,
            },
        };
    },
});

// Insertar grupos validados
export const importGroups = mutation({
    args: {
        groups: v.array(
            v.object({
                name: v.string(),
                description: v.string(),
                capacity: v.number(),
                seasonId: v.id("seasons"),
                categoryId: v.id("categories"),
                districtId: v.id("districts"),
                day: v.string(),
                time: v.string(),
                modality: v.string(),
                leaders: v.array(v.string()),
                minAge: v.number(),
                maxAge: v.number(),
                address: v.optional(v.string()),
                targetAudience: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const insertedIds = [];

        for (const group of args.groups) {
            const id = await ctx.db.insert("groups", {
                ...group,
                currentMembersCount: 0,
            });
            insertedIds.push(id);
        }

        return {
            success: true,
            count: insertedIds.length,
        };
    },
});
