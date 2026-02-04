import { useMemo } from "react";
import { FilterState } from "@/app/helpers/filters";

// Tipos requeridos para el adaptador
export type FilterKey = keyof FilterState | "search" | "district";
export type FilterValue = string | [number, number];

// Interfaz que define los filtros extendidos
export interface ExtendedFilters extends FilterState {
    search: string;
    district: string;
}

interface UseGroupsFilterAdapterProps {
    filters: ExtendedFilters;
    setFilter: (key: FilterKey, value: FilterValue) => void;
}

export const useGroupsFilterAdapter = ({ filters, setFilter }: UseGroupsFilterAdapterProps) => {
    
    // Adaptador para las props que espera FilterSidebar
    const sidebarFilters: FilterState = useMemo(() => ({
        category: filters.category,
        location: filters.district,
        // Valores por defecto para filtros
        modality: filters.modality || "",
        day: filters.day || "",
        schedule: filters.schedule || "",
        ageRange: filters.ageRange || [18, 99],
        target: filters.target || "",
        mode: filters.mode || ""
    }), [filters]);

    // Manejador tipado para los cambios del sidebar
    const handleSidebarChange = (newFilters: FilterState) => {
        // Actualizar filtros principales
        if (newFilters.category !== filters.category) setFilter("category", newFilters.category);
        if (newFilters.location !== filters.district) setFilter("district", newFilters.location);
        
        // Actualizar filtros adicionales
        if (newFilters.modality !== filters.modality) setFilter("modality", newFilters.modality);
        if (newFilters.day !== filters.day) setFilter("day", newFilters.day);
        if (newFilters.schedule !== filters.schedule) setFilter("schedule", newFilters.schedule);
        if (newFilters.target !== filters.target) setFilter("target", newFilters.target);
        if (newFilters.mode !== filters.mode) setFilter("mode", newFilters.mode);
        
        // Rango de edad: Comparación profunda básica
        const currentAge = filters.ageRange || [18, 99];
        if (newFilters.ageRange[0] !== currentAge[0] || newFilters.ageRange[1] !== currentAge[1]) {
            setFilter("ageRange", newFilters.ageRange);
        }
    };

    return {
        sidebarFilters,
        handleSidebarChange
    };
};
