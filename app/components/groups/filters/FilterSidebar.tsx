"use client";

import { useState, useEffect } from "react";

import { FilterCategory } from "./FilterCategory";
import { FilterAge } from "./FilterAge";
import { FilterList } from "./FilterList";
import { Button } from "@/components/ui/button";

export interface FilterState {
    category: string;
    modality: string;
    location: string;
    day: string;
    schedule: string;
    ageRange: [number, number];
    target: string;
    mode: string;
}

interface Category {
    _id: string;
    name: string;
}

interface District {
    _id: string;
    name: string;
}

interface Dependencies {
    categories: Category[];
    districts: District[];
}

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    dependencies: Dependencies | undefined;
    options: {
        modalities: string[];
        days: string[];
        schedules: string[];
        targets: string[];
    };
    className?: string;
    onApply?: () => void;
    isMobile?: boolean; // Nuevo prop para saber si es móvil
}

import {
    DAYS_OF_WEEK,
    modeOptions,
    mapSimpleOptions,
    mapScheduleOptions,
    mapDistrictOptions,
    mapModalityOptions
} from "@/app/helpers/filters";

export const FilterSidebar = ({ filters, setFilters, dependencies, options, className, onApply, isMobile = false }: FilterSidebarProps) => {
    // Estado local para manejar la lógica de "Aplicar" en móvil
    const [draftFilters, setDraftFilters] = useState<FilterState>(filters);

    // Sincronizar draft cuando los filtros externos cambian (por ejemplo, al limpiar filtros desde el padre)
    useEffect(() => {
        setDraftFilters(filters);
    }, [filters]);

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        const newFilters = { ...draftFilters, [key]: value };
        setDraftFilters(newFilters);

        // Si es desktop, aplicamos inmediatamente
        if (!isMobile) {
            setFilters(newFilters);
        }
    };

    const handleApply = () => {
        setFilters(draftFilters);
        if (onApply) onApply();
    }

    return (
        <div className={`bg-transparent p-0 h-fit ${!isMobile ? 'sticky top-24' : ''} ${className} ${!isMobile ? 'border-r-2 border-white/60 pr-6' : ''}`}>
            <div className="space-y-2 divide-y divide-white/20">
                <FilterCategory
                    selected={draftFilters.category}
                    onChange={(val) => updateFilter('category', val)}
                    categories={dependencies?.categories || []}
                />

                <FilterList
                    title="Modalidad"
                    selected={draftFilters.modality}
                    onChange={(val) => updateFilter('modality', val)}
                    options={mapModalityOptions(options.modalities)}
                    emptyMessage="No hay modalidades disponibles"
                />

                <FilterList
                    title="Ubicación"
                    selected={draftFilters.location}
                    onChange={(val) => updateFilter('location', val)}
                    options={mapDistrictOptions(dependencies?.districts || [])}
                    className="max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                    emptyMessage="No hay ubicaciones disponibles"
                />

                <FilterList
                    title="Día"
                    selected={draftFilters.day}
                    onChange={(val) => updateFilter('day', val)}
                    options={mapSimpleOptions(options.days)}
                    emptyMessage="No hay días disponibles"
                />

                <FilterList
                    title="Horario"
                    selected={draftFilters.schedule}
                    onChange={(val) => updateFilter('schedule', val)}
                    options={mapScheduleOptions(options.schedules)}
                    emptyMessage="No hay horarios disponibles"
                />

                <FilterAge
                    range={draftFilters.ageRange}
                    onChange={(val) => updateFilter('ageRange', val)}
                />

                <FilterList
                    title="Dirigido a"
                    selected={draftFilters.target}
                    onChange={(val) => updateFilter('target', val)}
                    options={mapSimpleOptions(options.targets)}
                    emptyMessage="No hay opciones disponibles"
                />

                <FilterList
                    title="Modo"
                    selected={draftFilters.mode}
                    onChange={(val) => updateFilter('mode', val)}
                    options={modeOptions}
                />

                {/* Botón Aplicar solo visible en móvil */}
                {isMobile && (
                    <div className="pt-6">
                        <Button
                            className="w-full bg-[#0F3045] text-white rounded-full py-6 font-medium text-lg hover:bg-[#16415e] transition-all border border-slate-700/50 shadow-lg cursor-pointer"
                            onClick={handleApply}
                        >
                            Aplicar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
