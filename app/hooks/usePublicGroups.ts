import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { filterGroups, FilterState, getGroupTime, sortDays } from "@/app/helpers/filters";

const ITEMS_PER_PAGE = 9;

export interface UsePublicGroupsFilters extends FilterState {
    search: string;
    district: string;
}

const DEFAULT_FILTERS: UsePublicGroupsFilters = {
    search: "",
    category: "all",
    district: "", // Mapea a 'location' en la lógica de FilterState
    location: "", // Sincronizar con district
    modality: "",
    day: "",
    schedule: "",
    ageRange: [18, 99],
    target: "",
    mode: ""
};

export function usePublicGroups(initialFilters: Partial<UsePublicGroupsFilters>) {
    const [page, setPage] = useState(0);
    const [filters, setFiltersState] = useState<UsePublicGroupsFilters>({
        ...DEFAULT_FILTERS,
        ...initialFilters,
        location: initialFilters.district || "", // Asegurar compatibilidad
    });

    // 1. Obtener todos los grupos (Estrategia de filtrado del lado del cliente)
    const allGroups = useQuery(api.groups.getAllPublicGroups);
    const isLoading = allGroups === undefined;

    // 2. Filtrar localmente
    const filteredGroups = useMemo(() => {
        if (!allGroups) return [];
        // Asegurar que 'location' y 'district' estén sincronizados, filterGroups usa 'location'
        const effectiveFilters = {
            ...filters,
            location: filters.district || filters.location // Preferir district si está establecido (desde URL)
        };
        return filterGroups(allGroups, effectiveFilters, filters.search);
    }, [allGroups, filters]);

    // Calcular opciones dinámicas de TODOS los grupos (no solo los filtrados)
    const options = useMemo(() => {
        if (!allGroups) return { modalities: [], days: [], schedules: [], targets: [] };
        
        const modalities = Array.from(new Set(allGroups.map(g => g.modality).filter(Boolean))).sort();
        const days = sortDays(Array.from(new Set(allGroups.map(g => g.day).filter(Boolean))));
        const schedules = Array.from(new Set(allGroups.map(g => getGroupTime(g.time)).filter(Boolean))).sort();
        const targets = Array.from(new Set(allGroups.map(g => g.targetAudience).filter((t): t is string => !!t))).sort();

        return { modalities, days, schedules, targets };
    }, [allGroups]);

    // 3. Paginar localmente
    const visibleGroups = useMemo(() => {
        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredGroups.slice(start, end); // Mostrar SOLAMENTE los de la página actual
    }, [filteredGroups, page]);

    const canNext = (page + 1) * ITEMS_PER_PAGE < filteredGroups.length;
    const canPrev = page > 0;

    const nextPage = () => {
        if (canNext) {
            setPage((p) => p + 1);
        }
    };

    const prevPage = () => {
        if (canPrev) {
            setPage((p) => p - 1);
        }
    };

    const setFilter = (key: keyof UsePublicGroupsFilters, value: string | [number, number]) => {
        setFiltersState((prev) => {
            const newState = { ...prev, [key]: value };
            // Sincronizar alias
            if (key === "district" && typeof value === "string") newState.location = value;
            if (key === "location" && typeof value === "string") newState.district = value;
            return newState;
        });
        setPage(0); // Reiniciar paginación al cambiar filtros
    };

    return {
        groups: visibleGroups,
        isLoading,
        isLoadingMore: false, // No relevante para paginación local
        page,
        nextPage,
        prevPage,
        canNext,
        canPrev,
        setFilter,
        filters,
        totalLoaded: visibleGroups.length,
        options // Opciones dinámicas y reactivas
    };
}
