import { useEffect, useRef, MouseEvent, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { X, MapPin, UserPlus, User } from "lucide-react";
import { CategoryIcon } from "@/app/components/ui/Icons";
import { Button } from "@/components/ui/button";
import GroupRegistrationModal from "./GroupRegistrationModal";
import GroupSuccessModal from "./GroupSuccessModal";

interface GroupWithDistrict extends Doc<"groups"> {
    district?: { name: string } | null;
}

interface GroupDetailModalProps {
    group: GroupWithDistrict | null;
    isOpen: boolean;
    onClose: () => void;
    category?: Doc<"categories">;
}

type ModalView = 'detail' | 'register' | 'success';

export default function GroupDetailModal({ group, isOpen, onClose, category }: GroupDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<ModalView>('detail');

    // Reset view when modal is opened/closed or group changes
    useEffect(() => {
        if (isOpen) {
            setView('detail');
        }
    }, [isOpen, group]);

    // Cerrar con la tecla Escape (solo si estamos en la vista de detalle)
    // Las otras vistas (Dialogs) manejan su propio Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && view === 'detail') onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Solo bloqueamos scroll si estamos en detalle, ya que Dialog lo hace por su cuenta
            if (view === 'detail') {
                document.body.style.overflow = "hidden";
            }
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose, view]);

    // Cerrar al hacer click fuera del modal (solo vista detalle)
    const handleBackdropClick = (e: MouseEvent) => {
        if (view !== 'detail') return;
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const formatLeaders = (leaders: string[] | undefined) => {
        if (!leaders || leaders.length === 0) return "Equipo de Staff";
        const names = leaders.filter(n => n.trim().length > 0);
        if (names.length === 0) return "Equipo de Staff";
        if (names.length === 1) return names[0];
        if (names.length === 2) return `${names[0]} y ${names[1]}`;
        return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
    };

    if (!isOpen || !group) return null;

    // Render Registration Modal
    if (view === 'register') {
        return (
            <GroupRegistrationModal
                groupId={group._id}
                isOpen={true}
                onClose={() => setView('detail')} // Volver a detalle al cancelar
                onSuccess={() => setView('success')}
            />
        );
    }

    // Render Success Modal
    if (view === 'success') {
        return (
            <GroupSuccessModal
                isOpen={true}
                onClose={() => onClose()} // Cerrar todo al terminar
            />
        );
    }

    const categoryColor = category?.color || "bg-blue-500";
    const categoryIconName = category?.icon || "BookOpen";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-base p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative bg-white w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 px-4 py-0 duration-200 font-outfit tracking-tight"
            >
                {/* Lazo (Ribbon) - Esquina Superior Derecha + Botón Cerrar */}
                <div className="absolute top-0 right-0 md:right-10 z-20 flex items-start">
                    {/* Lazo */}
                    <div className={`w-12 h-[85px] ${categoryColor} flex items-center justify-center rounded-b-lg shadow-base clip-path-ribbon`}>
                        <div className="text-white">
                            <CategoryIcon iconName={categoryIconName} className="w-7 h-12 text-white mb-2" />
                        </div>
                    </div>

                    {/* Botón Cerrar */}
                    <button
                        onClick={onClose}
                        className="ml-2 mt-2 p-1 bg-transparent hover:bg-slate-100/50 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label="Cerrar"
                    >
                        <X className="w-7 h-7 ml-2" />
                    </button>
                </div>

                {/* Contenedor Principal - Scrollable */}
                <div className="overflow-y-auto custom-scrollbar p-0 flex flex-col h-full">

                    {/* Header Section */}
                    <div className="px-6 pt-5 pb-2 pr-20 md:pr-24">
                        <h2 className="text-2xl md:text-3xl text-black leading-tight">
                            {group.name}
                        </h2>
                    </div>

                    {/* Separador debajo del título */}
                    <div className="border-t border-slate-800 ml-6 mr-24 md:mr-36 mb-4" />

                    {/* Grid Content */}
                    <div className="px-6 flex flex-col gap-2 mb-4">

                        {/* Meta-Información (Grid) */}
                        <div className="grid gap-y-1 text-base">
                            {/* Row: Day */}
                            <div className="flex gap-2 items-center text-black font-light">
                                <span>Día:</span>
                                <span>{group.day}</span>
                            </div>

                            {/* Row: Time */}
                            <div className="flex gap-2 items-center text-black font-light">
                                <span>Hora:</span>
                                <span>{group.time}</span>
                            </div>

                            {/* Row: Modality */}
                            <div className="flex gap-2 items-center text-black font-light">
                                <span>Modalidad:</span>
                                <span>
                                    {group.modality}
                                    {group.modality.toLowerCase().includes("virtual") && " (Zoom)"}
                                </span>
                            </div>

                            {/* Row: Location */}
                            <div className="flex gap-2 items-center text-black font-light">
                                <span>Ubicación:</span>
                                <span>
                                    {group.district?.name || group.address || "Por definir"}
                                </span>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="text-black font-light mb-1">
                            <span className="block text-base">Descripción:</span>
                            <p className="leading-tight text-base">
                                {group.description || "Sin descripción disponible para este grupo."}
                            </p>
                        </div>

                        {/* Facilitators Section */}
                        <div className="mt-1 flex items-start gap-2 text-base text-black font-light">
                            <User className="w-6 h-6 border border-black rounded-full px-0.5 pt-0.5 pb-0" />
                            <span>Facilitadores: {formatLeaders(group.leaders)}</span>
                        </div>
                    </div>

                    {/* FooterSpacer */}
                    <div className="grow" />

                    {/* Separador encima del footer */}
                    <div className="border-t border-slate-800 ml-6 mr-6" />

                    {/* Footer (Barra Inferior) */}
                    <div className="bg-white p-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-black text-sm font-light">
                            <span>Dirigido a:</span>
                            <span className="text-black">
                                {group.targetAudience}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            {/* Botón Ubicación */}
                            {(group.district || group.address) && (
                                <Button
                                    className="flex-1 md:flex-none rounded-full border border-slate-900 text-white bg-black hover:bg-gray-900 font-light gap-2 h-10 px-6 text-base cursor-pointer"
                                    onClick={() => {
                                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${group.district?.name || ""} ${group.address || ""}`)}`, '_blank');
                                    }}
                                >
                                    <MapPin className="w-4 h-4" />
                                    Ubicación
                                </Button>
                            )}

                            {/* Botón Unirme */}
                            <Button
                                className="flex-1 md:flex-none rounded-full bg-blue-primary text-white hover:bg-slate-800 font-light gap-2 shadow-lg shadow-slate-900/20 h-10 px-8 text-base cursor-pointer"
                                onClick={() => setView('register')}
                            >
                                <UserPlus className="w-4 h-4" />
                                Unirme
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
