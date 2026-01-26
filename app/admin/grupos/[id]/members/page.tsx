"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash, UserPlus, Users, Mail, Phone, Pencil } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface MemberFormState {
  fullName: string;
  email: string;
  phone: string;
}

const initialFormState: MemberFormState = {
  fullName: "",
  email: "",
  phone: "",
};

export default function GroupMembersPage() {
  const params = useParams();
  const groupId = params.id as Id<"groups">;
  
  const group = useQuery(api.groups.get, { id: groupId });
  const members = useQuery(api.members.getByGroupId, { groupId });
  const category = useQuery(api.groups.getFormDependencies); 
  
  const addMember = useMutation(api.members.add);
  const updateMember = useMutation(api.members.update);
  const removeMember = useMutation(api.members.remove);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<Id<"members"> | null>(null);
  const [formData, setFormData] = useState<MemberFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryName = (categoryId: Id<"categories">) => {
    if (!category) return "---";
    return category.categories.find((c) => c._id === categoryId)?.name || "---";
  };

  const openAddDialog = () => {
    setEditingMemberId(null);
    setFormData(initialFormState);
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: { _id: Id<"members">, fullName: string, email: string, phone: string, role?: string }) => {
    setEditingMemberId(member._id);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMemberId) {
        await updateMember({
          memberId: editingMemberId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        });
        toast.success("Miembro actualizado correctamente");
      } else {
        await addMember({
          groupId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        });
        toast.success("Miembro agregado exitosamente");
      }
      setIsDialogOpen(false);
      setFormData(initialFormState);
      setEditingMemberId(null);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al guardar miembro";
        toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: Id<"members">, name: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${name} del grupo?`)) {
      try {
        await removeMember({ memberId });
        toast.success("Miembro eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar miembro");
      }
    }
  };

  if (group === undefined || members === undefined || category === undefined) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (group === null) {
      return <div className="p-8">Grupo no encontrado</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/grupos">
            <Button variant="ghost" className="w-fit pl-0 gap-2 hover:bg-transparent hover:text-primary cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Volver a Grupos
            </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    {group.name}
                    <Badge variant="outline" className="text-base font-normal hidden sm:inline-flex">
                        {getCategoryName(group.categoryId)}
                    </Badge>
                </h1>
                <div className="flex items-center gap-2 sm:hidden mt-2">
                    <Badge variant="outline" className="text-sm font-normal">
                        {getCategoryName(group.categoryId)}
                    </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                    Gestiona los participantes de este grupo pequeño.
                </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Button className="cursor-pointer w-full md:w-auto" onClick={openAddDialog}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Miembro
                </Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingMemberId ? "Editar Miembro" : "Agregar Nuevo Miembro"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre Completo</Label>
                            <Input 
                                id="fullName" 
                                value={formData.fullName} 
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                placeholder="Ej. Juan Pérez"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input 
                                id="email" 
                                type="email"
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="juan@ejemplo.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input 
                                id="phone" 
                                type="tel"
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+506 8888-8888"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? "Guardando..." : (editingMemberId ? "Actualizar Miembro" : "Guardar Miembro")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {group.currentMembersCount} / {group.capacity}
                </div>
                <p className="text-xs text-muted-foreground">
                   {group.capacity > 0 ? ((group.currentMembersCount || 0) / group.capacity * 100).toFixed(0) : 0}% de capacidad
                </p>
            </CardContent>
        </Card>
      </div>

      {/* Members List - Mobile Cards */}
      <div className="md:hidden space-y-4">
          {members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-md">
                  No hay miembros registrados en este grupo.
              </div>
          ) : (
              members.map((member) => (
                  <Card key={member._id} className="overflow-hidden">
                      <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <h3 className="font-semibold text-lg">{member.fullName}</h3>
                              </div>
                              <div className="flex gap-1">
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                      onClick={() => openEditDialog(member)}
                                  >
                                      <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                      onClick={() => handleRemoveMember(member._id, member.fullName)}
                                  >
                                      <Trash className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{member.phone || "---"}</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))
          )}
      </div>

      {/* Members List - Desktop Table */}
      <div className="hidden md:block rounded-md border bg-card">
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[30%] px-4">Nombre</TableHead>
                    <TableHead className="w-[40%] px-4">Contacto</TableHead>
                    <TableHead className="text-right px-4">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                            No hay miembros registrados en este grupo.
                        </TableCell>
                    </TableRow>
                ) : (
                    members.map((member) => (
                        <TableRow key={member._id}>
                            <TableCell className="font-medium text-base py-6 px-4">
                                {member.fullName}
                            </TableCell>
                            <TableCell className="py-6">
                                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> {member.email}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> {member.phone || "---"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-right py-6">
                                <div className="flex justify-end gap-0.5">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                        onClick={() => openEditDialog(member)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                        onClick={() => handleRemoveMember(member._id, member.fullName)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
