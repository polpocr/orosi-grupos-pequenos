"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GroupForm } from "@/components/admin/groups/group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditGroupPage() {
  const params = useParams();
  const groupId = params.id as Id<"groups">;

  const group = useQuery(api.groups.get, { id: groupId });
  const dependencies = useQuery(api.groups.getFormDependencies);

  if (group === undefined || dependencies === undefined) {
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

  if (group === null) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Grupo no encontrado</h1>
        <Link href="/admin/grupos">
          <Button variant="link">Volver a lista</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/admin/grupos">
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Volver a Grupos
          </Button>
        </Link>
      </div>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-bold text-center">Editar Grupo: {group.name}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <GroupForm
            initialData={group}
            categories={dependencies.categories}
            districts={dependencies.districts}
            seasons={dependencies.seasons}
          />
        </CardContent>
      </Card>
    </div>
  );
}
