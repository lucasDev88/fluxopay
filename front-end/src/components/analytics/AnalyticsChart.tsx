import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MultiSeriesDataPoint, ChartType } from "@/_services/types/Analytics";

interface AnalyticsChartProps {
  title: string;
  data: MultiSeriesDataPoint[];
  dataKey: string;
  secondaryDataKey?: string;
  chartType?: ChartType;
  color?: string;
  secondaryColor?: string;
  loading?: boolean;
}

const colorPalettes = {
  blue: { primary: "#3B82F6", secondary: "#60A5FA", gradient: ["#3B82F6", "#93C5FD"] },
  emerald: { primary: "#10B981", secondary: "#34D399", gradient: ["#10B981", "#6EE7B7"] },
  purple: { primary: "#8B5CF6", secondary: "#A78BFA", gradient: ["#8B5CF6", "#C4B5FD"] },
  amber: { primary: "#F59E0B", secondary: "#FBBF24", gradient: ["#F59E0B", "#FCD34D"] },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  formatter?: (value: number, name: string) => [string, string];
}

function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
      {payload.map((entry, index) => {
        const [displayValue] = formatter ? formatter(entry.value, entry.name) : [entry.value];
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-semibold text-white">{displayValue}</span>
          </div>
        );
      })}
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function AnalyticsChart({
  title,
  data,
  dataKey,
  secondaryDataKey,
  chartType = "line",
  color = "blue",
  secondaryColor = "emerald",
  loading = false,
}: AnalyticsChartProps) {
  const palette = colorPalettes[color as keyof typeof colorPalettes] || colorPalettes.blue;
  const secondaryPalette = colorPalettes[secondaryColor as keyof typeof colorPalettes] || colorPalettes.emerald;

  const isCurrency = dataKey.includes("revenue") || dataKey.includes("Lucro");

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const axisProps = {
      XAxis: (
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748B", fontSize: 12 }}
        />
      ),
      YAxis: (
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748B", fontSize: 12 }}
          width={60}
          tickFormatter={isCurrency ? formatCurrency : formatNumber}
        />
      ),
      Tooltip: (
        <Tooltip
          content={<CustomTooltip formatter={(v) => [isCurrency ? formatCurrency(v) : formatNumber(v), ""]} />}
          cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
      ),
      Grid: (
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#334155"
          strokeOpacity={0.3}
        />
      ),
    };

    const commonLineProps = {
      type: "monotone" as const,
      strokeWidth: 3,
      dot: { r: 4, fill: palette.primary, strokeWidth: 2, stroke: "#1e293b" },
      activeDot: { r: 6, fill: palette.primary },
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {axisProps.Grid}
            {axisProps.XAxis}
            {axisProps.YAxis}
            {axisProps.Tooltip}
            <Bar
              dataKey={dataKey}
              fill={`url(#${color}Gradient)`}
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
            {secondaryDataKey && (
              <Bar
                dataKey={secondaryDataKey}
                fill={`url(#${secondaryColor}Gradient)`}
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              />
            )}
            <defs>
              <linearGradient id={`${color}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.primary} stopOpacity={0.9} />
                <stop offset="100%" stopColor={palette.secondary} stopOpacity={0.6} />
              </linearGradient>
              {secondaryDataKey && (
                <linearGradient id={`${secondaryColor}Gradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={secondaryPalette.primary} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={secondaryPalette.secondary} stopOpacity={0.6} />
                </linearGradient>
              )}
            </defs>
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {axisProps.Grid}
            {axisProps.XAxis}
            {axisProps.YAxis}
            {axisProps.Tooltip}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={palette.primary}
              strokeWidth={2}
              fill={`url(#area${color})`}
            />
            {secondaryDataKey && (
              <Area
                type="monotone"
                dataKey={secondaryDataKey}
                stroke={secondaryPalette.primary}
                strokeWidth={2}
                fill={`url(#area${secondaryColor})`}
              />
            )}
            <defs>
              <linearGradient id={`area${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.primary} stopOpacity={0.3} />
                <stop offset="100%" stopColor={palette.primary} stopOpacity={0} />
              </linearGradient>
              {secondaryDataKey && (
                <linearGradient id={`area${secondaryColor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={secondaryPalette.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={secondaryPalette.primary} stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
          </AreaChart>
        );

      case "line":
      default:
        return (
          <LineChart {...commonProps}>
            {axisProps.Grid}
            {axisProps.XAxis}
            {axisProps.YAxis}
            {axisProps.Tooltip}
            <Line
              {...commonLineProps}
              dataKey={dataKey}
              stroke={palette.primary}
            />
            {secondaryDataKey && (
              <Line
                {...commonLineProps}
                dataKey={secondaryDataKey}
                stroke={secondaryPalette.primary}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: palette.primary }}
              />
              <span className="text-xs text-slate-400">Atual</span>
            </div>
            {secondaryDataKey && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: secondaryPalette.primary }}
                />
                <span className="text-xs text-slate-400">Anterior</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}

export default AnalyticsChart;
