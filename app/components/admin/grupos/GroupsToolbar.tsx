"use client";

import { GroupsToolbarProps } from "@/app/types/admin";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";

interface ExtendedGroupsToolbarProps extends GroupsToolbarProps {
  districts?: Doc<"districts">[];
  categories?: Doc<"categories">[];
}

export default function GroupsToolbar({
  onSearch,
  onDistritoChange,
  onCategoriaChange,
  districts = [],
  categories = [],
}: ExtendedGroupsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800">
      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          className="pl-10 bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus-visible:ring-blue-600"
          placeholder="Buscar grupos..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Select onValueChange={(val) => onDistritoChange?.(val === "all" ? "all" : val)}>
            <SelectTrigger className="flex-1 bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 cursor-pointer">
                <SelectValue placeholder="Todos los Distritos" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all" className="cursor-pointer">Todos los Distritos</SelectItem>
                {districts.map((d) => (
                    <SelectItem key={d._id} value={d._id} className="cursor-pointer">
                        {d.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Select onValueChange={(val) => onCategoriaChange?.(val === "all" ? "all" : val)}>
            <SelectTrigger className="flex-1 bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 cursor-pointer">
                <SelectValue placeholder="Todas las Categorías" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all" className="cursor-pointer">Todas las Categorías</SelectItem>
                {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id} className="cursor-pointer">
                        {c.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}
