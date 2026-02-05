"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, HelpCircle, Frown } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";

const formSchema = z.object({
    fullName: z.string().min(1, { message: "El nombre es obligatorio" }),
    email: z.string().email({ message: "Correo electrónico inválido" }),
    phone: z.string().min(1, { message: "El teléfono es obligatorio" }).regex(/^[\d\s\-\+\(\)]+$/, { message: "El teléfono solo puede contener números y símbolos válidos (+, -, paréntesis)" }),
});

interface GroupRegistrationModalProps {
    groupId: Id<"groups">;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function GroupRegistrationModal({ groupId, isOpen, onClose, onSuccess }: GroupRegistrationModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [isGroupFull, setIsGroupFull] = useState(false);
    const registerMember = useMutation(api.public.registerMember);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null);
        try {
            await registerMember({
                groupId,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
            });
            // Reset form
            form.reset();
            onSuccess();
        } catch (err: any) {
            // Intentar extraer el mensaje limpio del error de Convex
            let errorMessage = "Ocurrió un error al registrarse.";

            if (err instanceof ConvexError) {
                const data = (err as ConvexError<string>).data;
                if (typeof data === "string") {
                    errorMessage = data;
                }
            } else if (err instanceof Error) {
                // Errores genéricos o fallos de red
                let rawMessage = err.message;

                if (rawMessage.includes("ConvexError:")) {
                    const parts = rawMessage.split("ConvexError:");
                    if (parts.length > 1) {
                        rawMessage = parts[1];
                    }
                }
                // Eliminar stack traces
                errorMessage = rawMessage.split("\n")[0].split("at handler")[0].trim();
            }

            // Si el error es de cupo lleno, mostramos el estado especial
            if (errorMessage.includes("El grupo ya está lleno") || errorMessage.includes("capacidad máxima")) {
                setIsGroupFull(true);
                return;
            }

            setError(errorMessage);
        }
    };

    const handleFullGroupClose = () => {
        setIsGroupFull(false);
        onClose(); // Cerramos todo para volver al listado
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
                <DialogContent
                    showCloseButton={false}
                    overlayClassName="bg-black/95"
                    className="w-full sm:max-w-[800px] rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 px-4 py-0 duration-200 font-raleway tracking-tight bg-white border-none"
                >
                    <div className="overflow-y-auto px-8 py-6 h-full flex flex-col justify-center relative">
                        {/* Botón Cerrar (X) absoluto en la esquina a la derecha */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-black transition-colors cursor-pointer z-10"
                            aria-label="Cerrar"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <DialogHeader className="mb-2 flex flex-row items-center justify-center w-full px-8">
                            <DialogTitle className="text-center text-3xl md:text-4xl font-medium text-black tracking-normal leading-tight">
                                Datos de <br className="md:hidden" /> Información
                            </DialogTitle>
                        </DialogHeader>

                        {/* Separator */}
                        <div className="w-full border-t border-gray-600 mb-8 mx-auto max-w-[200px] md:max-w-full" />

                        {/* Error Feedback */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-none flex items-center gap-2 text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            {/* Full Name */}
                            <div>
                                <Input
                                    placeholder="*Nombre Completo"
                                    className="h-12 text-lg px-4 rounded-none border-gray-600 focus:border-slate-800 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none transition-colors placeholder:text-gray-300 text-black"
                                    {...form.register("fullName")}
                                />
                                {form.formState.errors.fullName && (
                                    <p className="text-xs text-red-500 ml-1">
                                        {form.formState.errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <Input
                                    placeholder="*Correo Electrónico"
                                    className="h-12 text-lg px-4 rounded-none border-gray-600 focus:border-slate-800 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none transition-colors placeholder:text-gray-300 text-black"
                                    {...form.register("email")}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-xs text-red-500 ml-1">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <Input
                                    placeholder="*Teléfono"
                                    type="tel"
                                    className="h-12 text-lg px-4 rounded-none border-gray-600 focus:border-slate-800 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none transition-colors placeholder:text-gray-300 text-black"
                                    {...form.register("phone")}
                                />
                                {form.formState.errors.phone && (
                                    <p className="text-xs text-red-500 ml-1">
                                        {form.formState.errors.phone.message}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 pt-8 md:pt-14 pb-2">
                                <Button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full md:w-52 h-12 rounded-full bg-[#D82828] hover:bg-red-700 text-white font-medium text-lg shadow-none border-none cursor-pointer order-2 md:order-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="w-full md:w-52 h-12 rounded-full bg-[#0E2C40] hover:bg-[#1a3b52] text-white font-medium text-lg shadow-none border-none cursor-pointer order-1 md:order-2"
                                >
                                    {form.formState.isSubmitting ? "Enviando..." : "Unirme"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Popup especial cuando el grupo se llena durante el registro */}
            <AlertDialog open={isGroupFull} onOpenChange={handleFullGroupClose}>
                <AlertDialogContent className="rounded-[20px] bg-white border-none shadow-xl max-w-[90vw] w-[400px]">
                    <AlertDialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                            <span className="text-3xl">🟡</span>
                        </div>
                        <AlertDialogTitle className="text-xl md:text-2xl font-bold text-slate-800">
                            Este grupo se acaba de completar
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-slate-600 space-y-4">
                            <p>
                                Gracias por tu interés 💚
                            </p>
                            <p>
                                Mientras estabas completando tus datos, los últimos cupos de este grupo fueron tomados.
                            </p>
                            <p className="font-medium text-slate-800">
                                En este momento ya no tenemos espacios disponibles.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex sm:justify-center pb-2 pt-4">
                        <AlertDialogAction
                            onClick={handleFullGroupClose}
                            className="w-full rounded-full bg-[#0E2C40] hover:bg-[#1a3b52] text-white font-medium h-12 text-base shadow-none border-none cursor-pointer"
                        >
                            Ver otros grupos disponibles
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
