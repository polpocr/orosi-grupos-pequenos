import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
    accept?: string;
    description?: string;
}

export function FileUploadZone({
    onFileSelect,
    isProcessing,
    accept = ".csv",
    description = "Solo archivos .csv",
}: FileUploadZoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600"
                }`}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
            <p className="text-lg font-medium mb-2">
                {isDragging ? "Suelta el archivo aquí" : "Arrastra un archivo o haz clic para seleccionar"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                }}
                disabled={isProcessing}
                className="cursor-pointer"
            >
                {isProcessing ? "Procesando..." : "Seleccionar archivo"}
            </Button>
        </div>
    );
}

interface DownloadTemplateButtonProps {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
}

export function DownloadTemplateButton({
    onClick,
    disabled = false,
    label = "Descargar Plantilla",
}: DownloadTemplateButtonProps) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            disabled={disabled}
            className="cursor-pointer"
        >
            <Download className="h-4 w-4 mr-2" />
            {label}
        </Button>
    );
}

interface ImportSummaryCardsProps {
    total: number;
    valid: number;
    invalid: number;
}

export function ImportSummaryCards({ total, valid, invalid }: ImportSummaryCardsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">Total filas</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{valid}</p>
                <p className="text-sm text-green-600 dark:text-green-400">Válidos</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{invalid}</p>
                <p className="text-sm text-red-600 dark:text-red-400">Con errores</p>
            </div>
        </div>
    );
}

interface ImportSuccessMessageProps {
    count: number;
    entityName?: string;
}

export function ImportSuccessMessage({ count, entityName = "registros" }: ImportSuccessMessageProps) {
    return (
        <div className="text-center py-8">
            <div className="h-16 w-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">¡Importación exitosa!</h3>
            <p className="text-lg text-muted-foreground">
                Se importaron <span className="font-bold text-green-600 dark:text-green-400">{count}</span> {entityName} correctamente
            </p>
        </div>
    );
}
