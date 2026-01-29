"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Lightbulb, HandHelping, Users, Music, Star, Zap, Briefcase, Smile, Handshake } from "lucide-react";

interface GroupWithDistrict extends Doc<"groups"> {
  district?: { name: string } | null;
}

interface GroupCardProps {
  group: GroupWithDistrict;
  category?: Doc<"categories">;
  onViewDetails?: (group: GroupWithDistrict) => void;
}

const getCategoryIcon = (iconName: string = "") => {
  const iconProps = { className: "w-7 h-7 text-white" };
  switch (iconName) {
    case "BookOpen": return <BookOpen {...iconProps} />;
    case "Lightbulb": return <Lightbulb {...iconProps} />;
    case "Handshake": return <Handshake {...iconProps} />;
    case "Users": return <Users {...iconProps} />;
    case "Heart": return <Heart {...iconProps} />;
    case "Music": return <Music {...iconProps} />;
    case "Star": return <Star {...iconProps} />;
    case "Zap": return <Zap {...iconProps} />;
    case "Briefcase": return <Briefcase {...iconProps} />;
    case "Smile": return <Smile {...iconProps} />;
    case "HandHelping": return <HandHelping {...iconProps} />;
    default: return <BookOpen {...iconProps} />;
  }
};

export default function GroupCard({ group, category, onViewDetails }: GroupCardProps) {
  // Configuración de visualización
  const categoryColor = category?.color || "bg-blue-500";
  const categoryIconName = category?.icon || "BookOpen";

  // Lógica de disponibilidad
  const isFull = group.currentMembersCount >= group.capacity;
  const statusColor = isFull ? "bg-red-500" : "bg-green-500"; // Rojo para lleno, verde para disponible
  const statusText = isFull ? "Cupo lleno" : "Disponible";

  return (
    <div className="relative bg-white max-w-[440px] max-h-[300px] rounded-[37px] p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group border border-transparent hover:border-slate-100 font-raleway">

      {/* Cinta (Ribbon) de Categoría */}
      <div className="absolute top-0 right-7">
        <div className={`w-11 h-16 ${categoryColor} flex items-start justify-center pt-3 rounded-b-lg shadow-sm z-10 clip-path-ribbon relative`}>
          <div className="z-20 relative">
            {getCategoryIcon(categoryIconName)}
          </div>
        </div>
      </div>


      {/* Contenido Principal */}
      <div className="flex flex-col gap-3 mt-1">
        {/* Estado de Disponibilidad */}
        <div className="flex items-center gap-2 -mt-5">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <span className="text-sm font-bold text-slate-800">{statusText}</span>
        </div>

        {/* Título */}
        <h3 className="text-[18px] font-semibold text-slate-900 leading-tight line-clamp-3 pr-12 mt-4">
          {group.name}
        </h3>

        {/* Separador */}
        <div className="w-full border-t border-slate-400" />

        {/* Detalles Técnicos */}
        <div className="text-[14px] text-slate-700 font-semibold">
          <div className="flex flex-col">
            <span className="text-slate-900 block">Día: <span className=" text-slate-700 inline">{group.day}</span></span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-900 block">Hora: <span className=" text-slate-700 inline">{group.time}</span></span>
          </div>

          <div className="w-full border-t border-slate-400 my-2" />

          <div className="flex flex-col">
            <span className="text-slate-900 block">Modalidad: <span className="text-slate-700 inline">
              {group.modality}
              {group.modality.toLowerCase() === "virtual" && " (Zoom/Teams)"}
            </span>
            </span>
          </div>

          {(group.district || group.address) && (
            <div className="flex flex-col font-semibold">
              <span className="text-slate-900 block">Ubicación: <span className="text-slate-700 inline truncate">{group.district?.name || group.address}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Botón */}
      <div className="flex justify-end mt-auto pt-4">
        <Button
          className={`rounded-full px-4 py-5 text-base font-semibold transition-colors ${isFull
            ? "bg-slate-200 text-slate-400 hover:bg-slate-200 cursor-not-allowed"
            : "bg-blue-primary text-white hover:bg-slate-800 transition-all"
            }`}
          onClick={() => onViewDetails && onViewDetails(group)}
          disabled={isFull}
        >
          Ver más
        </Button>
      </div>
    </div>
  );
}
