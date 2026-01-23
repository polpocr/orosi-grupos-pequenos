"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryTable } from "@/app/components/admin/categories/category-table";
import { CategoryDialog } from "@/app/components/admin/categories/category-dialog";
import { useState } from "react";

export default function CategoriesTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <CategoryTable />

      <CategoryDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}

