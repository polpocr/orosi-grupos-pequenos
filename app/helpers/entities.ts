import { Doc, Id } from "@/convex/_generated/dataModel";

export function getCategoryName(
    categoryId: Id<"categories">,
    categories: Doc<"categories">[] | undefined
): string {
    if (!categories) return "---";
    return categories.find((c) => c._id === categoryId)?.name || "---";
}

export function getDistrictName(
    districtId: Id<"districts">,
    districts: Doc<"districts">[] | undefined
): string {
    if (!districts) return "---";
    return districts.find((d) => d._id === districtId)?.name || "---";
}

export function getSeasonName(
    seasonId: Id<"seasons">,
    seasons: Doc<"seasons">[] | undefined
): string {
    if (!seasons) return "---";
    return seasons.find((s) => s._id === seasonId)?.name || "---";
}
