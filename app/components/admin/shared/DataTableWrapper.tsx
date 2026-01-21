import { DataTableWrapperProps } from "@/app/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataTableWrapper({
  children,
  title,
  toolbar,
}: DataTableWrapperProps) {
  return (
    <Card className="bg-[#2A2929] border-[#3A3939]">
      {(title || toolbar) && (
        <CardHeader className="border-b border-[#3A3939]">
          <div className="flex items-center justify-between">
            {title && (
              <CardTitle className="text-xl font-semibold text-white">
                {title}
              </CardTitle>
            )}
            {toolbar && <div>{toolbar}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}
