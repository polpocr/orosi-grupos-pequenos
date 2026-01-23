import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/HeaderAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-dark">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderAdmin title="Panel de Administración" />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
