"use client";

import { GroupsToolbarProps } from "@/app/types/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function GroupsToolbar({
  onSearch,
  onDistritoChange,
  onCategoriaChange,
}: GroupsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-dark border-b border-[#3A3939]">
      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar grupos..."
          className="pl-10 bg-[#2A2929] border-[#3A3939] text-white placeholder:text-slate-500 focus:border-blue-600"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          className="flex-1 px-4 py-2 bg-[#2A2929] border border-[#3A3939] rounded-md text-white text-sm focus:outline-none focus:border-blue-600"
          onChange={(e) => onDistritoChange?.(e.target.value)}
        >
          <option value="">Todos los Distritos</option>
          <option value="norte">Norte</option>
          <option value="sur">Sur</option>
          <option value="este">Este</option>
          <option value="oeste">Oeste</option>
        </select>

        <select
          className="flex-1 px-4 py-2 bg-[#2A2929] border border-[#3A3939] rounded-md text-white text-sm focus:outline-none focus:border-blue-600"
          onChange={(e) => onCategoriaChange?.(e.target.value)}
        >
          <option value="">Todas las Categorías</option>
          <option value="jovenes">Jóvenes</option>
          <option value="adultos">Adultos</option>
          <option value="matrimonios">Matrimonios</option>
          <option value="mujeres">Mujeres</option>
        </select>
      </div>
    </div>
  );
}
