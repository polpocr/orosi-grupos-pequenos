"use client";

import AdminPageHeader from "@/app/components/admin/shared/AdminPageHeader";
import CategoriesTab from "@/app/components/admin/configuracion/CategoriesTab";
import DistrictsTab from "@/app/components/admin/configuracion/DistrictsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración"
        subtitle="Gestiona las categorías y distritos del sistema"
      />

      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="bg-[#2A2929] border border-[#3A3939]">
          <TabsTrigger 
            value="categorias"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
          >
            Categorías
          </TabsTrigger>
          <TabsTrigger 
            value="distritos"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
          >
            Distritos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categorias" className="mt-6">
          <CategoriesTab />
        </TabsContent>
        
        <TabsContent value="distritos" className="mt-6">
          <DistrictsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
