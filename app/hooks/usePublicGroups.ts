import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

const ITEMS_PER_PAGE = 9;

export interface UsePublicGroupsFilters {
    search: string;
    category: string;
    district: string;
}

export function usePublicGroups(initialFilters: UsePublicGroupsFilters) {
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<UsePublicGroupsFilters>(initialFilters);

    const { results, status, loadMore } = usePaginatedQuery(
        api.groups.getPublicGroups,
        {
            search: filters.search || undefined,
            category: filters.category,
            district: filters.district || undefined,
        },
        { initialNumItems: ITEMS_PER_PAGE * 2 } // Cargamos 2 páginas iniciales
    );

    const groups = results || [];
    
    // Lógica de Paginación
    const visibleGroups = groups.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const hasMoreInDb = status === "CanLoadMore";
    const hasMoreLoaded = groups.length > (page + 1) * ITEMS_PER_PAGE;
    
    // Verificar si podemos avanzar (cargados o en BD)
    const canNext = hasMoreLoaded || hasMoreInDb;
    const canPrev = page > 0;

    const nextPage = () => {
        if (!canNext) return;

        // Si no hay suficientes items cargados para la SIGUIENTE página, cargar más
        if (!hasMoreLoaded && hasMoreInDb) {
            loadMore(ITEMS_PER_PAGE);
        }
        
        setPage((p) => p + 1);
    };

    const prevPage = () => {
        if (canPrev) {
            setPage((p) => p - 1);
        }
    };

    const setFilter = (key: keyof UsePublicGroupsFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(0); // Reiniciar paginación al cambiar filtro
    };

    return {
        groups: visibleGroups,
        isLoading: status === "LoadingFirstPage",
        isLoadingMore: status === "LoadingMore",
        page,
        nextPage,
        prevPage,
        canNext,
        canPrev,
        setFilter,
        filters,
        totalLoaded: groups.length
    };
}
