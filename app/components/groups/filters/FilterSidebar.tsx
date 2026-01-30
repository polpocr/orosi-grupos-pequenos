"use client";

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
    mapDistrictOptions
} from "@/app/helpers/filters";

export const FilterSidebar = ({ filters, setFilters, dependencies, options, className, onApply, isMobile = false }: FilterSidebarProps) => {
    // Para desktop: actualiza directamente
    // Para móvil: usa estado local
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters({ ...filters, [key]: value });
    }

    const handleApply = () => {
        if (onApply) onApply();
    }

    return (
        <div className={`bg-transparent p-0 h-fit ${!isMobile ? 'sticky top-24' : ''} ${className} ${!isMobile ? 'border-r-2 border-white/60 pr-6' : ''}`}>
            <div className="space-y-2 divide-y divide-white/20">
                <FilterCategory
                    selected={filters.category}
                    onChange={(val) => updateFilter('category', val)}
                    categories={dependencies?.categories || []}
                />

                <FilterList
                    title="Modalidad"
                    selected={filters.modality}
                    onChange={(val) => updateFilter('modality', val)}
                    options={mapSimpleOptions(options.modalities)}
                />

                <FilterList
                    title="Ubicación"
                    selected={filters.location}
                    onChange={(val) => updateFilter('location', val)}
                    options={mapDistrictOptions(dependencies?.districts || [])}
                    className="max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                    emptyMessage="No hay ubicaciones disponibles"
                />

                <FilterList
                    title="Día"
                    selected={filters.day}
                    onChange={(val) => updateFilter('day', val)}
                    options={mapSimpleOptions(DAYS_OF_WEEK)}
                    emptyMessage="No hay días disponibles"
                />

                <FilterList
                    title="Horario"
                    selected={filters.schedule}
                    onChange={(val) => updateFilter('schedule', val)}
                    options={mapScheduleOptions(options.schedules)}
                    emptyMessage="No hay horarios disponibles"
                />

                <FilterAge
                    range={filters.ageRange}
                    onChange={(val) => updateFilter('ageRange', val)}
                />

                <FilterList
                    title="Dirigido a"
                    selected={filters.target}
                    onChange={(val) => updateFilter('target', val)}
                    options={mapSimpleOptions(options.targets)}
                    emptyMessage="No hay grupos disponibles"
                />

                <FilterList
                    title="Modo"
                    selected={filters.mode}
                    onChange={(val) => updateFilter('mode', val)}
                    options={modeOptions}
                />

                {/* Botón Aplicar solo visible en móvil */}
                {isMobile && (
                    <div className="pt-6">
                        <Button
                            className="w-full bg-[#0F3045] text-white rounded-full py-6 font-medium text-lg hover:bg-[#16415e] transition-all border border-slate-700/50 shadow-lg"
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
