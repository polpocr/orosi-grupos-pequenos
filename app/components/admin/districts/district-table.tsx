"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { DistrictDialog } from "./district-dialog";
import { Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export function DistrictTable() {
  const districts = useQuery(api.districts.get);
  const remove = useMutation(api.districts.remove);

  const [editingDistrict, setEditingDistrict] = useState<{ _id: Id<"districts">; name: string } | null>(null);
  const [districtToDelete, setDistrictToDelete] = useState<Id<"districts"> | null>(null);

  if (districts === undefined) {
    return <TableSkeleton />;
  }

  const handleDelete = async () => {
    if (districtToDelete) {
      try {
        await remove({ id: districtToDelete });
        toast.success("Distrito eliminado correctamente");
      } catch (error) {
        console.error("Error deleting district:", error);
        toast.error("Error al eliminar el distrito");
      }
      setDistrictToDelete(null);
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {districts.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-zinc-500 py-8">
            No hay distritos registrados.
          </div>
        ) : (
          districts.map((district) => (
            <div key={district._id} className="p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-dark shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-900 dark:text-white text-lg">
                  {district.name}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingDistrict(district)}
                  className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <Pencil className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDistrictToDelete(district._id)}
                  className="hover:bg-red-900/20 text-red-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-dark overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
            <TableRow className="border-slate-200 dark:border-zinc-800 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50">
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Nombre</TableHead>
              <TableHead className="text-right text-slate-500 dark:text-zinc-400 px-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-slate-500 dark:text-zinc-500 py-8 px-8">
                  No hay distritos registrados.
                </TableCell>
              </TableRow>
            ) : (
              districts.map((district) => (
                <TableRow key={district._id} className="border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                  <TableCell className="font-medium text-slate-900 dark:text-white px-8">
                    {district.name}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingDistrict(district)}
                        className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDistrictToDelete(district._id)}
                        className="hover:bg-red-900/20 text-red-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingDistrict && (
        <DistrictDialog
          isOpen={true}
          onClose={() => setEditingDistrict(null)}
          districtToEdit={editingDistrict}
        />
      )}

      <AlertDialog open={!!districtToDelete} onOpenChange={(open) => !open && setDistrictToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-dark border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-zinc-400">
              Esta acción no se puede deshacer. Esto eliminará permanentemente el distrito "{districts.find(d => d._id === districtToDelete)?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0 cursor-pointer">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
