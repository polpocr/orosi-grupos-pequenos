"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export interface MemberFormData {
    fullName: string;
    email: string;
    phone: string;
}

const initialFormState: MemberFormData = {
    fullName: "",
    email: "",
    phone: "",
};

export function useMembersCRUD(groupId: Id<"groups">) {
    const addMember = useMutation(api.members.add);
    const updateMember = useMutation(api.members.update);
    const removeMember = useMutation(api.members.remove);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState<Id<"members"> | null>(null);
    const [formData, setFormData] = useState<MemberFormData>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<{ id: Id<"members">; name: string } | null>(null);

    const openAddDialog = () => {
        setEditingMemberId(null);
        setFormData(initialFormState);
        setIsDialogOpen(true);
    };

    const openEditDialog = (member: Doc<"members">) => {
        setEditingMemberId(member._id);
        setFormData({
            fullName: member.fullName,
            email: member.email,
            phone: member.phone,
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setFormData(initialFormState);
        setEditingMemberId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            toast.error("Nombre y correo son obligatorios");
            return;
        }

        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            toast.error("El teléfono tiene formato inválido");
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
            closeDialog();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al guardar miembro";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestDelete = (memberId: Id<"members">, name: string) => {
        setMemberToDelete({ id: memberId, name });
    };

    const confirmDelete = async () => {
        if (!memberToDelete) return;
        try {
            await removeMember({ memberId: memberToDelete.id });
            toast.success("Miembro eliminado correctamente");
        } catch {
            toast.error("Error al eliminar miembro");
        } finally {
            setMemberToDelete(null);
        }
    };

    const cancelDelete = () => setMemberToDelete(null);

    return {
        formData,
        setFormData,
        isDialogOpen,
        setIsDialogOpen,
        editingMemberId,
        isSubmitting,
        memberToDelete,
        openAddDialog,
        openEditDialog,
        handleSubmit,
        requestDelete,
        confirmDelete,
        cancelDelete,
    };
}
