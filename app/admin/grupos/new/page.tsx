"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GroupForm } from "@/components/admin/groups/group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewGroupPage() {
  const dependencies = useQuery(api.groups.getFormDependencies);

  if (!dependencies) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/admin/grupos">
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Volver a Grupos
          </Button>
        </Link>
      </div>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-bold text-center">Crear Nuevo Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupForm
            categories={dependencies.categories}
            districts={dependencies.districts}
            seasons={dependencies.seasons}
          />
        </CardContent>
      </Card>
    </div>
  );
}
