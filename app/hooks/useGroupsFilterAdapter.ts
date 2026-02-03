import { useMemo } from "react";
import { FilterState } from "../components/groups/filters/FilterSidebar";

interface SimpleFilters {
    search: string;
    category: string;
    district: string;
}

interface UseGroupsFilterAdapterProps {
    filters: SimpleFilters;
    setFilter: (key: "search" | "category" | "district", value: string) => void;
}

export const useGroupsFilterAdapter = ({ filters, setFilter }: UseGroupsFilterAdapterProps) => {
    
    // Adaptador para las props que espera FilterSidebar
    const sidebarFilters: FilterState = useMemo(() => ({
        category: filters.category,
        location: filters.district,
        // Valores por defecto para filtros no gestionados por el hook principal aún
        modality: "",
        day: "",
        schedule: "",
        ageRange: [18, 99],
        target: "",
        mode: ""
    }), [filters]);

    // Manejador tipado para los cambios del sidebar
    const handleSidebarChange = (newFilters: FilterState) => {
        // Solo actualizamos lo que nuestro sistema actual soporta (categoría y distrito)
        if (newFilters.category !== filters.category) {
            setFilter("category", newFilters.category);
        }
        
        if (newFilters.location !== filters.district) {
            setFilter("district", newFilters.location);
        }
    };

    return {
        sidebarFilters,
        handleSidebarChange
    };
};
