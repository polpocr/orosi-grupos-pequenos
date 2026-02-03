import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    onNext: () => void;
    onPrev: () => void;
    isFirstPage: boolean;
    totalLoaded: number;
}

export default function PaginationControls({
    page,
    isLoading,
    onNext,
    onPrev,
    isFirstPage,
    hasMore,
}: PaginationControlsProps) {
    if (isFirstPage && !hasMore) return null;

    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={isFirstPage || isLoading}
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!hasMore || isLoading}
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
                <span className="sr-only">Siguiente</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
