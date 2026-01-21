"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Temporadas",
    href: "/admin/temporadas",
    icon: Calendar,
  },
  {
    title: "Grupos",
    href: "/admin/grupos",
    icon: Users,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

interface SidebarProps {
  onClose?: () => void; // Opcional, solo para móvil
  isMobile?: boolean;   // Para saber si es móvil
}

export default function Sidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  const containerClass = isMobile
    ? "flex flex-col h-full bg-[#0F0F0F]" // Móvil (dentro del Sheet)
    : "hidden md:flex md:flex-col md:w-64 bg-[#0F0F0F] border-r border-[#2A2929] h-screen sticky top-0"; // Desktop

  return (
    <aside className={containerClass}>
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2929]">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-slate-500 mt-1">Iglesia Oasis</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-[#2A2929] hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2A2929]">
        <p className="text-xs text-slate-600 text-center">
          © 2026 Iglesia Oasis
        </p>
      </div>
    </aside>
  );
}
