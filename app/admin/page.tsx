"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import StatsCard from "../components/admin/shared/StatsCard";
import { Users, FolderOpen, Target, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.storeUser);
  const [userStored, setUserStored] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !userStored) {
      storeUser()
        .then(() => setUserStored(true))
        .catch((err) => console.error("Error guardando usuario:", err));
    }
  }, [isLoaded, user, userStored, storeUser]);

  const adminData = useQuery(
    api.admin.getAdminData,
    isLoaded && user && userStored ? undefined : "skip"
  );

  const stats = useQuery(api.stats.getStats);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-slate-600 dark:text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Bienvenido, {user?.firstName || user?.emailAddresses[0].emailAddress}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Aquí está el resumen de tu panel de administración
        </p>
      </div>

      {/* Statistics Cards */}
      {stats === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Inscritos"
            value={stats.totalMembers.toLocaleString()}
            icon={Users}
            trend="neutral"
          />
          <StatsCard
            title="Total Grupos"
            value={stats.totalGroups.toString()}
            trendValue={`${stats.fullGroups} llenos`}
            icon={FolderOpen}
            trend="up"
          />
          <StatsCard
            title="Ocupación General"
            value={`${stats.occupancyRate}%`}
            trendValue="del total de cupos"
            icon={Target}
            trend={stats.occupancyRate >= 70 ? "up" : "down"}
          />
        </div>
      )}

      {/* Categorías con grupos */}
      {stats && stats.groupsByCategory.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Grupos por Categoría
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.groupsByCategory.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700"
              >
                <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cat.count} {cat.count === 1 ? "grupo" : "grupos"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Auth Status */}
      {adminData !== undefined && (
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Estado de Autenticación
          </h3>
          {adminData === null ? (
            <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 text-red-700 dark:text-red-400">
              <p className="font-medium">Error de Autorización</p>
              <p className="mt-1 text-sm">
                Tu email no está registrado como administrador.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">
                  {adminData.message}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  {adminData.user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
