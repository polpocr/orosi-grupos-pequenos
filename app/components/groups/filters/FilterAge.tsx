"use client";

import { FilterSection } from "./FilterSection";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface FilterAgeProps {
  range: [number, number];
  onChange: (value: [number, number]) => void;
}

export const FilterAge = ({ range, onChange }: FilterAgeProps) => {
  return (
    <FilterSection title="Edad">
      <div className="px-2 pt-2 pb-2 space-y-2">
        <SliderPrimitive.Root
            className="relative flex w-full touch-none select-none items-center py-2"
            value={range}
            max={99}
            min={18}
            step={1}
            onValueChange={(val) => onChange(val as [number, number])}
        >
            <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden rounded-full bg-slate-600">
                <SliderPrimitive.Range className="absolute h-full bg-white" />
            </SliderPrimitive.Track>
            {range.map((_, i) => (
                <SliderPrimitive.Thumb
                    key={i}
                    className="block h-3.5 w-3.5 rounded-full border border-white bg-white ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm hover:scale-125 transition-transform"
                />
            ))}
        </SliderPrimitive.Root>
        <div className="flex justify-center mt-2">
            <div className="border border-white rounded-full px-4 py-0.5 text-white text-xs font-medium">
                {range[0]} | +{range[1]}
            </div>
        </div>
      </div>
    </FilterSection>
  );
};
