import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Mail, Phone, Pencil, Trash } from "lucide-react";

interface MemberActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

function MemberActions({ onEdit, onDelete }: MemberActionsProps) {
    return (
        <div className="flex gap-0.5">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                onClick={onEdit}
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={onDelete}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    );
}

interface MemberListProps {
    members: Doc<"members">[];
    onEdit: (member: Doc<"members">) => void;
    onDelete: (id: Id<"members">, name: string) => void;
}

export function MemberCards({ members, onEdit, onDelete }: MemberListProps) {
    if (members.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
                No hay miembros registrados en este grupo.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {members.map((member) => (
                <Card key={member._id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{member.fullName}</h3>
                            <MemberActions
                                onEdit={() => onEdit(member)}
                                onDelete={() => onDelete(member._id, member.fullName)}
                            />
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{member.phone || "---"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function MembersTable({ members, onEdit, onDelete }: MemberListProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30%] px-4">Nombre</TableHead>
                        <TableHead className="w-[40%] px-4">Contacto</TableHead>
                        <TableHead className="text-right px-4">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                No hay miembros registrados en este grupo.
                            </TableCell>
                        </TableRow>
                    ) : (
                        members.map((member) => (
                            <TableRow key={member._id}>
                                <TableCell className="font-medium text-base py-6 px-4">
                                    {member.fullName}
                                </TableCell>
                                <TableCell className="py-6">
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" /> {member.email}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" /> {member.phone || "---"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right py-6">
                                    <div className="flex justify-end">
                                        <MemberActions
                                            onEdit={() => onEdit(member)}
                                            onDelete={() => onDelete(member._id, member.fullName)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
