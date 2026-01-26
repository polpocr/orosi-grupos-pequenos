"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

interface DistrictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  districtToEdit?: { _id: Id<"districts">; name: string } | null;
}

export function DistrictDialog({ isOpen, onClose, districtToEdit }: DistrictDialogProps) {
  const create = useMutation(api.districts.create);
  const update = useMutation(api.districts.update);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (districtToEdit) {
      form.reset({
        name: districtToEdit.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [districtToEdit, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (districtToEdit) {
        await update({ id: districtToEdit._id, ...values });
        toast.success("Distrito actualizado correctamente");
      } else {
        await create(values);
        toast.success("Distrito creado correctamente");
      }
      onClose();
    } catch (error) {
      console.error("Error saving district:", error);
      toast.error("Error al guardar el distrito");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-dark text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{districtToEdit ? "Editar Distrito" : "Nuevo Distrito"}</DialogTitle>
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
                    <Input 
                      placeholder="Ej: Norte" 
                      {...field} 
                      className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-white hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {districtToEdit ? "Guardar Cambios" : "Crear Distrito"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
