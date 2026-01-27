"use client";

import { FilterSection } from "./FilterSection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterListProps {
  title: string;
  selected: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  emptyMessage?: string;
  className?: string; // For scrollable areas like Location
}

export const FilterList = ({ 
    title, 
    selected, 
    onChange, 
    options, 
    emptyMessage = "No hay opciones disponibles",
    className = ""
}: FilterListProps) => {
  return (
    <FilterSection title={title}>
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {options.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox 
                    id={`${title}-${opt.value}`} 
                    checked={selected === opt.value} 
                    onCheckedChange={() => onChange(selected === opt.value ? "" : opt.value)}
                    className="border-slate-500 data-[state=checked]:bg-blue-secondary data-[state=checked]:border-blue-secondary h-4 w-4 rounded-full"
                />
                 <Label htmlFor={`${title}-${opt.value}`} className="text-slate-300 font-medium cursor-pointer text-sm hover:text-white transition-colors capitalize">
                    {opt.label}
                 </Label>
            </div>
        ))}
         {options.length === 0 && (
            <p className="text-sm text-slate-500 italic">{emptyMessage}</p>
        )}
      </div>
    </FilterSection>
  );
};
