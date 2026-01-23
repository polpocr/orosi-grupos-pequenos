import { StatsCardProps } from "@/app/types/admin";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
}: StatsCardProps) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>

        {trendValue && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
