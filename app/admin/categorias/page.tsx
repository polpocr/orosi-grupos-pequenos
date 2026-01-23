"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTable } from "@/app/components/admin/categories/category-table";
import { CategoryDialog } from "@/app/components/admin/categories/category-dialog";
import { useState } from "react";
import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";

export default function CategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Categorías" 
        subtitle="Gestiona las categorías de los grupos pequeños del sistema."
        actionButton={
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 border-0"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
        }
      />

      <CategoryTable />

      <CategoryDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
