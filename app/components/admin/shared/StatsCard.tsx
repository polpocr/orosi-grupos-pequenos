import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  trendValue?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export default function StatsCard({
  title,
  value,
  trend = "neutral",
  trendValue,
  icon: Icon,
}: StatsCardProps) {
  const isPositive = trend === "up";
  const isNeutral = trend === "neutral";

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-neutral-700 transition-all duration-300">
      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </h3>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>

        {trendValue && (
          <div className="flex items-center gap-1.5 mt-2">
            {!isNeutral && (
              isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-amber-500" />
              )
            )}
            <span className={`text-sm ${isNeutral
              ? "text-slate-500 dark:text-slate-400"
              : isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
              }`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
