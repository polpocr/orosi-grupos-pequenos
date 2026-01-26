import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-dark overflow-hidden">
      {/* Table Header simulation */}
      <div className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 p-4 grid grid-cols-12 gap-4">
        <Skeleton className="h-4 w-24 col-span-4 bg-slate-200 dark:bg-zinc-800" /> {/* Categoría */}
        <Skeleton className="h-4 w-16 col-span-4 bg-slate-200 dark:bg-zinc-800" /> {/* Estado */}
        <div className="col-span-4 flex justify-end">
          <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-zinc-800" /> {/* Acciones */}
        </div>
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 grid grid-cols-12 gap-4 border-b border-slate-100 dark:border-zinc-800/50 last:border-0 items-center">
          <div className="col-span-4 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-zinc-800" />
          </div>
          
          {/* Estado cell: Switch */}
          <div className="col-span-4">
            <Skeleton className="h-5 w-9 rounded-full bg-slate-200 dark:bg-zinc-800" />
          </div>
          
          {/* Acciones cell: 2 buttons */}
          <div className="col-span-4 flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-md bg-slate-200 dark:bg-zinc-800" />
            <Skeleton className="h-8 w-8 rounded-md bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
