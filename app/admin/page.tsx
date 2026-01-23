"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import StatsCard from "../components/admin/shared/StatsCard";
import { Users, Calendar, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.storeUser);
  const [userStored, setUserStored] = useState(false);
  
  // Guardar usuario en Convex al cargar la página
  useEffect(() => {
    if (isLoaded && user && !userStored) {
      storeUser()
        .then(() => setUserStored(true))
        .catch((err) => console.error("Error guardando usuario:", err));
    }
  }, [isLoaded, user, userStored, storeUser]);

  // Solo ejecutar la query después de que el usuario esté guardado
  const adminData = useQuery(
    api.admin.getAdminData,
    isLoaded && user && userStored ? undefined : "skip"
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-white">Cargando...</div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Usuarios"
          value="1,234"
          trendValue="+20% desde el mes pasado"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Grupos Activos"
          value="42"
          trendValue="+3 grupos nuevos este mes"
          icon={Calendar}
          trend="up"
        />
        <StatsCard
          title="Tasa de Crecimiento"
          value="+12.5%"
          trendValue="Comparado con el trimestre anterior"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Admin Data Section - Optional, can be removed if not needed */}
      {adminData !== undefined && (
        <div className="bg-white dark:bg-dark-border border border-slate-200 dark:border-dark-border-light rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Estado de Autenticación
          </h3>
          {adminData === null ? (
            <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 text-red-700 dark:text-red-400">
              <p className="font-medium">Error de Autorización</p>
              <p className="mt-1 text-sm">
                Tu email no está registrado como administrador en la base de datos.
              </p>
            </div>
          ) : (
            <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4">
              <p className="font-medium text-green-700 dark:text-green-400">
                {adminData.message}
              </p>
              <div className="mt-3 space-y-1 text-sm text-green-600 dark:text-green-500">
                <p>Email autorizado: {adminData.user.email}</p>
                <p>Nombre: {adminData.user.name}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
