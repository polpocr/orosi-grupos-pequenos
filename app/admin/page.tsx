"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Panel de Administración
              </h1>
              <p className="mt-2 text-slate-600">
                Bienvenido, {user?.firstName || user?.emailAddresses[0].emailAddress}
              </p>
            </div>
            {/* Botón de logout */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* User Info Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Información del Usuario
          </h2>
          <div className="space-y-2">
            <p className="text-slate-700">
              <span className="font-medium">Email:</span>{" "}
              {user?.emailAddresses[0].emailAddress}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">ID:</span> {user?.id}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Nombre:</span>{" "}
              {user?.fullName || "No configurado"}
            </p>
          </div>
        </div>

        {/* Convex Query Result */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Datos de Convex (Query Protegida)
          </h2>
          {adminData === undefined ? (
            <p className="text-slate-600">Cargando datos...</p>
          ) : adminData === null ? (
            <div className="rounded-md bg-red-50 p-4 text-red-800">
              <p className="font-medium">Error de Autorización</p>
              <p className="mt-1 text-sm">
                Tu email no está registrado como administrador en la base de datos.
              </p>
            </div>
          ) : (
            <div className="rounded-md bg-green-50 p-4">
              <p className="font-medium text-green-800">
                {adminData.message}
              </p>
              <div className="mt-3 space-y-1 text-sm text-green-700">
                <p>Email autorizado: {adminData.user.email}</p>
                <p>Nombre: {adminData.user.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            💡 <span className="font-medium">Nota:</span> Esta página está protegida
            por el middleware. Solo usuarios autenticados pueden verla. Además, la
            query de Convex solo permite acceso a usuarios con role "admin" en la base de datos.
          </p>
        </div>
      </div>
    </div>
  );
}
