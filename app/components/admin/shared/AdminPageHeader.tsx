import { AdminPageHeaderProps } from "@/app/types/admin";

export default function AdminPageHeader({
  title,
  subtitle,
  actionButton,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actionButton && <div className="w-full md:w-auto">{actionButton}</div>}
    </div>
  );
}
