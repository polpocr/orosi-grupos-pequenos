"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBadge } from "@/app/components/admin/grupos/GroupBadges";
import { ArrowLeft, UserPlus, Users, Download } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { useMembersCRUD } from "@/app/hooks/useMembersCRUD";
import { downloadCSV, formatTimestampForExport } from "@/app/helpers/export";
import { MemberCards, MembersTable } from "@/app/components/admin/members/MembersList";
import { MemberFormDialog } from "@/app/components/admin/members/MemberFormDialog";
import { DeleteConfirmDialog } from "@/app/components/admin/shared/DeleteConfirmDialog";

export default function GroupMembersPage() {
    const params = useParams();
    const groupId = params.id as Id<"groups">;

    const group = useQuery(api.groups.get, { id: groupId });
    const members = useQuery(api.members.getByGroupId, { groupId });
    const dependencies = useQuery(api.groups.getFormDependencies);

    const crud = useMembersCRUD(groupId);

    const handleExportCSV = () => {
        if (!members || members.length === 0) {
            toast.error("No hay participantes para exportar");
            return;
        }

        const formattedData = members.map((member) => ({
            nombre: member.fullName,
            correo: member.email,
            telefono: member.phone || "---",
            fechaRegistro: formatTimestampForExport(member.timestamp),
        }));

        const safeGroupName = group?.name?.replace(/[^a-zA-Z0-9]/g, "_") || groupId;
        downloadCSV(formattedData, `participantes_${safeGroupName}`, {
            headers: ["nombre", "correo", "telefono", "fechaRegistro"],
            headerLabels: {
                nombre: "Nombre Completo",
                correo: "Correo Electrónico",
                telefono: "Teléfono",
                fechaRegistro: "Fecha de Registro",
            },
        });

        toast.success(`Exportados ${members.length} participantes`);
    };

    if (group === undefined || members === undefined || dependencies === undefined) {
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
                            <span className="hidden sm:inline-flex">
                                <CategoryBadge categoryId={group.categoryId} categories={dependencies.categories} />
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 sm:hidden mt-2">
                            <CategoryBadge categoryId={group.categoryId} categories={dependencies.categories} />
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Gestiona los participantes de este grupo pequeño.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            className="cursor-pointer w-full md:w-auto bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900"
                            onClick={handleExportCSV}
                            disabled={!members || members.length === 0}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Exportar CSV
                        </Button>
                        <Button className="cursor-pointer w-full md:w-auto" onClick={crud.openAddDialog}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Agregar Miembro
                        </Button>
                    </div>
                </div>

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

                {/* Vista móvil */}
                <div className="md:hidden">
                    <MemberCards
                        members={members}
                        onEdit={crud.openEditDialog}
                        onDelete={crud.requestDelete}
                    />
                </div>

                {/* Vista desktop */}
                <div className="hidden md:block">
                    <MembersTable
                        members={members}
                        onEdit={crud.openEditDialog}
                        onDelete={crud.requestDelete}
                    />
                </div>

                <MemberFormDialog
                    isOpen={crud.isDialogOpen}
                    onOpenChange={crud.setIsDialogOpen}
                    isEditing={!!crud.editingMemberId}
                    formData={crud.formData}
                    setFormData={crud.setFormData}
                    onSubmit={crud.handleSubmit}
                    isSubmitting={crud.isSubmitting}
                />

                <DeleteConfirmDialog
                    isOpen={!!crud.memberToDelete}
                    itemName={crud.memberToDelete?.name}
                    onConfirm={crud.confirmDelete}
                    onCancel={crud.cancelDelete}
                />
            </div>
        </div>
    );
}
