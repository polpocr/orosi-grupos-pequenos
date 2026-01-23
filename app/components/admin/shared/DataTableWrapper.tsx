import { ReactNode } from "react";

interface DataTableWrapperProps {
  children: ReactNode;
  toolbar?: ReactNode;
}

export default function DataTableWrapper({ children, toolbar }: DataTableWrapperProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {toolbar}
      {children}
    </div>
  );
}
