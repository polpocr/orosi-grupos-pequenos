"use client";

import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";
import DataTableWrapper from "@/app/components/admin/shared/DataTableWrapper";
import GroupsToolbar from "@/app/components/admin/grupos/GroupsToolbar";
import { Button } from "@/components/ui/button";
import { Plus, Users, MoreHorizontal } from "lucide-react";
import { Grupo } from "@/app/types/admin";

// Mock data
const grupos: Grupo[] = [
  {
    id: "1",
    nombre: "Grupo Jóvenes Fuego",
    lider: "Carlos Méndez",
    distrito: "Norte",
    categoria: "Jóvenes",
    miembros: 15,
    estado: "activo",
  },
  {
    id: "2",
    nombre: "Matrimonios en Victoria",
    lider: "Ana y Pedro Rodríguez",
    distrito: "Sur",
    categoria: "Matrimonios",
    miembros: 12,
    estado: "activo",
  },
  {
    id: "3",
    nombre: "Mujeres de Fe",
    lider: "María González",
    distrito: "Este",
    categoria: "Mujeres",
    miembros: 18,
    estado: "activo",
  },
  {
    id: "4",
    nombre: "Adultos en Crecimiento",
    lider: "José Ramírez",
    distrito: "Oeste",
    categoria: "Adultos",
    miembros: 20,
    estado: "activo",
  },
];

export default function GruposPage() {
  const getEstadoBadge = (estado: Grupo['estado']) => {
    return estado === 'activo' ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
        Activo
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-700/50">
        Inactivo
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Grupos"
        subtitle="Gestiona los grupos pequeños de la iglesia"
        actionButton={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Grupo
          </Button>
        }
      />

      <DataTableWrapper toolbar={<GroupsToolbar />}>
        {/* Mobile View - Cards */}
        <div className="md:hidden divide-y divide-[#3A3939]">
          {grupos.map((grupo) => (
            <div key={grupo.id} className="p-4 hover:bg-dark transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{grupo.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-1">Líder: {grupo.lider}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-[#3A3939]"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-900/50">
                  {grupo.categoria}
                </span>
                {getEstadoBadge(grupo.estado)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{grupo.distrito}</span>
                <span className="text-slate-400">
                  <span className="font-medium text-white">{grupo.miembros}</span> miembros
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark border-b border-[#3A3939]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Líder
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Distrito
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Miembros
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3939]">
              {grupos.map((grupo) => (
                <tr key={grupo.id} className="hover:bg-dark transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-900/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {grupo.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {grupo.lider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {grupo.distrito}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-900/50">
                      {grupo.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {grupo.miembros}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(grupo.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-slate-400 hover:text-white hover:bg-[#3A3939]"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataTableWrapper>
    </div>
  );
}
