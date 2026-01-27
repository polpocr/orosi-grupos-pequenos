"use client";

import { FilterCategory } from "./FilterCategory";
import { FilterAge } from "./FilterAge";
import { FilterList } from "./FilterList";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
}

import { 
    DAYS_OF_WEEK, 
    modeOptions, 
    mapSimpleOptions, 
    mapScheduleOptions, 
    mapDistrictOptions 
} from "@/app/helpers/filters";

export const FilterSidebar = ({ filters, setFilters, dependencies, options, className, onApply }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sincronizar local state si los filtros externos cambian 
  useEffect(() => {
      setLocalFilters(filters);
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
  }

  const handleApply = () => {
      setFilters(localFilters);
      if (onApply) onApply();
  }

  return (
    <div className={`bg-transparent p-0 h-fit sticky top-24 ${className} border-r-2 border-white/60 pr-6`}>
        <div className="space-y-2 divide-y divide-white/20">
            <FilterCategory 
                selected={localFilters.category} 
                onChange={(val) => updateFilter('category', val)}
                categories={dependencies?.categories || []}
            />
            
            <FilterList
                title="Modalidad"
                selected={localFilters.modality}
                onChange={(val) => updateFilter('modality', val)}
                options={mapSimpleOptions(options.modalities)}
            />

             <FilterList
                title="Ubicación"
                selected={localFilters.location}
                onChange={(val) => updateFilter('location', val)}
                options={mapDistrictOptions(dependencies?.districts || [])}
                className="max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                emptyMessage="No hay ubicaciones disponibles"
            />

            <FilterList
                title="Día"
                selected={localFilters.day}
                onChange={(val) => updateFilter('day', val)}
                options={mapSimpleOptions(DAYS_OF_WEEK)}
                emptyMessage="No hay días disponibles"
            />

            <FilterList
                title="Horario"
                selected={localFilters.schedule}
                onChange={(val) => updateFilter('schedule', val)}
                options={mapScheduleOptions(options.schedules)}
                emptyMessage="No hay horarios disponibles"
            />

            <FilterAge
                range={localFilters.ageRange}
                onChange={(val) => updateFilter('ageRange', val)}
            />

            <FilterList
                title="Dirigido a"
                selected={localFilters.target}
                onChange={(val) => updateFilter('target', val)}
                options={mapSimpleOptions(options.targets)}
                emptyMessage="No hay grupos disponibles"
            />

            <FilterList
                title="Modo"
                selected={localFilters.mode}
                onChange={(val) => updateFilter('mode', val)}
                options={modeOptions}
            />

            <div className="pt-6">
                <Button 
                    className="w-full bg-[#0F3045] text-white rounded-full py-6 font-medium text-lg hover:bg-[#16415e] transition-all border border-slate-700/50 shadow-lg"
                    onClick={handleApply}
                >
                    Aplicar
                </Button>
            </div>
        </div>
    </div>
  );
};
