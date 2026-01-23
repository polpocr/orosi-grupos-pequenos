"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Tag } from "lucide-react";
import { Categoria } from "@/app/types/admin";

// Mock data
const categorias: Categoria[] = [
  { id: "1", nombre: "Bíblico", descripcion: "Grupos para ...", color: "#3B82F6", activa: true },
  { id: "2", nombre: "Interés", descripcion: "Grupos para ...", color: "#10B981", activa: true },
  { id: "3", nombre: "Apoyo", descripcion: "Grupos para ...", color: "#F59E0B", activa: true },
  { id: "4", nombre: "Acción social", descripcion: "Grupos exclusivos ....", color: "#EC4899", activa: true },
];

export default function CategoriesTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Categorías de Grupos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
          <div key={categoria.id} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${categoria.color}20` }}
                >
                  <Tag className="w-5 h-5" style={{ color: categoria.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">{categoria.nombre}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{categoria.descripcion}</p>
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
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-slate-200 dark:border-neutral-800"
                  style={{ backgroundColor: categoria.color }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{categoria.color}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                Activa
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Color
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
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${categoria.color}20` }}
                    >
                      <Tag className="w-5 h-5" style={{ color: categoria.color }} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {categoria.nombre}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {categoria.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-slate-200 dark:border-neutral-800"
                      style={{ backgroundColor: categoria.color }}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{categoria.color}</span>
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
    </div>
  );
}
