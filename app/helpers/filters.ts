import { Doc } from "@/convex/_generated/dataModel";

export interface FilterState {
  category: string;
  modality: string;
  location: string;
  day: string;
  schedule: string;
  ageRange: [number, number];
  target: string;
  mode: string;
}

export const scheduleLabels: Record<string, string> = { 
    "Manana": "Mañana", 
    "Tarde": "Tarde", 
    "Noche": "Noche" 
};

export const modeOptions = [
    { value: "disponible", label: "Disponible" },
    { value: "lleno", label: "Cupo Lleno" }
];

export const DAYS_OF_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const mapSimpleOptions = (opts: string[]) => opts.map(o => ({ value: o, label: o }));

export const mapScheduleOptions = (opts: string[]) => opts.map(o => ({ value: o, label: scheduleLabels[o] || o }));

export const mapDistrictOptions = (dists: { _id: string; name: string }[]) => dists.map(d => ({ value: d._id, label: d.name }));

// Helper Functions
export const getGroupTime = (timeStr?: string) => {
    if (!timeStr) return "Noche";
    const hour = parseInt(timeStr.split(":")[0]);
    if (hour < 12) return "Manana";
    if (hour < 18) return "Tarde";
    return "Noche";
};

export const sortDays = (days: string[]) => {
    return days.sort((a, b) => {
        return DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b);
    });
};

export const filterGroups = (
    groups: Doc<"groups">[] | undefined, 
    selectedFilters: FilterState, 
    searchTerm: string
) => {
    if (!groups) return [];

    return groups.filter((group) => {
        // 1. Término de búsqueda (Nombre o Líderes)
        const matchesSearch =
            searchTerm === "" ||
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.leaders.some(leader => leader.toLowerCase().includes(searchTerm.toLowerCase()));

        // 2. Filtro de Categoría
        const matchesCategory =
            selectedFilters.category === "all" ||
            group.categoryId === selectedFilters.category;

        // 3. Modalidad
        const matchesModality =
            selectedFilters.modality === "" ||
            group.modality === selectedFilters.modality;

        // 4. Ubicación
        const matchesLocation =
            selectedFilters.location === "" ||
            group.districtId === selectedFilters.location;

        // 5. Día
        const matchesDay =
            selectedFilters.day === "" ||
            group.day.trim() === selectedFilters.day.trim();

        // 6. Horario (Mañana: 0-12, Tarde: 12-18, Noche: 18+)
        let groupTime = getGroupTime(group.time);
        const matchesSchedule =
            selectedFilters.schedule === "" ||
            groupTime === selectedFilters.schedule;

        const matchesAge =
            group.minAge <= selectedFilters.ageRange[1] && group.maxAge >= selectedFilters.ageRange[0];

        // 8. Target
        const matchesTarget =
            selectedFilters.target === "" ||
            group.targetAudience === selectedFilters.target;

        // 9. Mode
        const isFull = (group.currentMembersCount || 0) >= group.capacity;
        const matchesMode =
            selectedFilters.mode === "" ||
            (selectedFilters.mode === "disponible" && !isFull) ||
            (selectedFilters.mode === "lleno" && isFull);

        return matchesSearch && matchesCategory && matchesModality && matchesLocation && matchesDay && matchesSchedule && matchesAge && matchesTarget && matchesMode;
    });
};
