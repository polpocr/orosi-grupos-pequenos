"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";
import DataTableWrapper from "@/app/components/admin/shared/DataTableWrapper";
import GroupsToolbar from "@/app/components/admin/grupos/GroupsToolbar";
import { Button } from "@/components/ui/button";
import { Plus, Users, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Doc, Id } from "@/convex/_generated/dataModel";

export default function GruposPage() {
  const groups = useQuery(api.groups.list);
  const dependencies = useQuery(api.groups.getFormDependencies);
  const removeGroup = useMutation(api.groups.remove);

  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleDelete = async (id: Id<"groups">, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el grupo "${name}"?`)) {
      try {
        await removeGroup({ id });
        toast.success("Grupo eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar");
      }
    }
  };

  const getCategoryName = (id: Id<"categories">) => {
    return dependencies?.categories.find((c) => c._id === id)?.name || "---";
  };

  const getDistrictName = (id: Id<"districts">) => {
    return dependencies?.districts.find((d) => d._id === id)?.name || "---";
  };

  /* Helper para renderizar el badge de categoría con colores dinámicos */
  const getCategoryBadge = (categoryId: Id<"categories">) => {
    const category = dependencies?.categories.find((c) => c._id === categoryId);
    if (!category) return <span className="text-muted-foreground text-sm">---</span>;
    
    const colorClass = category.color || "bg-slate-500";
    
    return (
      <span 
        className={`px-3 py-1 rounded-full text-xs font-normal text-white shadow-sm transition-colors ${colorClass}`}
      >
        {category.name}
      </span>
    );
  };

  const getEstadoBadge = (seasonId: Id<"seasons">) => {
    const season = dependencies?.seasons.find(s => s._id === seasonId);
    if (season?.isActive) {
         return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                Activo
            </span>
        );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        Inactivo
      </span>
    );
  };

  if (groups === undefined || dependencies === undefined) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  // Lógica de filtrado
  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                          g.leaders.some(l => l.toLowerCase().includes(search.toLowerCase()));
    const matchesDistrict = districtFilter === "all" || g.districtId === districtFilter;
    const matchesCategory = categoryFilter === "all" || g.categoryId === categoryFilter;
    return matchesSearch && matchesDistrict && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Grupos"
        subtitle="Gestiona los grupos pequeños de la iglesia"
        actionButton={
            <GroupsToolbar 
                onSearch={setSearch} 
                onDistritoChange={setDistrictFilter} 
                onCategoriaChange={setCategoryFilter}
                districts={dependencies.districts}
                categories={dependencies.categories}
            >
                <Link href="/admin/grupos/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Grupo
                    </Button>
                </Link>
            </GroupsToolbar>
        }
      />

      <DataTableWrapper>
        {/* Vista Móvil - Tarjetas */}
        <div className="md:hidden divide-y divide-slate-200 dark:divide-neutral-800">
          {filteredGroups.map((grupo) => (
            <div key={grupo._id} className="p-4 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{grupo.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">Líderes: {grupo.leaders.join(", ")}</p>
                  </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-border-light"
                        >
                        <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <Link href={`/admin/grupos/${grupo._id}/edit`}>
                             <DropdownMenuItem className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                             </DropdownMenuItem>
                         </Link>
                         <Link href={`/admin/grupos/${grupo._id}/members`}>
                             <DropdownMenuItem className="cursor-pointer">
                                <Users className="mr-2 h-4 w-4" /> Ver Participantes
                             </DropdownMenuItem>
                         </Link>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem 
                            className="text-red-500 hover:text-red-600 hover:bg-red-100/10 cursor-pointer"
                            onClick={() => handleDelete(grupo._id, grupo.name)}
                         >
                            <Trash className="mr-2 h-4 w-4" /> Eliminar
                         </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {getCategoryBadge(grupo.categoryId)}
                {getEstadoBadge(grupo.seasonId)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{getDistrictName(grupo.districtId)}</span>
                <span className="text-slate-400">
                  <span className="font-medium text-slate-900 dark:text-white">{grupo.currentMembersCount} / {grupo.capacity}</span> miembros
                </span>
              </div>
            </div>
          ))}
          {filteredGroups.length === 0 && (
             <div className="p-8 text-center text-muted-foreground">No se encontraron grupos.</div>
          )}
        </div>

        {/* Vista Escritorio - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Facilitador(es)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Distrito
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Miembros
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
              {filteredGroups.map((grupo) => (
                <tr key={grupo._id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-900/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {grupo.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {grupo.leaders.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {getDistrictName(grupo.districtId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCategoryBadge(grupo.categoryId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">
                    {grupo.currentMembersCount} <span className="text-muted-foreground text-xs">/ {grupo.capacity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(grupo.seasonId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800"
                            >
                            <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/admin/grupos/${grupo._id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/grupos/${grupo._id}/members`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Users className="mr-2 h-4 w-4" /> Ver Participantes
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-500 hover:text-red-600 hover:bg-red-100/10 cursor-pointer"
                                onClick={() => handleDelete(grupo._id, grupo.name)}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGroups.length === 0 && (
             <div className="p-8 text-center text-muted-foreground">No se encontraron grupos.</div>
          )}
        </div>
      </DataTableWrapper>
    </div>
  );
}
