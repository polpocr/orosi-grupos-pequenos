"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ICON_MAP } from "./shared";
import { useState } from "react";
import { CategoryDialog } from "./category-dialog";
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

import { TableSkeleton } from "@/components/ui/table-skeleton";

export function CategoryTable() {
  const categories = useQuery(api.categories.get);
  const toggleActive = useMutation(api.categories.toggleActive);
  const remove = useMutation(api.categories.remove);
  
  const [editingCategory, setEditingCategory] = useState<{ _id: Id<"categories">; name: string; color: string; icon: string; isActive: boolean } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Id<"categories"> | null>(null);

  if (categories === undefined) {
    return <TableSkeleton />;
  }

  const handleDelete = async () => {
    if (categoryToDelete) {
      await remove({ id: categoryToDelete });
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-dark overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
            <TableRow className="border-slate-200 dark:border-zinc-800 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50">
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Categoría</TableHead>
              <TableHead className="text-slate-500 dark:text-zinc-400 px-8">Estado</TableHead>
              <TableHead className="text-right text-slate-500 dark:text-zinc-400 px-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={3} className="text-center text-slate-500 dark:text-zinc-500 py-8 px-8">
                   No hay categorías registradas.
                 </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => {
                const Icon = ICON_MAP[category.icon] || ICON_MAP["Heart"];
                return (
                  <TableRow key={category._id} className="border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                    <TableCell className="font-medium text-slate-900 dark:text-white px-8">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${category.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-8">
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={(checked) => toggleActive({ id: category._id, isActive: checked })}
                        className="data-[state=checked]:bg-blue-600 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategory(category)}
                          className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                         <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCategoryToDelete(category._id)}
                          className="hover:bg-red-900/20 text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {editingCategory && (
        <CategoryDialog
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          categoryToEdit={editingCategory}
        />
      )}

       <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-dark border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-zinc-400">
              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría "{categories.find(c => c._id === categoryToDelete)?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
