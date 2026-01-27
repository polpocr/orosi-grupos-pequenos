"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const FilterSection = ({ title, children, defaultOpen = false }: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2 py-1.5 border-b border-white/20 last:border-0 first:border-t">
            <CollapsibleTrigger className="flex items-center justify-between w-full group cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-white font-bold text-base">{title}</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2 pl-1">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}
