import { Users, MoreHorizontal, Pencil, Trash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { CategoryBadge, StateBadge } from "./GroupBadges";
import { formatDate } from "@/app/helpers/dateUtils";

interface Dependencies {
    categories: Doc<"categories">[];
    districts: Doc<"districts">[];
    seasons: Doc<"seasons">[];
}

// Tipos comunes
interface GroupListProps {
    groups: Doc<"groups">[];
    dependencies: Dependencies | undefined;
    onDelete: (id: Id<"groups">, name: string) => void;
}

const getDistrictName = (id: Id<"districts">, districts: Doc<"districts">[] | undefined) => {
    return districts?.find((d) => d._id === id)?.name || "---";
};

// Componente para Acciones (Editar/Eliminar)
const GroupActions = ({ group, onDelete }: { group: Doc<"groups">, onDelete: (id: Id<"groups">, name: string) => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-border-light h-8 w-8"
            >
                <MoreHorizontal className="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <Link href={`/admin/grupos/${group._id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
            </Link>
            <Link href={`/admin/grupos/${group._id}/members`}>
                <DropdownMenuItem className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" /> Ver Participantes
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-red-500 hover:text-red-600 hover:bg-red-100/10 cursor-pointer"
                onClick={() => onDelete(group._id, group.name)}
            >
                <Trash className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

// Vista Móvil: Tarjetas (solo debajo de 768px)
export const AdminGroupsCards = ({ groups, dependencies, onDelete }: GroupListProps) => {
    if (groups.length === 0) return <div className="p-8 text-center text-muted-foreground xl:hidden">No se encontraron grupos.</div>;

    return (
        <div className="xl:hidden space-y-3">
            {groups.map((grupo) => (
                <div
                    key={grupo._id}
                    className="p-4 bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-sm"
                >
                    {/* Encabezado: Info y Acciones */}
                    <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5 overflow-hidden">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[180px]" title={grupo.name}>
                                    {grupo.name}
                                </h3>
                                <div className="-mt-1 -mr-2 shrink-0">
                                    <GroupActions group={grupo} onDelete={onDelete} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={grupo.leaders.join(", ")}>
                                Líderes: {grupo.leaders.join(", ")}
                            </p>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <CategoryBadge categoryId={grupo.categoryId} categories={dependencies?.categories} />
                        <StateBadge seasonId={grupo.seasonId} seasons={dependencies?.seasons} />
                    </div>

                    {/* Footer: Detalles */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-neutral-800 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(grupo._creationTime)}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                {grupo.currentMembersCount}/{grupo.capacity}
                            </span>
                            <span>miembros</span>
                            <span className="text-slate-300 dark:text-neutral-700">|</span>
                            <span className="truncate max-w-[100px]">
                                {getDistrictName(grupo.districtId, dependencies?.districts)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Vista Tablet: Tabla Simplificada (768px - 1024px)
export const AdminGroupsTableTablet = ({ groups, dependencies, onDelete }: GroupListProps) => {
    if (groups.length === 0) return null;

    return (
        <div className="hidden md:block xl:hidden w-full max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-20rem)] overflow-x-auto">
            <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
                    <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Distrito</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</th>
                        <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Miembros</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                    {groups.map((grupo) => (
                        <tr key={grupo._id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-blue-900/20 rounded-lg">
                                        <Users className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white block truncate max-w-[180px]" title={grupo.name}>{grupo.name}</span>
                                        <span className="text-xs text-slate-400 block truncate max-w-[180px]" title={grupo.leaders.join(", ")}>{grupo.leaders.join(", ")}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{getDistrictName(grupo.districtId, dependencies?.districts)}</td>
                            <td className="px-4 py-3 whitespace-nowrap"><CategoryBadge categoryId={grupo.categoryId} categories={dependencies?.categories} /></td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-900 dark:text-white font-medium">
                                {grupo.currentMembersCount}<span className="text-muted-foreground text-xs">/{grupo.capacity}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right"><GroupActions group={grupo} onDelete={onDelete} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Vista Escritorio: Tabla Completa
export const AdminGroupsTable = ({ groups, dependencies, onDelete }: GroupListProps) => {
    if (groups.length === 0) return null;

    return (
        <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
                    <tr>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Facilitador(es)</th>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Distrito</th>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Miembros</th>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                    {groups.map((grupo) => (
                        <tr key={grupo._id} className="hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                            <td className="px-6 py-2.5">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-blue-900/20 rounded-lg">
                                        <Users className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]" title={grupo.name}>{grupo.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-2.5 text-sm text-slate-500 dark:text-slate-400"><span className="block truncate max-w-[180px]" title={grupo.leaders.join(", ")}>{grupo.leaders.join(", ")}</span></td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{getDistrictName(grupo.districtId, dependencies?.districts)}</td>
                            <td className="px-6 py-2.5 whitespace-nowrap"><CategoryBadge categoryId={grupo.categoryId} categories={dependencies?.categories} /></td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">
                                {grupo.currentMembersCount} <span className="text-muted-foreground text-xs">/ {grupo.capacity}</span>
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{formatDate(grupo._creationTime)}</td>
                            <td className="px-6 py-2.5 whitespace-nowrap"><StateBadge seasonId={grupo.seasonId} seasons={dependencies?.seasons} /></td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-right"><GroupActions group={grupo} onDelete={onDelete} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
