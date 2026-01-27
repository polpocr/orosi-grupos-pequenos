"use client";

import { FilterSection } from "./FilterSection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Category {
  _id: string;
  name: string;
}

interface FilterCategoryProps {
  selected: string; // ID or "all"
  onChange: (value: string) => void;
  categories: Category[];
}

export const FilterCategory = ({ selected, onChange, categories }: FilterCategoryProps) => {
  return (
    <FilterSection title="Categoría de grupos">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center space-x-2">
            <Checkbox 
                id="cat-all" 
                checked={selected === 'all'} 
                onCheckedChange={() => onChange('all')}
                className="border-slate-500 data-[state=checked]:bg-blue-secondary data-[state=checked]:border-blue-secondary h-4 w-4 rounded-[4px]"
            />
            <Label htmlFor="cat-all" className="text-slate-300 font-medium cursor-pointer text-sm hover:text-white transition-colors">Todas</Label>
        </div>
        {categories.map((cat) => (
            <div key={cat._id} className="flex items-center space-x-2">
                <Checkbox 
                    id={`cat-${cat._id}`} 
                    checked={selected === cat._id} 
                    onCheckedChange={() => onChange(cat._id)}
                    className="border-slate-500 data-[state=checked]:bg-blue-secondary data-[state=checked]:border-blue-secondary h-4 w-4 rounded-[4px]"
                />
                <Label htmlFor={`cat-${cat._id}`} className="text-slate-300 font-medium cursor-pointer text-sm hover:text-white transition-colors capitalize">{cat.name.toLowerCase()}</Label>
            </div>
        ))}
      </div>
    </FilterSection>
  );
};
