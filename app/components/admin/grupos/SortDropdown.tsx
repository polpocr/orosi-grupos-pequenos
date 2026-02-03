import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortDropdownProps {
    sortOrder: string;
    onSortChange: (value: string) => void;
}

export const SortDropdown = ({ sortOrder, onSortChange }: SortDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full xl:w-auto mr-0 xl:mr-2">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Orden
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ordenar por fecha</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={onSortChange}>
                    <DropdownMenuRadioItem value="desc">Más nuevos primero</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="asc">Más antiguos primero</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
