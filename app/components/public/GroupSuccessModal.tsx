"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface GroupSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GroupSuccessModal({ isOpen, onClose }: GroupSuccessModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                overlayClassName="bg-black/95"
                className="w-full sm:max-w-[800px] rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 px-4 py-0 duration-200 font-outfit tracking-tight bg-white border-none"
            >
                <div className="overflow-y-auto px-8 py-6 h-full flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-20 h-20 text-[#22C55E] mb-6" />

                    <DialogTitle className="text-center text-3xl md:text-4xl font-normal text-black mb-2 tracking-normal">
                        Confirmación de Verificación
                    </DialogTitle>

                    {/* Separator - Igual al form */}
                    <div className="w-full border-t border-gray-600 mb-6" />

                    <div className="text-black space-y-4 mb-6 leading-relaxed font-light text-lg max-w-2xl px-4">
                        <p>
                            La información proporcionada en este formulario ha sido recibida y
                            registrada correctamente. En breve, recibirá un correo electrónico de
                            confirmación en la dirección que nos ha facilitado.
                        </p>
                        <p>
                            Nuestro equipo revisará su información y se pondrá en contacto con
                            usted a la mayor brevedad posible a través del correo electrónico.
                        </p>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-52 h-12 rounded-full bg-[#0E2C40] hover:bg-[#1a3b52] text-white font-medium text-lg shadow-none border-none cursor-pointer"
                    >
                        Aceptar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
