"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { SeasonDialog } from "./season-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function SeasonTable() {
  const seasons = useQuery(api.seasons.get);
  const remove = useMutation(api.seasons.remove);
  const update = useMutation(api.seasons.update);

  const [editingSeason, setEditingSeason] = useState<{
    _id: Id<"seasons">;
    name: string;
    isActive: boolean;
    registrationStart: string;
    registrationEnd: string;
    groupStart: string;
    groupEnd: string;
  } | null>(null);

  const [seasonToDelete, setSeasonToDelete] = useState<Id<"seasons"> | null>(null);

  if (seasons === undefined) {
    return <TableSkeleton />;
  }

  const handleDelete = async () => {
    if (seasonToDelete) {
      try {
        await remove({ id: seasonToDelete });
        toast.success("Temporada eliminada correctamente");
      } catch (error) {
        console.error("Error deleting season:", error);
        toast.error("Error al eliminar la temporada");
      }
      setSeasonToDelete(null);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    return `${format(new Date(start), "dd/MM/yyyy")} - ${format(new Date(end), "dd/MM/yyyy")}`;
  };

  return (
    <>
      {/* Vista Móvil - Cards */}
      <div className="lg:hidden space-y-3">
        {seasons.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-zinc-500 py-8 px-4 bg-white dark:bg-dark rounded-lg border border-slate-200 dark:border-zinc-800">
            No hay temporadas registradas.
          </div>
        ) : (
          seasons.map((season) => (
            <div
              key={season._id}
              className="bg-white dark:bg-dark border border-slate-200 dark:border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 dark:text-white text-lg">
                    {season.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Estado:</span>
                    <Switch
                      checked={season.isActive}
                      onCheckedChange={async (processed) => {
                        try {
                          await update({
                            id: season._id,
                            name: season.name,
                            isActive: processed,
                            registrationStart: season.registrationStart,
                            registrationEnd: season.registrationEnd,
                            groupStart: season.groupStart,
                            groupEnd: season.groupEnd,
                          });
                          toast.success("Estado actualizado");
                        } catch (error) {
                          console.error(error);
                          toast.error("Error al actualizar estado");
                        }
                      }}
                      className="data-[state=checked]:bg-blue-600 cursor-pointer scale-90"
                    />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-dark border-slate-200 dark:border-zinc-800">
                    <DropdownMenuItem
                      onClick={() => setEditingSeason(season)}
                      className="cursor-pointer focus:bg-slate-100 dark:focus:bg-zinc-800"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSeasonToDelete(season._id)}
                      className="text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Inscripción:</span>
                  <span className="text-slate-700 dark:text-zinc-300">
                    {format(new Date(season.registrationStart), "dd/MM/yy")} - {format(new Date(season.registrationEnd), "dd/MM/yy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Grupos:</span>
                  <span className="text-slate-700 dark:text-zinc-300">
                    {format(new Date(season.groupStart), "dd/MM/yy")} - {format(new Date(season.groupEnd), "dd/MM/yy")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="hidden lg:block rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-dark overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
            <TableRow className="border-slate-200 dark:border-zinc-800 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50">
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Nombre</TableHead>
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Estado</TableHead>
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Inscripción</TableHead>
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Grupos</TableHead>
              <TableHead className="text-right text-slate-500 dark:text-zinc-400 px-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 dark:text-zinc-500 py-8 px-8">
                  No hay temporadas registradas.
                </TableCell>
              </TableRow>
            ) : (
              seasons.map((season) => (
                <TableRow key={season._id} className="border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                  <TableCell className="font-medium text-slate-900 dark:text-white px-8">
                    {season.name}
                  </TableCell>
                  <TableCell className="px-8">
                    <Switch
                      checked={season.isActive}
                      onCheckedChange={async (processed) => {
                        try {
                          await update({
                            id: season._id,
                            name: season.name,
                            isActive: processed,
                            registrationStart: season.registrationStart,
                            registrationEnd: season.registrationEnd,
                            groupStart: season.groupStart,
                            groupEnd: season.groupEnd,
                          });
                          toast.success("Estado actualizado");
                        } catch (error) {
                          console.error(error);
                          toast.error("Error al actualizar estado");
                        }
                      }}
                      className="data-[state=checked]:bg-blue-600 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 px-8 text-sm">
                    {formatDateRange(season.registrationStart, season.registrationEnd)}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 px-8 text-sm">
                    {formatDateRange(season.groupStart, season.groupEnd)}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-dark border-slate-200 dark:border-zinc-800">
                        <DropdownMenuItem
                          onClick={() => setEditingSeason(season)}
                          className="cursor-pointer focus:bg-slate-100 dark:focus:bg-zinc-800"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSeasonToDelete(season._id)}
                          className="text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingSeason && (
        <SeasonDialog
          isOpen={true}
          onClose={() => setEditingSeason(null)}
          seasonToEdit={editingSeason}
        />
      )}

      <AlertDialog open={!!seasonToDelete} onOpenChange={(open) => !open && setSeasonToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-dark border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-zinc-400">
              Esta acción no se puede deshacer. Esto eliminará permanentemente la temporada "{seasons.find(s => s._id === seasonToDelete)?.name}".
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
