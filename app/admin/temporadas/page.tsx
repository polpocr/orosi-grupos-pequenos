"use client";

import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";
import DataTableWrapper from "@/app/components/admin/shared/DataTableWrapper";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MoreHorizontal } from "lucide-react";
import { Temporada } from "@/app/types/admin";

// Mock data
const temporadas: Temporada[] = [
  {
    id: "1",
    nombre: "Temporada Primavera 2026",
    fechaInicio: "2026-03-01",
    fechaFin: "2026-05-31",
    estado: "activa",
    totalGrupos: 42,
  },
  {
    id: "2",
    nombre: "Temporada Verano 2025",
    fechaInicio: "2025-06-01",
    fechaFin: "2025-08-31",
    estado: "finalizada",
    totalGrupos: 38,
  },
  {
    id: "3",
    nombre: "Temporada Otoño 2025",
    fechaInicio: "2025-09-01",
    fechaFin: "2025-11-30",
    estado: "finalizada",
    totalGrupos: 35,
  },
];

export default function TemporadasPage() {
  const getEstadoBadge = (estado: Temporada['estado']) => {
    const styles: Record<string, string> = {
      activa: "bg-green-900/30 text-green-400 border-green-900/50",
      inactiva: "bg-slate-700/30 text-slate-400 border-slate-700/50",
      finalizada: "bg-blue-900/30 text-blue-400 border-blue-900/50",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Temporadas"
        subtitle="Gestiona las temporadas de grupos pequeños"
        actionButton={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Temporada
          </Button>
        }
      />

      <DataTableWrapper>
        {/* Mobile View - Cards */}
        <div className="md:hidden divide-y divide-slate-200 dark:divide-neutral-800">
          {temporadas.map((temporada) => (
            <div key={temporada.id} className="p-4 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{temporada.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(temporada.fechaInicio).toLocaleDateString('es-ES')} - {new Date(temporada.fechaFin).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getEstadoBadge(temporada.estado)}
                  <span className="text-sm text-slate-400">
                    <span className="font-medium text-slate-900 dark:text-white">{temporada.totalGrupos}</span> grupos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Grupos
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
              {temporadas.map((temporada) => (
                <tr key={temporada.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-900/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {temporada.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(temporada.fechaInicio).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(temporada.fechaFin).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(temporada.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">
                    {temporada.totalGrupos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800"
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
