"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  isActive: z.boolean(),
  registrationStart: z.date().optional(),
  registrationEnd: z.date().optional(),
  groupStart: z.date().optional(),
  groupEnd: z.date().optional(),
}).refine((data) => data.registrationStart, {
  message: "La fecha de inicio de inscripción es requerida",
  path: ["registrationStart"],
}).refine((data) => data.registrationEnd, {
  message: "La fecha de fin de inscripción es requerida",
  path: ["registrationEnd"],
}).refine((data) => data.groupStart, {
  message: "La fecha de inicio de grupos es requerida",
  path: ["groupStart"],
}).refine((data) => data.groupEnd, {
  message: "La fecha de fin de grupos es requerida",
  path: ["groupEnd"],
}).refine((data) => {
  if (!data.registrationEnd || !data.registrationStart) return true;
  return data.registrationEnd > data.registrationStart;
}, {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["registrationEnd"],
}).refine((data) => {
  if (!data.groupEnd || !data.groupStart) return true;
  return data.groupEnd > data.groupStart;
}, {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["groupEnd"],
});

interface SeasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  seasonToEdit?: { 
    _id: Id<"seasons">; 
    name: string; 
    isActive: boolean;
    registrationStart: string;
    registrationEnd: string;
    groupStart: string;
    groupEnd: string;
  } | null;
}

export function SeasonDialog({ isOpen, onClose, seasonToEdit }: SeasonDialogProps) {
  const create = useMutation(api.seasons.create);
  const update = useMutation(api.seasons.update);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isActive: false,
    },
  });

  useEffect(() => {
    if (seasonToEdit) {
      form.reset({
        name: seasonToEdit.name,
        isActive: seasonToEdit.isActive,
        registrationStart: new Date(seasonToEdit.registrationStart),
        registrationEnd: new Date(seasonToEdit.registrationEnd),
        groupStart: new Date(seasonToEdit.groupStart),
        groupEnd: new Date(seasonToEdit.groupEnd),
      });
    } else {
      form.reset({
        name: "",
        isActive: false,
        registrationStart: undefined,
        registrationEnd: undefined,
        groupStart: undefined,
        groupEnd: undefined,
      });
    }
  }, [seasonToEdit, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values.registrationStart || !values.registrationEnd || !values.groupStart || !values.groupEnd) {
        return; // Should be handled by validation
      }

      const formattedValues = {
        name: values.name,
        isActive: values.isActive,
        registrationStart: values.registrationStart.toISOString(),
        registrationEnd: values.registrationEnd.toISOString(),
        groupStart: values.groupStart.toISOString(),
        groupEnd: values.groupEnd.toISOString(),
      };

      if (seasonToEdit) {
        await update({ id: seasonToEdit._id, ...formattedValues });
        toast.success("Temporada actualizada correctamente");
      } else {
        await create(formattedValues);
        toast.success("Temporada creada correctamente");
      }
      onClose();
    } catch (error) {
      console.error("Error saving season:", error);
      toast.error("Error al guardar la temporada");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-dark text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{seasonToEdit ? "Editar Temporada" : "Nueva Temporada"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: Primavera 2026" 
                        {...field} 
                        className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Estado</FormLabel>
                    <div className="flex flex-row items-center justify-between rounded-md border border-slate-200 dark:border-zinc-700 px-3 h-10">
                       <span className="text-sm text-slate-500 dark:text-zinc-400">Temporada Activa</span>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                           className="data-[state=checked]:bg-blue-600 cursor-pointer scale-90"
                         />
                       </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800 pb-2">Periodo de Inscripciones</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registrationStart"
                  render={({ field }) => (
                    <FormItem>
                      <DatePicker 
                        label="Fecha Inicio" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationEnd"
                  render={({ field }) => (
                    <FormItem>
                      <DatePicker 
                        label="Fecha Fin" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800 pb-2">Duración de los Grupos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="groupStart"
                  render={({ field }) => (
                    <FormItem>
                      <DatePicker 
                        label="Fecha Inicio" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupEnd"
                  render={({ field }) => (
                    <FormItem>
                      <DatePicker 
                        label="Fecha Fin" 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-white hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {seasonToEdit ? "Guardar Cambios" : "Crear Temporada"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
