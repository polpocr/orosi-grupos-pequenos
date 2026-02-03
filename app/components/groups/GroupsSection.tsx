"use client";

import GroupDetailModal from "@/app/components/public/GroupDetailModal";
import { SearchIcon } from "@/app/components/ui/Icons";
import { usePublicGroups } from "@/app/hooks/usePublicGroups";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FilterSidebar } from "./filters/FilterSidebar";
import { GroupsCategoryToolbar } from "./GroupsCategoryToolbar";
import { GroupsGridList } from "./GroupsGridList";
import { Doc } from "@/convex/_generated/dataModel";

const GroupsSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dependencies = useQuery(api.groups.getFormDependencies);

    // Inicializar Hook
    const {
        groups,
        isLoading,
        isLoadingMore,
        page,
        nextPage,
        prevPage,
        canNext,
        canPrev,
        setFilter,
        filters
    } = usePublicGroups({
        search: searchParams.get("q") || "",
        category: searchParams.get("category") || "all",
        district: searchParams.get("district") || ""
    });

    // Estado local para UI
    const [selectedGroup, setSelectedGroup] = useState<Doc<"groups"> | null>(null);
    const [showFilters, setShowFilters] = useState(searchParams.get("showFilters") === "true");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Sincronizar filtros a URL (Unidireccional para mantener bookmarks)
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.search) params.set("q", filters.search);
        else params.delete("q");

        if (filters.category && filters.category !== "all") params.set("category", filters.category);
        else params.delete("category");

        if (filters.district) params.set("district", filters.district);
        else params.delete("district");

        if (showFilters) params.set("showFilters", "true");
        else params.delete("showFilters");

        const newSearch = params.toString();
        if (newSearch !== searchParams.toString()) {
            router.replace(`?${newSearch}`, { scroll: false });
        }
    }, [filters, showFilters, router, searchParams]);

    // Adaptador para FilterSidebar (espera objeto complejo)
    // Solo soportamos categoría y distrito vía backend
    const sidebarFilters = useMemo(() => ({
        category: filters.category,
        location: filters.district,
        // Placeholders para filtros no soportados en esta versión
        modality: "",
        day: "",
        schedule: "",
        ageRange: [18, 99] as [number, number],
        target: "",
        mode: ""
    }), [filters]);

    const handleSidebarChange = (newFilters: any) => {
        // Mapear cambios del sidebar al hook
        if (newFilters.category !== filters.category) setFilter("category", newFilters.category);
        if (newFilters.location !== filters.district) setFilter("district", newFilters.location);
        // Otros filtros ignorados según requerimiento de Backend Filtering
    };

    // Calcular opciones visuales para Sidebar
    const derivedOptions = useMemo(() => {
        return { modalities: [], days: [], schedules: [], targets: [] };
    }, []);

    return (
        <section className="bg-blue-secondary text-white font-outfit">
            <div className="max-w-[1920px] mx-auto px-6 py-16 md:px-16 lg:px-32 font-light">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-xl mb-6 md:text-4xl md:mb-10">Grupos Conexión</h1>
                    <h2 className="text-xl mb-1 md:text-4xl md:mb-2">
                        Temporada de Grupos
                    </h2>
                    <p className="text-xl md:text-4xl opacity-90">
                        {dependencies?.seasons.find(s => s.isActive)?.name || "Próximamente"}
                    </p>
                </div>

                {/* Barra de Búsqueda */}
                <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-3 sm:px-0">
                    <div className="w-full h-10 sm:h-12 bg-black rounded-full flex items-center px-4 sm:px-6 shadow-lg relative z-10">
                        <div className="shrink-0 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-white" />
                        </div>
                        <input
                            type="text"
                            placeholder="Busco..."
                            value={filters.search}
                            onChange={(e) => setFilter("search", e.target.value)}
                            className="flex-1 ml-3 sm:ml-4 bg-transparent text-white text-base sm:text-lg placeholder-neutral-700 placeholder:font-medium border-b border-b-gray-400 focus:outline-none focus:border-white transition-colors leading-tight"
                        />
                    </div>
                </div>

                <div className="w-fit mx-auto flex flex-col">
                    <GroupsCategoryToolbar
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        setShowMobileFilters={setShowMobileFilters}
                        currentCategory={filters.category}
                        onSelectCategory={(cat) => setFilter("category", cat)}
                        categories={dependencies?.categories}
                    />

                    {/* Grid de Contenido Principal */}
                    <div className={`grid gap-8 ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
                        {/* Sidebar Escritorio */}
                        {showFilters && (
                            <div className="hidden lg:block lg:col-span-1">
                                <FilterSidebar
                                    filters={sidebarFilters}
                                    setFilters={handleSidebarChange}
                                    dependencies={dependencies}
                                    options={derivedOptions}
                                    isMobile={false}
                                />
                            </div>
                        )}

                        {/* Grid de Grupos */}
                        <div className={showFilters ? "lg:col-span-3" : "col-span-1"}>
                            <GroupsGridList
                                isLoading={isLoading}
                                isLoadingMore={isLoadingMore}
                                groups={groups}
                                categories={dependencies?.categories}
                                page={page}
                                canNext={canNext}
                                nextPage={nextPage}
                                prevPage={prevPage}
                                onViewDetails={setSelectedGroup}
                                onClearFilters={() => {
                                    setFilter("search", "");
                                    setFilter("category", "all");
                                    setFilter("district", "");
                                }}
                                showFilters={showFilters}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <GroupDetailModal
                group={selectedGroup}
                isOpen={!!selectedGroup}
                onClose={() => setSelectedGroup(null)}
                category={dependencies?.categories.find((c) => c._id === selectedGroup?.categoryId)}
            />

            {/* Modal de Filtros Móvil */}
            <Dialog open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <DialogContent className="h-screen max-h-screen w-screen max-w-none m-0 p-0 rounded-none bg-blue-secondary text-white border-none">
                    <DialogHeader className="p-6 pb-4 border-b border-white/20">
                        <DialogTitle className="text-2xl font-outfit text-white">Filtros</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6">
                        <FilterSidebar
                            filters={sidebarFilters}
                            setFilters={handleSidebarChange}
                            dependencies={dependencies}
                            options={derivedOptions}
                            isMobile={true}
                            onApply={() => setShowMobileFilters(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default GroupsSection;
