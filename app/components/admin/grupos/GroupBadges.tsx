import { Id, Doc } from "@/convex/_generated/dataModel";

interface CategoryBadgeProps {
    categoryId: Id<"categories">;
    categories: Doc<"categories">[] | undefined;
}

export const CategoryBadge = ({ categoryId, categories }: CategoryBadgeProps) => {
    const category = categories?.find((c) => c._id === categoryId);
    if (!category) return <span className="text-muted-foreground text-sm">---</span>;

    const colorClass = category.color || "bg-slate-500";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-normal text-white shadow-sm transition-colors ${colorClass}`}>
            {category.name}
        </span>
    );
};

interface StateBadgeProps {
    seasonId: Id<"seasons">;
    seasons: Doc<"seasons">[] | undefined;
}

export const StateBadge = ({ seasonId, seasons }: StateBadgeProps) => {
    const season = seasons?.find(s => s._id === seasonId);

    if (season?.isActive) {
        return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                Activo
            </span>
        );
    }
    return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Inactivo
        </span>
    );
};
