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
    ? "flex flex-col h-full bg-slate-100 dark:bg-[#0F0F0F]" // Móvil (dentro del Sheet)
    : "hidden md:flex md:flex-col md:w-64 bg-slate-100 dark:bg-[#0F0F0F] border-r border-slate-200 dark:border-dark-border-light h-screen fixed left-0 top-0 z-30"; // Desktop

  return (
    <aside className={containerClass}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-dark-border">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
        <p className="text-sm text-slate-600 dark:text-slate-500 mt-1">Iglesia Oasis</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-border hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-dark-border">
        <p className="text-xs text-slate-500 dark:text-slate-600 text-center">
          © 2026 Iglesia Oasis
        </p>
      </div>
    </aside>
  );
}
