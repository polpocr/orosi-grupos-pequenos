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

                    <DialogTitle className="text-center text-3xl md:text-4xl font-normal text-black mb-2 tracking-normal leading-tight">
                        Confirmación de <br className="md:hidden" /> Inscripción
                    </DialogTitle>

                    {/* Separator - Igual al form */}
                    <div className="w-full border-t border-gray-600 mb-6 mx-auto max-w-[200px] md:max-w-full" />

                    <div className="text-black space-y-4 mb-5 leading-relaxed font-light text-lg max-w-2xl px-4">
                        <p>
                            Gracias por unirte a los Grupos Conexión.
                            Espera la confirmación en tu correo electrónico; pronto tu facilitador se pondrá en contacto contigo.
                        </p>
                        <p>
                            <span className="font-bold">IMPORTANTE: </span>
                            Si aún no has completado el formulario de actualización, te agradecemos que lo llenes en el siguiente enlace:
                        </p>
                        <a href="https://oasiscrecer.com/asistentes/nuevo-formulario/9" target="_blank" className="text-blue-700 hover:underline">
                            Actualizar Información
                        </a>
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
