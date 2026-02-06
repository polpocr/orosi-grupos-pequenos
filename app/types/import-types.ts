import { Id } from "@/convex/_generated/dataModel";

export interface CSVGroup {
    [key: string]: string | number | undefined;
    name: string;
    description: string;
    capacity: number;
    seasonName: string;
    categoryName: string;
    districtName: string;
    day: string;
    time: string;
    modality: string;
    leaders: string;
    minAge: number;
    maxAge: number;
    address?: string;
    targetAudience?: string;
    geoReferencia?: string;
}

export interface ValidationResult {
    row: number;
    isValid: boolean;
    errors: string[];
    data?: {
        name: string;
        description: string;
        capacity: number;
        seasonId: Id<"seasons">;
        categoryId: Id<"categories">;
        districtId: Id<"districts">;
        day: string;
        time: string;
        modality: string;
        leaders: string[];
        minAge: number;
        maxAge: number;
        address?: string;
        targetAudience?: string;
        geoReferencia?: string;
    };
}
