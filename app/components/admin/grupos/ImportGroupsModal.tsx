"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { parseCSV, generateGroupsTemplate } from "@/app/helpers/export";
import { Id } from "@/convex/_generated/dataModel";
import {
    FileUploadZone,
    DownloadTemplateButton,
    ImportSummaryCards,
    ImportSuccessMessage,
} from "@/app/components/admin/shared/ImportComponents";

interface ImportGroupsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CSVGroup {
    [key: string]: string | number | undefined;
    name: string;
    description: string;
    capacity: number;
    seasonName: string;
    categoryName: string;
    districtName: string;
    day: string;
    time: string;
    modality: string;
    leaders: string;
    minAge: number;
    maxAge: number;
    address?: string;
    targetAudience?: string;
}

interface ValidationResult {
    row: number;
    isValid: boolean;
    errors: string[];
    data?: {
        name: string;
        description: string;
        capacity: number;
        seasonId: Id<"seasons">;
        categoryId: Id<"categories">;
        districtId: Id<"districts">;
        day: string;
        time: string;
        modality: string;
        leaders: string[];
        minAge: number;
        maxAge: number;
        address?: string;
        targetAudience?: string;
    };
}

// Mapeo de columnas CSV a campos del objeto
const CSV_COLUMN_MAPPING: Record<string, keyof CSVGroup> = {
    "Nombre": "name",
    "Descripcion": "description",
    "Capacidad": "capacity",
    "Temporada": "seasonName",
    "Categoria": "categoryName",
    "Distrito": "districtName",
    "Dia": "day",
    "Hora": "time",
    "Modalidad": "modality",
    "Facilitadores": "leaders",
    "EdadMinima": "minAge",
    "EdadMaxima": "maxAge",
    "Direccion": "address",
    "PublicoObjetivo": "targetAudience",
};

type ImportStep = "upload" | "preview" | "result";

// Función para leer archivo intentando diferentes codificaciones
async function readFileWithEncoding(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();

    // Primero intenta UTF-8
    const utf8Text = new TextDecoder("utf-8").decode(buffer);

    // Si hay caracteres de reemplazo (�), probablemente no es UTF-8
    if (!utf8Text.includes("\uFFFD")) {
        return utf8Text;
    }

    // Intenta Windows-1252 (Latin1) - común en Excel español
    try {
        const latin1Text = new TextDecoder("windows-1252").decode(buffer);
        return latin1Text;
    } catch {
        // Si falla, devuelve UTF-8 de todos modos
        return utf8Text;
    }
}

