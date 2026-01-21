"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Tag } from "lucide-react";
import { Categoria } from "@/app/types/admin";

// Mock data
const categorias: Categoria[] = [
  { id: "1", nombre: "Jóvenes", descripcion: "Grupos para jóvenes de 18-30 años", color: "#3B82F6", activa: true },
  { id: "2", nombre: "Adultos", descripcion: "Grupos para adultos de 30+ años", color: "#10B981", activa: true },
  { id: "3", nombre: "Matrimonios", descripcion: "Grupos para parejas casadas", color: "#F59E0B", activa: true },
  { id: "4", nombre: "Mujeres", descripcion: "Grupos exclusivos para mujeres", color: "#EC4899", activa: true },
];

export default function CategoriesTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Categorías de Grupos</h3>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona las categorías disponibles para los grupos pequeños
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-3">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="bg-[#2A2929] border border-[#3A3939] rounded-lg p-4 hover:bg-dark transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${categoria.color}20` }}
                >
                  <Tag className="w-5 h-5" style={{ color: categoria.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{categoria.nombre}</h4>
                  <p className="text-xs text-slate-400 mt-1">{categoria.descripcion}</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-[#3A3939]"
                  style={{ backgroundColor: categoria.color }}
                />
                <span className="text-xs text-slate-400">{categoria.color}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                Activa
              </span>
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
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Color
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
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-dark transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${categoria.color}20` }}
                    >
                      <Tag className="w-5 h-5" style={{ color: categoria.color }} />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {categoria.nombre}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {categoria.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-[#3A3939]"
                      style={{ backgroundColor: categoria.color }}
                    />
                    <span className="text-sm text-slate-400">{categoria.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                    Activa
                  </span>
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
