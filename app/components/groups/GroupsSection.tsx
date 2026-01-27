"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GroupCard from "./GroupCard";
import FilterButton from "../ui/FilterButton";
import { FilterSidebar } from "./filters/FilterSidebar";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sortDays, filterGroups, getGroupTime } from "@/app/helpers/filters";
import { CategoryIcon, SearchIcon } from "@/app/components/ui/Icons";

const GroupsSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const groups = useQuery(api.groups.list);
    const dependencies = useQuery(api.groups.getFormDependencies);

    // Console log solicitado: Ver respuesta de la api
    console.log("Respuesta de API (Grupos):", groups);

    // Estado local sincronizado con la URL (Persistencia Completa)
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [showFilters, setShowFilters] = useState(searchParams.get("showFilters") === "true");

    const [selectedFilters, setSelectedFilters] = useState({
        category: searchParams.get("category") || "all",
        modality: searchParams.get("modality") || "",
        location: searchParams.get("location") || "",
        day: searchParams.get("day") || "",
        schedule: searchParams.get("schedule") || "",
        ageRange: [
            Number(searchParams.get("minAge")) || 18,
            Number(searchParams.get("maxAge")) || 99
        ] as [number, number],
        target: searchParams.get("target") || "",
        mode: searchParams.get("mode") || ""
    });

    // Calcular opciones dinámicas basadas en los grupos existentes (antes de filtrar)
    const derivedOptions = useMemo(() => {
        if (!groups) return { modalities: [], days: [], schedules: [], targets: [] };

        const modalities = Array.from(new Set(groups.map(g => g.modality).filter(Boolean)));
        const schedules = Array.from(new Set(groups.map(g => getGroupTime(g.time))));
        const days = sortDays(Array.from(new Set(groups.map(g => g.day).filter(Boolean))));
        const targets = Array.from(new Set(groups.map(g => g.targetAudience).filter(Boolean) as string[]));

        return { modalities, days, schedules, targets };
    }, [groups]);

    // Efecto para actualizar la URL cuando cambian los filtros
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Helper para actualizar params
        const updateParam = (key: string, value: string) => {
            if (value && value !== "all") params.set(key, value);
            else params.delete(key);
        };

        updateParam("category", selectedFilters.category);
        updateParam("modality", selectedFilters.modality);
        updateParam("location", selectedFilters.location);
        updateParam("day", selectedFilters.day);
        updateParam("schedule", selectedFilters.schedule);
        updateParam("target", selectedFilters.target);
        updateParam("mode", selectedFilters.mode);
        updateParam("q", searchTerm);

        // Estado visual del panel
        if (showFilters) params.set("showFilters", "true");
        else params.delete("showFilters");

        // Casos especiales (Rangos o valores numéricos)
        if (selectedFilters.ageRange[0] !== 18) params.set("minAge", selectedFilters.ageRange[0].toString());
        else params.delete("minAge");

        if (selectedFilters.ageRange[1] !== 99) params.set("maxAge", selectedFilters.ageRange[1].toString());
        else params.delete("maxAge");

        const newSearchString = params.toString();
        const currentSearchString = searchParams.toString();

        if (newSearchString !== currentSearchString) {
            router.replace(`?${newSearchString}`, { scroll: false });
        }
    }, [selectedFilters, searchTerm, showFilters, router, searchParams]);


    // Lógica de filtrado
    const filteredGroups = filterGroups(groups, selectedFilters, searchTerm);

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 ml-3 sm:ml-4 bg-transparent text-white text-base sm:text-lg placeholder-neutral-700 placeholder:font-medium border-b border-b-gray-400 focus:outline-none focus:border-white transition-colors leading-tight"
                        />
                    </div>
                </div>
                <div className="w-fit mx-auto flex flex-col">
                    <div className={`relative flex flex-col md:flex-row items-center justify-center mb-12 min-h-[44px] ${!showFilters ? 'gap-20' : ''}`}>
                        {/* 1. Botón Filtro */}
                        <div className={`w-full md:w-auto flex justify-start ${showFilters ? 'md:absolute md:left-0 md:top-0 md:z-10' : ''}`}>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-2 border border-white/30 rounded-full text-sm font-medium transition-colors flex items-center gap-2 hover:cursor-pointer bg-black ${showFilters
                                    ? 'text-blue-secondary bg-white border-white'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                {showFilters ? (
                                    <>
                                        <span className="opacity-40 font-light">|</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span>Filtro</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Filtro</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* 2. Scroll Area para Categorías */}
                        <div className={`flex gap-3 overflow-x-auto no-scrollbar px-4 justify-start items-center transition-all duration-300 ${showFilters
                            ? 'w-full lg:pl-[280px] md:justify-center'
                            : 'w-full md:w-auto max-w-full md:px-0 md:justify-start'
                            }`}>
                            {/* "Todos" Button */}
                            <FilterButton
                                backgroundColor="bg-white"
                                hoverColor="bg-gray-100"
                                textColor="text-slate-900"
                                isActive={selectedFilters.category === "all"}
                                onClick={() => setSelectedFilters(prev => ({ ...prev, category: "all" }))}
                                className="whitespace-nowrap"
                            >
                                Todos
                            </FilterButton>

                            {/* Dynamic Category Buttons */}
                            {dependencies?.categories.map((category) => (
                                <FilterButton
                                    key={category._id}
                                    backgroundColor={category.color || "bg-gray-500"}
                                    hoverColor={category.color ? category.color.replace("bg-", "hover:bg-") : "hover:bg-gray-600"}
                                    textColor="text-white"
                                    isActive={selectedFilters.category === category._id}
                                    onClick={() => setSelectedFilters(prev => ({ ...prev, category: category._id }))}
                                    className="flex items-center gap-2 whitespace-nowrap"
                                >
                                    {/* Icon a la izquierda */}
                                    <CategoryIcon iconName={category.icon} />
                                    {/* Texto a la derecha */}
                                    <span>{category.name}</span>
                                </FilterButton>
                            ))}
                        </div>
                    </div>

                    {/* Filtros de la barra lateral */}
                    <div className={`grid gap-8 ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
                        {/* Barra lateral izquierda - Filtros */}
                        {showFilters && (
                            <div className="lg:col-span-1">
                                <FilterSidebar
                                    filters={selectedFilters}
                                    setFilters={setSelectedFilters}
                                    dependencies={dependencies}
                                    options={derivedOptions}
                                    onApply={() => {
                                        // Opcional: Cerrar filtros en móvil o scroll top
                                    }}
                                />
                            </div>
                        )}

                        {/* Contenido Derecho - Grid de Grupos */}
                        <div className={showFilters ? "lg:col-span-3" : "col-span-1"}>
                            {groups === undefined ? (
                                // Estado de Carga
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl"></div>
                                    ))}
                                </div>
                            ) : filteredGroups.length === 0 ? (
                                // Estado Vacío
                                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                                    <h3 className="text-2xl font-semibold mb-2">No se encontraron grupos</h3>
                                    <p className="text-lg opacity-60">
                                        Intenta ajustar tus filtros de búsqueda.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedFilters({
                                                category: "all",
                                                modality: "",
                                                location: "",
                                                day: "",
                                                schedule: "",
                                                ageRange: [18, 99],
                                                target: "",
                                                mode: ""
                                            });
                                        }}
                                        className="mt-6 px-6 py-2 bg-white text-blue-secondary rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            ) : (
                                // Grid de Grupos
                                <div className={`grid gap-9 ${showFilters ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                                    {filteredGroups.map(group => (
                                        <GroupCard
                                            key={group._id}
                                            group={group}
                                            category={dependencies?.categories.find(c => c._id === group.categoryId)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GroupsSection;
