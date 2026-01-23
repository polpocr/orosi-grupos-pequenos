"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { ICON_MAP, COLOR_OPTIONS } from "./shared";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  color: z.string().min(1, "El color es requerido"),
  icon: z.string().min(1, "El icono es requerido"),
});

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: { _id: Id<"categories">; name: string; color: string; icon: string } | null;
}

export function CategoryDialog({ isOpen, onClose, categoryToEdit }: CategoryDialogProps) {
  const create = useMutation(api.categories.create);
  const update = useMutation(api.categories.update);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "bg-red-500",
      icon: "Heart",
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      form.reset({
        name: categoryToEdit.name,
        color: categoryToEdit.color,
        icon: categoryToEdit.icon,
      });
    } else {
      form.reset({
        name: "",
        color: "bg-red-500",
        icon: "Heart",
      });
    }
  }, [categoryToEdit, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (categoryToEdit) {
        await update({ id: categoryToEdit._id, ...values });
      } else {
        await create(values);
      }
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-dark text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Jóvenes" {...field} className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white">
                        <SelectValue placeholder="Selecciona un icono" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white">
                      {Object.keys(ICON_MAP).map((iconKey) => {
                         const Icon = ICON_MAP[iconKey];
                         return (
                          <SelectItem key={iconKey} value={iconKey} className="focus:bg-slate-100 dark:focus:bg-zinc-800 focus:text-slate-900 dark:focus:text-white">
                            <div className="flex items-center gap-2">
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{iconKey}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {COLOR_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => field.onChange(option.value)}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-all border-2 ${
                            field.value === option.value ? "border-slate-900 dark:border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"
                          } ${option.value}`}
                          title={option.label}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-white hover:text-slate-900 dark:hover:text-white cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {categoryToEdit ? "Guardar Cambios" : "Crear Categoría"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
