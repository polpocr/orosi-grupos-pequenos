import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/HeaderAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-dark">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <HeaderAdmin title="Panel de Administración" />

        {/* Page content */}
        <main className="flex-1 bg-slate-50 dark:bg-dark p-6 pt-[73px]">
          {children}
        </main>
      </div>
    </div>
  );
}