export default function ImportGroupsModal({ isOpen, onClose }: ImportGroupsModalProps) {
    const [step, setStep] = useState<ImportStep>("upload");
    const [parsedData, setParsedData] = useState<CSVGroup[]>([]);
    const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
    const [summary, setSummary] = useState({ total: 0, valid: 0, invalid: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [importResult, setImportResult] = useState<{ success: boolean; count: number } | null>(null);

    const templateData = useQuery(api.import.getImportTemplate);
    const validateGroups = useMutation(api.import.validateGroups);
    const importGroups = useMutation(api.import.importGroups);

    const handleDownloadTemplate = () => {
        if (!templateData) return;

        const content = generateGroupsTemplate(
            templateData.categories,
            templateData.districts,
            templateData.seasons
        );

        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "plantilla_grupos.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleFileSelect = async (file: File) => {
        if (!file.name.endsWith(".csv")) {
            toast.error("Solo se permiten archivos CSV");
            return;
        }

        setIsProcessing(true);

        try {
            // Intentar leer con diferentes codificaciones
            const content = await readFileWithEncoding(file);
            const { data, errors } = parseCSV<CSVGroup>(content, CSV_COLUMN_MAPPING);

            if (errors.length > 0) {
                toast.error(errors[0]);
                setIsProcessing(false);
                return;
            }

            if (data.length === 0) {
                toast.error("El archivo no contiene datos válidos");
                setIsProcessing(false);
                return;
            }

            setParsedData(data);

            // Validar en el backend
            const result = await validateGroups({ groups: data });
            setValidationResults(result.results as ValidationResult[]);
            setSummary(result.summary);
            setStep("preview");
        } catch (error) {
            toast.error("Error al procesar el archivo");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImport = async () => {
        const validGroups = validationResults
            .filter((r) => r.isValid && r.data)
            .map((r) => r.data!);

        if (validGroups.length === 0) {
            toast.error("No hay grupos válidos para importar");
            return;
        }

        setIsProcessing(true);

        try {
            const result = await importGroups({
                groups: validGroups.map((g) => ({
                    ...g,
                    seasonId: g.seasonId as Id<"seasons">,
                    categoryId: g.categoryId as Id<"categories">,
                    districtId: g.districtId as Id<"districts">,
                })),
            });
            setImportResult(result);
            setStep("result");
            toast.success(`¡Grupos importados correctamente! (${result.count} grupos)`);
        } catch (error) {
            toast.error("Error al importar los grupos");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setStep("upload");
        setParsedData([]);
        setValidationResults([]);
        setSummary({ total: 0, valid: 0, invalid: 0 });
        setImportResult(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Importar Grupos desde CSV
                    </DialogTitle>
                    <DialogDescription>
                        {step === "upload" && "Sube un archivo CSV con los grupos a importar"}
                        {step === "preview" && "Revisa los datos antes de importar"}
                        {step === "result" && "Resultado de la importación"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto py-4">
                    {/* Step: Upload */}
                    {step === "upload" && (
                        <div className="space-y-6">
                            <FileUploadZone
                                onFileSelect={handleFileSelect}
                                isProcessing={isProcessing}
                                accept=".csv"
                                description="Solo archivos .csv"
                            />
                            <div className="flex items-center justify-center">
                                <DownloadTemplateButton
                                    onClick={handleDownloadTemplate}
                                    disabled={!templateData}
                                    label="Descargar Plantilla de Ejemplo"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step: Preview */}
                    {step === "preview" && (
                        <div className="space-y-4">
                            <ImportSummaryCards
                                total={summary.total}
                                valid={summary.valid}
                                invalid={summary.invalid}
                            />

                            {/* Validation Results Table */}
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">Fila</TableHead>
                                            <TableHead className="w-16">Estado</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Errores / Detalles</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {validationResults.map((result, idx) => (
                                            <TableRow
                                                key={idx}
                                                className={result.isValid ? "" : "bg-red-50 dark:bg-red-900/10"}
                                            >
                                                <TableCell className="font-mono">{result.row}</TableCell>
                                                <TableCell>
                                                    {result.isValid ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {parsedData[idx]?.name || "—"}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {result.isValid ? (
                                                        <span className="text-muted-foreground">
                                                            {parsedData[idx]?.categoryName} • {parsedData[idx]?.districtName}
                                                        </span>
                                                    ) : (
                                                        <ul className="list-disc list-inside text-red-600 dark:text-red-400">
                                                            {result.errors.map((err, i) => (
                                                                <li key={i}>{err}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Step: Result */}
                    {step === "result" && importResult && (
                        <ImportSuccessMessage count={importResult.count} entityName="grupos" />
                    )}
                </div>

                <DialogFooter>
                    {step === "upload" && (
                        <Button variant="outline" onClick={handleClose} className="cursor-pointer">
                            Cancelar
                        </Button>
                    )}

                    {step === "preview" && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setStep("upload")}
                                className="cursor-pointer"
                            >
                                Volver
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={summary.valid === 0 || isProcessing}
                                className="cursor-pointer"
                            >
                                {isProcessing
                                    ? "Importando..."
                                    : `Importar ${summary.valid} grupo${summary.valid !== 1 ? "s" : ""}`}
                            </Button>
                        </>
                    )}

                    {step === "result" && (
                        <Button onClick={handleClose} className="cursor-pointer">
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
