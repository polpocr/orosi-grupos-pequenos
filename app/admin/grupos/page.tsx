"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";
import DataTableWrapper from "@/app/components/admin/shared/DataTableWrapper";
import PaginationControls from "@/app/components/admin/shared/PaginationControls";

// Group Modular Components
import GroupsToolbar from "@/app/components/admin/grupos/GroupsToolbar";
import { AdminGroupsCards, AdminGroupsTable, AdminGroupsTableTablet } from "@/app/components/admin/grupos/AdminGroupsList";
import { SortDropdown } from "@/app/components/admin/grupos/SortDropdown";
import ImportGroupsModal from "@/app/components/admin/grupos/ImportGroupsModal";

const ITEMS_PER_PAGE = 8;

function GruposPageContent() {
  // URL handling
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Estados - Inicializados desde URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [districtFilter, setDistrictFilter] = useState(searchParams.get("district") || "all");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "desc");
  const [page, setPage] = useState(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // 2. Data Fetching
  const { results, status, loadMore } = usePaginatedQuery(
    api.groups.getGroups,
    {
      searchQuery: search === "" ? undefined : search,
      sortOrder: sortOrder,
      categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      districtId: districtFilter === "all" ? undefined : districtFilter,
    },
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const dependencies = useQuery(api.groups.getFormDependencies);
  const removeGroup = useMutation(api.groups.remove);

  // Sincronizar filtros a URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (districtFilter !== "all") params.set("district", districtFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (sortOrder !== "desc") params.set("sort", sortOrder);

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();

    if (newSearch !== currentSearch) {
      router.replace(`?${newSearch}`, { scroll: false });
    }
  }, [search, districtFilter, categoryFilter, sortOrder, router, searchParams]);

  // 3. Handlers
  const handleDelete = async (id: Id<"groups">, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el grupo "${name}"?`)) {
      try {
        await removeGroup({ id });
        toast.success("Grupo eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar");
      }
    }
  };

  // 4. Procesamiento 
  const isLoading = status === "LoadingFirstPage" || dependencies === undefined;
  const groups = results || [];

  const handleNextPage = () => {
    const nextPageStart = (page + 1) * ITEMS_PER_PAGE;

    // Si ya tenemos grupos cargados para la siguiente página, solo cambiamos de página
    if (groups.length > nextPageStart) {
      setPage(prev => prev + 1);
    }
    // Si no hay suficientes pero podemos cargar más del backend
    else if (status === "CanLoadMore") {
      loadMore(ITEMS_PER_PAGE);
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  const paginatedGroups = groups.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // hasMore: hay más grupos cargados o podemos cargar más del backend
  const hasMore = groups.length > (page + 1) * ITEMS_PER_PAGE || status === "CanLoadMore";

  // 5. Render
  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Grupos"
        subtitle="Gestiona los grupos pequeños de la iglesia"
        actionButton={
          <GroupsToolbar
            searchValue={search}
            districtFilter={districtFilter}
            categoryFilter={categoryFilter}
            onSearch={(val) => { setSearch(val); setPage(0); }}
            onDistritoChange={(val) => { setDistrictFilter(val); setPage(0); }}
            onCategoriaChange={(val) => { setCategoryFilter(val); setPage(0); }}
            districts={dependencies?.districts}
            categories={dependencies?.categories}
          >
            <SortDropdown sortOrder={sortOrder} onSortChange={(val) => { setSortOrder(val); setPage(0); }} />

            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              className="cursor-pointer w-full md:w-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>

            <Link href="/admin/grupos/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Grupo
              </Button>
            </Link>
          </GroupsToolbar>
        }
      />

      <ImportGroupsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {isLoading ? (
        <div className="p-8 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <DataTableWrapper>
          {/* Vista Móvil */}
          <AdminGroupsCards
            groups={paginatedGroups}
            dependencies={dependencies}
            onDelete={handleDelete}
          />

          {/* Vista Tabla Desktop */}
          <AdminGroupsTable
            groups={paginatedGroups}
            dependencies={dependencies}
            onDelete={handleDelete}
          />

          {/* Mensaje vacío local si es necesario */}
          {paginatedGroups.length === 0 && (
            null
          )}
        </DataTableWrapper>
      )}

      {!isLoading && groups.length > 0 && (
        <div className="mt-1 px-1 flex justify-end">
          <PaginationControls
            page={page}
            hasMore={hasMore}
            isLoading={status === "LoadingMore"}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            isFirstPage={page === 0}
            totalLoaded={groups.length}
          />
        </div>
      )}
    </div>
  );
}

export default function GruposPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-10 w-full" /></div>}>
      <GruposPageContent />
    </Suspense>
  );
}
