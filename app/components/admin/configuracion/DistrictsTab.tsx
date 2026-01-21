"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, MapPin } from "lucide-react";
import { Distrito } from "@/app/types/admin";

// Mock data
const distritos: Distrito[] = [
  { id: "1", nombre: "Norte", descripcion: "Zona norte de la ciudad", activo: true },
  { id: "2", nombre: "Sur", descripcion: "Zona sur de la ciudad", activo: true },
  { id: "3", nombre: "Este", descripcion: "Zona este de la ciudad", activo: true },
  { id: "4", nombre: "Oeste", descripcion: "Zona oeste de la ciudad", activo: true },
  { id: "5", nombre: "Centro", descripcion: "Zona centro de la ciudad", activo: false },
];

export default function DistrictsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Distritos</h3>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona las zonas geográficas para organizar los grupos
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Distrito
        </Button>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-3">
        {distritos.map((distrito) => (
          <div key={distrito.id} className="bg-[#2A2929] border border-[#3A3939] rounded-lg p-4 hover:bg-dark transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{distrito.nombre}</h4>
                  <p className="text-xs text-slate-400 mt-1">{distrito.descripcion}</p>
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
            <div>
              {distrito.activo ? (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                  Activo
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-700/50">
                  Inactivo
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-[#2A2929] border border-[#3A3939] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark border-b border-[#3A3939]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Distrito
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Descripción
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
            {distritos.map((distrito) => (
              <tr key={distrito.id} className="hover:bg-dark transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-900/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {distrito.nombre}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {distrito.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {distrito.activo ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                      Activo
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-700/50">
                      Inactivo
                    </span>
                  )}
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
    </div>
  );
}
