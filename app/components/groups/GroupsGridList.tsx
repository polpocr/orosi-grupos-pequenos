import GroupCard from "./GroupCard";
import PaginationControls from "@/app/components/admin/shared/PaginationControls";
import { Doc } from "@/convex/_generated/dataModel";

interface GroupsGridListProps {
    isLoading: boolean;
    isLoadingMore: boolean;
    groups: Doc<"groups">[];
    categories: Doc<"categories">[] | undefined;
    page: number;
    canNext: boolean;
    nextPage: () => void;
    prevPage: () => void;
    onViewDetails: (group: Doc<"groups">) => void;
    onClearFilters: () => void;
    showFilters: boolean;
}

export const GroupsGridList = ({
    isLoading,
    isLoadingMore,
    groups,
    categories,
    page,
    canNext,
    nextPage,
    prevPage,
    onViewDetails,
    onClearFilters,
    showFilters
}: GroupsGridListProps) => {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-2xl font-semibold mb-2">No se encontraron grupos</h3>
                <p className="text-lg opacity-60">Intenta ajustar tus filtros.</p>
                <button
                    onClick={onClearFilters}
                    className="mt-6 px-6 py-2 bg-white text-blue-secondary rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    Limpiar filtros
                </button>
            </div>
        );
    }

    return (
        <>
            <div className={`grid gap-9 ${showFilters ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {groups.map(group => (
                    <GroupCard
                        key={group._id}
                        group={group}
                        category={categories?.find(c => c._id === group.categoryId)}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>

            {/* Controles de Paginación Validados */}
            {/* Solo mostrar si hay más de una página o si estamos en una página > 0 */}
            {(page > 0 || canNext) && (
                <div className="mt-8 flex justify-end">
                    <PaginationControls
                        page={page}
                        hasMore={canNext}
                        isLoading={isLoadingMore}
                        onNext={nextPage}
                        onPrev={prevPage}
                        isFirstPage={page === 0}
                        totalLoaded={groups.length}
                    />
                </div>
            )}
        </>
    );
};
