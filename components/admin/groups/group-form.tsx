"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Schema Validation
const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  capacity: z.coerce.number().min(1, "La capacidad debe ser al menos 1"),
  seasonId: z.string().min(1, "Selecciona una temporada"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  districtId: z.string().min(1, "Selecciona un distrito"),
  day: z.string().min(1, "Día requerido"),
  time: z.string().min(1, "Hora requerida"),
  modality: z.string().min(1, "Modalidad requerida"),
  address: z.string().optional(),
  geoReferencia: z.string().optional(),
  leaders: z.string().min(1, "Al menos un líder es requerido"),
  targetAudience: z.string().optional(),
  minAge: z.coerce.number().min(0),
  maxAge: z.coerce.number().min(0),
  legacyId: z.string().optional(),
})
.refine((data) => data.minAge <= data.maxAge, {
  path: ["maxAge"],
  message: "La edad máxima debe ser mayor o igual a la mínima",
});

type FormValues = z.infer<typeof formSchema>;

interface GroupFormProps {
  initialData?: Doc<"groups">;
  categories: Doc<"categories">[];
  districts: Doc<"districts">[];
  seasons: Doc<"seasons">[];
}

export const GroupForm = ({
  initialData,
  categories,
  districts,
  seasons,
}: GroupFormProps) => {
  const router = useRouter();
  const createGroup = useMutation(api.groups.create);
  const updateGroup = useMutation(api.groups.update);

  const defaultValues: Partial<FormValues> = useMemo(() => {
    if (!initialData) {
      return {
        name: "",
        description: "",
        capacity: 12,
        seasonId: "",
        categoryId: "",
        districtId: "",
        day: "",
        time: "",
        modality: "",
        address: "",
        geoReferencia: "",
        leaders: "",
        targetAudience: "",
        minAge: 18,
        maxAge: 99,
        legacyId: "",
      };
    }
    return {
      name: initialData.name,
      description: initialData.description,
      capacity: initialData.capacity,
      seasonId: initialData.seasonId,
      categoryId: initialData.categoryId,
      districtId: initialData.districtId,
      day: initialData.day,
      time: initialData.time,
      modality: initialData.modality,
      address: initialData.address || "",
      geoReferencia: initialData.geoReferencia || "",
      leaders: initialData.leaders.join(", "),
      targetAudience: initialData.targetAudience || "",
      minAge: initialData.minAge,
      maxAge: initialData.maxAge,
      legacyId: initialData.legacyId || "",
    };
  }, [initialData]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues,
  });

  // Reset form when initialData changes (important for edit page loading)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        capacity: initialData.capacity,
        seasonId: initialData.seasonId,
        categoryId: initialData.categoryId,
        districtId: initialData.districtId,
        day: initialData.day,
        time: initialData.time,
        modality: initialData.modality,
        address: initialData.address || "",
        geoReferencia: initialData.geoReferencia || "",
        leaders: initialData.leaders.join(", "),
        targetAudience: initialData.targetAudience || "",
        minAge: initialData.minAge,
        maxAge: initialData.maxAge,
        legacyId: initialData.legacyId || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        capacity: values.capacity,
        seasonId: values.seasonId as Id<"seasons">,
        categoryId: values.categoryId as Id<"categories">,
        districtId: values.districtId as Id<"districts">,
        day: values.day,
        time: values.time,
        modality: values.modality,
        address: values.address,
        geoReferencia: values.geoReferencia,
        leaders: values.leaders.split(",").map((l) => l.trim()).filter(Boolean),
        targetAudience: values.targetAudience,
        minAge: values.minAge,
        maxAge: values.maxAge,
        legacyId: values.legacyId,
      };

      if (initialData) {
        await updateGroup({
          id: initialData._id,
          ...payload,
        });
        toast.success("Grupo actualizado correctamente");
      } else {
        await createGroup(payload);
        toast.success("Grupo creado correctamente");
      }
      
      router.push("/admin/grupos");
      router.refresh();
    } catch (error) {
      toast.error("Error al guardar el grupo");
      console.error(error);
    }
  };

  const minAge = form.watch("minAge");
  const maxAge = form.watch("maxAge");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: IDENTIDAD */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary">Identidad</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Los Vencedores" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Breve descripción..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leaders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Líderes (separados por coma)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Juan Pérez, María Gómez" {...field} />
                  </FormControl>
                  <FormDescription>Ingresa los nombres separados por comas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* COLUMNA 2: LOGÍSTICA */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary">Logística</h3>
            <FormField
              control={form.control}
              name="seasonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporada</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {seasons.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distrito</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Día</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Día" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="modality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Virtual">Virtual</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dirección física..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="geoReferencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Maps (Geo)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* COLUMNA 3: REGLAS */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary">Reglas y Público</h3>
             <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                <FormLabel>Rango de Edad</FormLabel>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Mínima: {minAge ?? 0}</span>
                    <span>Máxima: {maxAge ?? 100}</span>
                </div>
                {/* Visual Slider connecting to form fields */}
                <Slider
                  value={[minAge || 0, maxAge || 100]}
                  max={100}
                  step={1}
                  min={0}
                  onValueChange={(val) => {
                      form.setValue("minAge", val[0]);
                      form.setValue("maxAge", val[1]);
                  }}
                  className="py-4"
                />
                 <FormField
                    control={form.control}
                    name="minAge"
                    render={() => <FormMessage />}
                 />
                  <FormField
                    control={form.control}
                    name="maxAge"
                    render={() => <FormMessage />}
                 />
            </div>
            
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Público Objetivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Jóvenes universitarios" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad Máxima</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-8">
                <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Grupo" : "Crear Grupo")}
                </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
