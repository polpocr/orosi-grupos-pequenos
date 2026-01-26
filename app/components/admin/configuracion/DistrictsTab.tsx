"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DistrictTable } from "@/app/components/admin/districts/district-table";
import { DistrictDialog } from "@/app/components/admin/districts/district-dialog";
import { useState } from "react";

export default function DistrictsTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Distritos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona las zonas geográficas para organizar los grupos
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Distrito
        </Button>
      </div>

      <DistrictTable />

      <DistrictDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}

