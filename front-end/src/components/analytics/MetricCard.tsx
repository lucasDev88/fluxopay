import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import type { Metric, MetricTrend } from "@/_services/types/Analytics";

interface MetricCardProps {
  metric: Metric;
  icon: LucideIcon;
  color: "blue" | "emerald" | "purple" | "amber";
  index?: number;
}

const colorConfig = {
  blue: {
    bg: "from-blue-500/10 to-blue-600/5",
    border: "hover:border-blue-500/30",
    icon: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    value: "text-blue-400",
  },
  emerald: {
    bg: "from-emerald-500/10 to-emerald-600/5",
    border: "hover:border-emerald-500/30",
    icon: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    value: "text-emerald-400",
  },
  purple: {
    bg: "from-purple-500/10 to-purple-600/5",
    border: "hover:border-purple-500/30",
    icon: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    value: "text-purple-400",
  },
  amber: {
    bg: "from-amber-500/10 to-amber-600/5",
    border: "hover:border-amber-500/30",
    icon: "bg-amber-500/20 text-amber-400 border-amber-500/20",
    value: "text-amber-400",
  },
};

const trendConfig: Record<MetricTrend, { icon: typeof TrendingUp; className: string }> = {
  up: { icon: TrendingUp, className: "text-emerald-400" },
  down: { icon: TrendingDown, className: "text-red-400" },
  neutral: { icon: Minus, className: "text-slate-400" },
};

function formatValue(value: number, format: Metric["format"]): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "number":
      return new Intl.NumberFormat("pt-BR").format(value);
    default:
      return String(value);
  }
}

export function MetricCard({ metric, icon: Icon, color, index = 0 }: MetricCardProps) {
  const config = colorConfig[color];
  const trend = metric.trend || "neutral";
  const TrendIcon = trendConfig[trend].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${config.bg}
        border border-slate-800/50 ${config.border}
        rounded-2xl p-6
        transition-all duration-200
      `}
    >
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-sm font-medium text-slate-400 mb-1">
            {metric.label}
          </p>

          {/* Value */}
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {formatValue(metric.value, metric.format)}
          </h3>

          {/* Trend */}
          {metric.trend && (
            <div className={`flex items-center gap-1.5 mt-3 ${trendConfig[trend].className}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {metric.trendValue || "0%"}
              </span>
              <span className="text-xs text-slate-500 ml-1">vs período anterior</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`
          p-3 rounded-xl border
          ${config.icon}
        `}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Sparkline decoration (optional visual enhancement) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
    </motion.div>
  );
}

export default MetricCard;
