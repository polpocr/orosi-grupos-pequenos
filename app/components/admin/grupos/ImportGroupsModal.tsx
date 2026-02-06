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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { generateGroupsTemplate } from "@/app/helpers/export";
import { Id } from "@/convex/_generated/dataModel";
import {
    FileUploadZone,
    DownloadTemplateButton,
    ImportSummaryCards,
    ImportSuccessMessage,
} from "@/app/components/admin/shared/ImportComponents";
import * as XLSX from "xlsx";
import { processImportData, readFileWithEncoding } from "@/app/helpers/import-helpers";
import { CSVGroup, ValidationResult } from "@/app/types/import-types";


interface ImportGroupsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ImportStep = "upload" | "preview" | "result";

export default function ImportGroupsModal({ isOpen, onClose }: ImportGroupsModalProps) {
    const [step, setStep] = useState<ImportStep>("upload");
    const [parsedData, setParsedData] = useState<CSVGroup[]>([]);
    const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
    const [summary, setSummary] = useState({ total: 0, valid: 0, invalid: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [importResult, setImportResult] = useState<{ success: boolean; count: number } | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<string>("");

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
        setIsProcessing(true);
        setParsedData([]);

        try {
            let info: { data: any[], headers: string[] } = { data: [], headers: [] };

            if (file.name.endsWith(".csv")) {
                const text = await readFileWithEncoding(file);
                const wb = XLSX.read(text, { type: "string" });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

                if (jsonData.length > 0) {
                    info.headers = jsonData[0] as string[];
                    info.data = jsonData.slice(1);
                }
            } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                const buffer = await file.arrayBuffer();
                const wb = XLSX.read(buffer, { type: "array" });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

                if (jsonData.length > 0) {
                    info.headers = jsonData[0] as string[];
                    info.data = jsonData.slice(1);
                }
            } else {
                toast.error("Formato no soportado. Usa .csv o .xlsx");
                setIsProcessing(false);
                return;
            }

            if (info.data.length === 0) {
                toast.error("El archivo está vacío");
                setIsProcessing(false);
                return;
            }

            const { data, errors } = processImportData(info.data, info.headers, selectedSeason);

            if (errors.length > 0) {
                toast.error(errors[0]);
                setIsProcessing(false);
                return;
            }

            if (data.length === 0) {
                toast.error("No se encontraron datos de grupos válidos (¿Falta columna Nombre?)");
                setIsProcessing(false);
                return;
            }

            setParsedData(data);

            const result = await validateGroups({ groups: data });
            setValidationResults(result.results as ValidationResult[]);
            setSummary(result.summary);
            setStep("preview");

        } catch (error) {
            console.error(error);
            toast.error("Error al procesar el archivo");
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
                    geoReferencia: g.geoReferencia,
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
        setSelectedSeason("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Importar Grupos
                    </DialogTitle>
                    <DialogDescription>
                        {step === "upload" && "Sube un archivo Excel (.xlsx) o CSV con los grupos a importar."}
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
                                accept=".csv,.xlsx,.xls"
                                description="Arrastra un archivo .xlsx o .csv aquí"
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
                                                            {parsedData[idx]?.seasonName ? ` • ${parsedData[idx]?.seasonName}` : ""}
                                                            {parsedData[idx]?.geoReferencia ? ` • 📍` : ""}
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
