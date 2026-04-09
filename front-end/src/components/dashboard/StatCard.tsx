import "../../style/App.css";
import { motion } from "framer-motion";
import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";
import { TrendingUp, TrendingDown, Users, CreditCard, AlertCircle, DollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  desc: string;
  trend?: "up" | "down" | "neutral";
  icon?: "revenue" | "clients" | "payments" | "failures";
}

const iconMap = {
  revenue: DollarSign,
  clients: Users,
  payments: CreditCard,
  failures: AlertCircle,
};

const gradientMap = {
  revenue: "from-emerald-500/20 to-emerald-600/10",
  clients: "from-blue-500/20 to-blue-600/10",
  payments: "from-purple-500/20 to-purple-600/10",
  failures: "from-red-500/20 to-red-600/10",
};

const iconColorMap = {
  revenue: "text-emerald-400",
  clients: "text-blue-400",
  payments: "text-purple-400",
  failures: "text-red-400",
};

const borderColorMap = {
  revenue: "hover:border-emerald-500/30",
  clients: "hover:border-blue-500/30",
  payments: "hover:border-purple-500/30",
  failures: "hover:border-red-500/30",
};

export default function StatCard({
  title,
  value,
  desc,
  trend = "neutral",
  icon = "revenue",
}: StatCardProps) {
  const Icon = iconMap[icon];
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        hover
        className={`
          relative overflow-hidden
          bg-gradient-to-br ${gradientMap[icon]}
          border-slate-800/50 ${borderColorMap[icon]}
        `}
      >
        <CardContent className="relative p-6">
          {/* Background decorative element */}
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Label */}
              <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>

              {/* Value */}
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {value}
              </h3>

              {/* Trend indicator */}
              <div className="flex items-center gap-1.5 mt-3">
                {isUp && (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{desc}</span>
                  </div>
                )}
                {isDown && (
                  <div className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{desc}</span>
                  </div>
                )}
                {!isUp && !isDown && (
                  <span className="text-xs text-slate-500">{desc}</span>
                )}
              </div>
            </div>

            {/* Icon */}
            <div
              className={`
                p-3 rounded-xl
                bg-slate-800/50
                border border-slate-700/30
                ${iconColorMap[icon]}
              `}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
