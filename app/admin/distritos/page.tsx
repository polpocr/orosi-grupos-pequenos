"use client";

import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DistrictTable } from "@/app/components/admin/districts/district-table";
import { DistrictDialog } from "@/app/components/admin/districts/district-dialog";
import { useState } from "react";

export default function DistritosPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Distritos" 
        subtitle="Gestiona los distritos geográficos del sistema."
        actionButton={
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 border-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nuevo Distrito
          </Button>
        }
      />

      <DistrictTable />

      <DistrictDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
