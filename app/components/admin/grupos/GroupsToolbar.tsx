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
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800">
      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          className="pl-10 bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-blue-600"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-600"
          onChange={(e) => onDistritoChange?.(e.target.value)}
        >
          <option value="">Todos los Distritos</option>
          <option value="norte">Norte</option>
          <option value="sur">Sur</option>
          <option value="este">Este</option>
          <option value="oeste">Oeste</option>
        </select>

        <select
          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-600"
          onChange={(e) => onCategoriaChange?.(e.target.value)}
        >
          <option value="">Todas las Categorías</option>
          <option value="bíblico">Bíblico</option>
          <option value="Interes">Interes</option>
          <option value="matrimonios">Apoyo</option>
          <option value="accion-social">Accion social</option>
        </select>
      </div>
    </div>
  );
}
