"use client";

import GroupDetailModal from "@/app/components/public/GroupDetailModal";
import { SearchIcon } from "@/app/components/ui/Icons";
import { usePublicGroups } from "@/app/hooks/usePublicGroups";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SlidersHorizontal } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FilterSidebar } from "./filters/FilterSidebar";
import { GroupsCategoryToolbar } from "./GroupsCategoryToolbar";
import { GroupsGridList } from "./GroupsGridList";
import { Doc } from "@/convex/_generated/dataModel";
import { useGroupsFilterAdapter } from "@/app/hooks/useGroupsFilterAdapter";

const GroupsSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dependencies = useQuery(api.groups.getFormDependencies);

    // Inicializar Hook
    // Parsear rango de edad desde URL o usar default
    const ageParam = searchParams.get("ageRange");
    const initialAgeRange: [number, number] | undefined = ageParam
        ? (ageParam.split(",").map(Number) as [number, number])
        : undefined;

    // Inicializar Hook con todos los filtros desde URL
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
        filters,
        options // Opciones dinámicas
    } = usePublicGroups({
        search: searchParams.get("q") || "",
        category: searchParams.get("category") || "all",
        district: searchParams.get("district") || "",
        modality: searchParams.get("modality") || "",
        day: searchParams.get("day") || "",
        schedule: searchParams.get("schedule") || "",
        target: searchParams.get("target") || "",
        mode: searchParams.get("mode") || "",
        ageRange: initialAgeRange || [18, 99],
    });

    // Estado local para UI
    const [selectedGroup, setSelectedGroup] = useState<Doc<"groups"> | null>(null);
    const [showFilters, setShowFilters] = useState(searchParams.get("showFilters") === "true");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const groupsTopRef = useRef<HTMLDivElement>(null);

    // Scroll al inicio de la lista al cambiar de página
    useEffect(() => {
        if (groupsTopRef.current) {
            groupsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [page]);

    // Sincronizar filtros a URL (Unidireccional para mantener bookmarks)
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Búsqueda
        if (filters.search) params.set("q", filters.search);
        else params.delete("q");

        // Categoría
        if (filters.category && filters.category !== "all") params.set("category", filters.category);
        else params.delete("category");

        // Distrito (Ubicación)
        if (filters.district) params.set("district", filters.district);
        else params.delete("district");

        // Modalidad
        if (filters.modality) params.set("modality", filters.modality);
        else params.delete("modality");

        // Día
        if (filters.day) params.set("day", filters.day);
        else params.delete("day");

        // Horario
        if (filters.schedule) params.set("schedule", filters.schedule);
        else params.delete("schedule");

        // Público (Target)
        if (filters.target) params.set("target", filters.target);
        else params.delete("target");

        // Modo
        if (filters.mode) params.set("mode", filters.mode);
        else params.delete("mode");

        // Rango de Edad
        if (filters.ageRange && (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 99)) {
            params.set("ageRange", `${filters.ageRange[0]},${filters.ageRange[1]}`);
        } else {
            params.delete("ageRange");
        }

        // UI State
        if (showFilters) params.set("showFilters", "true");
        else params.delete("showFilters");

        const newSearch = params.toString();
        if (newSearch !== searchParams.toString()) {
            router.replace(`?${newSearch}`, { scroll: false });
        }
    }, [
        filters.search,
        filters.category,
        filters.district,
        filters.modality,
        filters.day,
        filters.schedule,
        filters.target,
        filters.mode,
        filters.ageRange,
        showFilters,
        router,
        searchParams
    ]);

    // Adaptador de filtros (Helper extraído para eliminar 'any' y limpiar código)
    const { sidebarFilters, handleSidebarChange } = useGroupsFilterAdapter({
        filters: filters as any, // Cast por compatibilidad de tipos estricta si es necesario
        setFilter: (key, value) => setFilter(key, value)
    });

    return (
        <section className="bg-blue-secondary text-white font-outfit">
            <div className={`max-w-[1920px] mx-auto px-6 py-16 md:px-16 ${showFilters ? 'lg:px-14' : 'lg:px-32'} font-light`}>
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-xl mb-6 md:text-6xl md:mb-10">Grupos Conexión</h1>
                    <h2 className="text-xl mb-1 md:text-4xl md:mb-2">
                        Temporada de Grupos
                    </h2>
                    <p className="text-xl md:text-4xl opacity-90">
                        {dependencies?.seasons.find(s => s.isActive)?.name || "Próximamente"}
                    </p>
                </div>

                {/* Barra de Búsqueda Desktop */}
                <div className="hidden md:block max-w-2xl mx-auto mb-12">
                    <div className="w-full h-12 bg-black rounded-full flex items-center px-6 shadow-lg relative z-10">
                        <div className="shrink-0 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-white" />
                        </div>
                        <input
                            type="text"
                            placeholder="Busco..."
                            value={filters.search}
                            onChange={(e) => setFilter("search", e.target.value)}
                            className="flex-1 ml-4 bg-transparent text-white text-lg placeholder-neutral-700 placeholder:font-medium border-b border-b-gray-400 focus:outline-none focus:border-white transition-colors leading-tight"
                        />
                    </div>
                </div>

                {/* Barra Móvil: Filtro + Búsqueda */}
                <div className="md:hidden flex gap-3 px-1 mb-2 w-full max-w-full overflow-hidden items-center justify-between">
                    {/* Botón Filtro Móvil */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="shrink-0 flex px-6 py-2 border border-white/30 rounded-full text-sm font-medium transition-colors items-center gap-2 hover:cursor-pointer bg-black text-white hover:bg-white/20"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filtro</span>
                    </button>

                    {/* Búsqueda Móvil */}
                    <div className="flex-1 min-w-0 h-[42px] bg-black rounded-full flex items-center px-4 shadow-lg relative z-10 transition-colors">
                        <div className="shrink-0 pointer-events-none">
                            <SearchIcon className="h-4 w-4 text-white" />
                        </div>
                        <input
                            type="text"
                            placeholder="Busco..."
                            value={filters.search}
                            onChange={(e) => setFilter("search", e.target.value)}
                            className="w-full min-w-0 ml-3 bg-transparent text-white text-sm placeholder-neutral-700 placeholder:font-medium border-b border-b-gray-400 focus:outline-none focus:border-white transition-colors leading-tight"
                        />
                    </div>
                </div>

                <div ref={groupsTopRef} className="w-full md:w-fit mx-auto flex flex-col scroll-mt-24">
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
                                    options={options}
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
                                    setFilter("modality", "");
                                    setFilter("day", "");
                                    setFilter("schedule", "");
                                    setFilter("target", "");
                                    setFilter("mode", "");
                                    setFilter("ageRange", [18, 99]);
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
                            options={options}
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
