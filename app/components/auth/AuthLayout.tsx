import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function AuthLayout({ 
  children,
  subtitle = "Panel de Administración - Grupos Pequeños" 
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark font-raleway">
      {/* Card contenedor */}
      <div className="w-full max-w-md space-y-6 p-6">
        {/* Header personalizado con logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo Iglesia Oasis"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>
          <p className="mt-2 text-sm text-white">
            {subtitle}
          </p>
        </div>

        {/* Contenido (SignIn o SignUp) */}
        {children}

        {/* Footer personalizado */}
        <p className="text-center text-xs text-white">
          ¿Necesitas ayuda? Contacta al administrador
        </p>
      </div>
    </div>
  );
}
