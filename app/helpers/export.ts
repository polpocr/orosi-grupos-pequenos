export interface CSVOptions {
    headers?: string[];
    headerLabels?: Record<string, string>;
    delimiter?: string;
}

// Escapa valores CSV según RFC 4180 (comillas, comas, saltos de línea)
function escapeCSVValue(value: unknown): string {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n") || stringValue.includes("\r")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

export function downloadCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    options: CSVOptions = {}
): void {
    if (!data || data.length === 0) return;

    const { delimiter = ",", headerLabels = {} } = options;
    const headers = options.headers || Object.keys(data[0]);

    const headerRow = headers.map((h) => escapeCSVValue(headerLabels[h] || h)).join(delimiter);
    const dataRows = data.map((row) => headers.map((h) => escapeCSVValue(row[h])).join(delimiter));

    // BOM para soporte UTF-8 en Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + [headerRow, ...dataRows].join("\r\n")], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================
// CSV IMPORT
// ============================================

interface CSVParseResult<T> {
    data: T[];
    errors: string[];
}

export function parseCSV<T extends Record<string, unknown>>(
    content: string,
    columnMapping: Record<string, keyof T>
): CSVParseResult<T> {
    // Limpiar BOM si existe
    const cleanContent = content.replace(/^\uFEFF/, "");
    
    const lines = cleanContent.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("#"));
    if (lines.length < 2) {
        return { data: [], errors: ["El archivo debe tener al menos un encabezado y una fila de datos"] };
    }

    // Detectar delimitador automáticamente (coma o punto y coma)
    const firstLine = lines[0];
    const delimiter = detectDelimiter(firstLine);
    
    const headers = parseCSVLine(firstLine, delimiter).map(normalizeHeader);
    const errors: string[] = [];
    const data: T[] = [];

    // Normalizar las columnas requeridas para comparación
    const requiredColumns = Object.keys(columnMapping);
    const normalizedMapping: Record<string, string> = {};
    for (const col of requiredColumns) {
        normalizedMapping[normalizeHeader(col)] = col;
    }

    // Validar que existan las columnas requeridas
    const missingColumns = requiredColumns.filter(
        (col) => !headers.some((h) => normalizeHeader(h) === normalizeHeader(col))
    );

    if (missingColumns.length > 0) {
        return {
            data: [],
            errors: [`Columnas faltantes: ${missingColumns.join(", ")}`],
        };
    }

    // Mapear índices de columnas
    const columnIndices: Record<string, number> = {};
    for (const col of requiredColumns) {
        const normalizedCol = normalizeHeader(col);
        const index = headers.findIndex((h) => h === normalizedCol);
        columnIndices[col] = index;
    }

    // Parsear filas de datos
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i], delimiter);
        if (values.length === 0 || values.every((v) => !v.trim())) continue;

        const row: Record<string, unknown> = {};

        for (const [csvColumn, fieldName] of Object.entries(columnMapping)) {
            const index = columnIndices[csvColumn];
            let value: unknown = values[index]?.trim() || "";

            // Convertir números
            const lowerCol = csvColumn.toLowerCase();
            if (["capacity", "minage", "maxage", "edadminima", "edadmaxima", "capacidad"].includes(lowerCol)) {
                const num = parseInt(value as string, 10);
                value = isNaN(num) ? 0 : num;
            }

            row[fieldName as string] = value;
        }

        data.push(row as T);
    }

    return { data, errors };
}

// Detectar si el CSV usa coma o punto y coma como delimitador
function detectDelimiter(line: string): string {
    const commaCount = (line.match(/,/g) || []).length;
    const semicolonCount = (line.match(/;/g) || []).length;
    return semicolonCount > commaCount ? ";" : ",";
}

// Normalizar header: quitar tildes, espacios, convertir a minúsculas
function normalizeHeader(header: string): string {
    return header
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
        .replace(/\s+/g, ""); // Quitar espacios
}

function parseCSVLine(line: string, delimiter: string = ","): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}

// Generar plantilla CSV para importación de grupos
export function generateGroupsTemplate(
    categories: string[],
    districts: string[],
    seasons: string[]
): string {
    const headers = [
        "Nombre",
        "Descripcion",
        "Capacidad",
        "Temporada",
        "Categoria",
        "Distrito",
        "Dia",
        "Hora",
        "Modalidad",
        "Facilitadores",
        "EdadMinima",
        "EdadMaxima",
        "Direccion",
        "PublicoObjetivo",
    ];

    const exampleRow = [
        "Grupo de Ejemplo",
        "Descripción del grupo",
        "20",
        seasons[0] || "Temporada",
        categories[0] || "Categoría",
        districts[0] || "Distrito",
        "Lunes",
        "19:00",
        "Presencial",
        "Juan Pérez, María López",
        "18",
        "65",
        "Dirección del lugar",
        "Jóvenes adultos",
    ];

    const BOM = "\uFEFF";
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\r\n");

    // Agregar comentarios con valores válidos
    const notes = [
        "",
        "# Valores válidos:",
        `# Categorías: ${categories.join(", ")}`,
        `# Distritos: ${districts.join(", ")}`,
        `# Temporadas: ${seasons.join(", ")}`,
        "# Días: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo",
        "# Modalidades: Presencial, Virtual, Híbrido",
    ].join("\r\n");

    return BOM + csvContent + notes;
}

export function formatTimestampForExport(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
