
import { CSVGroup } from "@/app/types/import-types";

// Mapeo flexible de columnas (Alias)
export const FIELD_ALIASES: Record<keyof CSVGroup, string[]> = {
    name: ["Nombre", "Name", "Group Name", "Nombre del Grupo"],
    description: ["Descripcion", "Description", "Descripción:", "Descripción"],
    capacity: ["Capacidad", "Capacity", "Cantidad Asist", "Cantidad Asist...", "Cupo"],
    seasonName: ["Temporada", "Season"],
    categoryName: ["Categoria", "Category", "Tipo Grupo", "Type"],
    districtName: ["Distrito", "District", "Sede", "Vivienda en C", "Sede/Distrito"],
    day: ["Dia", "Day", "Día de Reuni", "Día de Reunión", "Dia Reunión"],
    time: ["Hora", "Time", "Hora de Reun", "Hora de Reunión", "Hora Reunión"],
    modality: ["Modalidad", "Modality", "Modalidad:", "Tipo"],
    leaders: ["Facilitadores", "Leaders", "Encargados", "Líderes", "Facilitator"],
    minAge: ["EdadMinima", "MinAge", "Edad Minima"],
    maxAge: ["EdadMaxima", "MaxAge", "Edad Maxima"],
    address: ["Direccion", "Address", "Dirección"],
    targetAudience: ["PublicoObjetivo", "TargetAudience", "Dirigido a:", "Dirigido a", "Público"],
    geoReferencia: ["GeoReferencia", "Geo Referencia", "Ubicación", "Ubicacion", "Coordenadas", "Link Ubicacion", "Georreferencia Realizada"],
};

// Función aux para normalizar strings para comparación (quita acentos, espacios y lowerCase)
export function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

// Función para mapear un encabezado de archivo a un campo de nuestro objeto
export function mapHeaderToField(header: string): keyof CSVGroup | null {
    const normalizedHeader = normalizeString(header);
    
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
        // También intenta match exacto con el nombre del campo
        if (normalizeString(field) === normalizedHeader) return field as keyof CSVGroup;
        
        for (const alias of aliases) {
            if (normalizeString(alias) === normalizedHeader) {
                return field as keyof CSVGroup;
            }
        }
    }
    return null;
}

export function processImportData(data: any[], headers: string[], selectedSeason: string): { data: CSVGroup[], errors: string[] } {
    const mappedData: CSVGroup[] = [];
    const errors: string[] = [];

    // Identificar columnas
    const columnIndices: Record<string, number> = {};
    
    headers.forEach((header, index) => {
        const field = mapHeaderToField(header);
        if (field) {
            columnIndices[field] = index;
        }
    });

    if (errors.length > 0) return { data: [], errors };

    // Procesar filas
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || (Array.isArray(row) && row.length === 0)) continue;
        
        const group: Partial<CSVGroup> = {};
        let hasContent = false;
        
        for (const [field, index] of Object.entries(columnIndices)) {
            let value = row[index];
            
            if (value !== undefined && value !== null && value !== "") {
                hasContent = true;
                value = String(value).trim();
                
                // Parse numbers
                if (["capacity", "minAge", "maxAge"].includes(field)) {
                    const num = parseInt(value, 10);
                    group[field as keyof CSVGroup] = isNaN(num) ? 0 : (num as any);
                } else {
                    group[field as keyof CSVGroup] = value;
                }
            }
        }
        
        if (!hasContent) continue;

        // Inyectar Temporada seleccionada
        if (!group.seasonName && selectedSeason) {
            group.seasonName = selectedSeason;
        }
        
        // Defaults vacíos para evitar crash si faltan columnas
        group.description = group.description || "";
        group.capacity = group.capacity || 0;
        group.seasonName = group.seasonName || "";
        group.categoryName = group.categoryName || "";
        group.districtName = group.districtName || "";
        group.day = group.day || "";
        group.time = group.time || "";
        group.modality = group.modality || "";
        group.leaders = group.leaders || "";

        // Edades defaults
        if (group.minAge === undefined) group.minAge = 12;
        if (group.maxAge === undefined) group.maxAge = 99;

        // Solo agregar si tiene nombre
        if (group.name) {
            mappedData.push(group as CSVGroup);
        }
    }

    return { data: mappedData, errors: [] };
}

// Helper para leer CSV si falla XLSX o si es un CSV simple
export async function readFileWithEncoding(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const utf8Text = new TextDecoder("utf-8").decode(buffer);
    if (!utf8Text.includes("\uFFFD")) return utf8Text;
    try {
        return new TextDecoder("windows-1252").decode(buffer);
    } catch {
        return utf8Text;
    }
}
