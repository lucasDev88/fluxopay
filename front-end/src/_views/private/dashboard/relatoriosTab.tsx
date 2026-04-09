import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Calendar,
  FileText,
  FileSpreadsheet,
  File,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import { MetricCard, AnalyticsChart, FilterTabs, DateRangePicker, ExportButton } from "@/components/analytics";
import { useAnalytics } from "@/_hooks/useAnalytics";
import type { TimePeriod, ExportFormat } from "@/_services/types/Analytics";
import { exportReport } from "@/_services/analytics";

const periodOptions = [
  { value: "week" as TimePeriod, label: "Semana" },
  { value: "month" as TimePeriod, label: "Mês" },
  { value: "quarter" as TimePeriod, label: "Trimestre" },
  { value: "semester" as TimePeriod, label: "Semestre" },
  { value: "year" as TimePeriod, label: "Ano" },
];

const chartOptions = [
  { id: "revenue", label: "Receita", dataKey: "revenue" },
  { id: "transactions", label: "Transações", dataKey: "transactions" },
  { id: "clients", label: "Clientes", dataKey: "clients" },
] as const;

const metricIcons = [DollarSign, CreditCard, TrendingUp, BarChart3];
const metricColors = ["blue", "emerald", "purple", "amber"] as const;

// Loading skeleton for metrics
function MetricCardSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
          <div className="h-8 w-32 bg-slate-800 rounded mb-3" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
        <div className="w-12 h-12 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

// Loading skeleton for chart
function ChartSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-slate-800 rounded mb-6" />
      <div className="h-72 bg-slate-800/50 rounded-xl" />
    </div>
  );
}

export default function RelatoriosTab() {
  const {
    metrics,
    chartData,
    selectedPeriod,
    selectedChart,
    chartType,
    loading,
    error,
    setSelectedPeriod,
    setChartType,
    refresh,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return { start, end };
  });

  const handleExport = async (format: ExportFormat) => {
    try {
      const blob = await exportReport(format, {
        start: dateRange.start.toISOString().split("T")[0],
        end: dateRange.end.toISOString().split("T")[0],
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-fluxopay-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[RelatoriosTab] Export error:", err);
    }
  };

  const currentChartConfig = chartOptions.find((c) => c.id === selectedChart);

  // Memoized calculations with empty array guards
  const chartStats = useMemo(() => {
    if (!chartData.length) {
      return { maxValue: 0, total: 0, average: 0, minValue: 0 };
    }

    const values = chartData.map((d) => d[currentChartConfig?.dataKey || "revenue"] as number);
    const total = values.reduce((acc, val) => acc + val, 0);
    
    return {
      maxValue: Math.max(...values),
      total,
      average: total / values.length,
      minValue: Math.min(...values),
    };
  }, [chartData, currentChartConfig]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Relatórios</h2>
          <p className="text-slate-500 mt-1">Análise detalhada do seu negócio</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm">Atualizar</span>
          </button>
          <ExportButton onExport={handleExport} disabled={loading} />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="text-sm text-red-400 hover:text-red-300 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Período selecionado:</span>
        </div>
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={(start, end) => setDateRange({ start, end })}
        />
      </div>

      {/* Metrics Grid - with loading skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading && !metrics.length
          ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
          : metrics.map((metric, index) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                icon={metricIcons[index % metricIcons.length]}
                color={metricColors[index % metricColors.length]}
                index={index}
              />
            ))}
      </div>

      {/* Chart Section */}
      <div className="space-y-4">
        {/* Chart Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Period Filter */}
          <FilterTabs
            options={periodOptions}
            selected={selectedPeriod}
            onChange={setSelectedPeriod}
          />

          {/* Chart Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Tipo de gráfico:</span>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
              {(["line", "bar", "area"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  aria-label={`Visualizar como ${type === "line" ? "linha" : type === "bar" ? "barras" : "área"}`}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-all
                    ${chartType === type
                      ? "bg-blue-500 text-white"
                      : "text-slate-400 hover:text-white"
                    }
                  `}
                >
                  {type === "line" ? "Linha" : type === "bar" ? "Barras" : "Área"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chart - removed duplicate */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <AnalyticsChart
            title={`Análise de ${currentChartConfig?.label || "Dados"}`}
            data={chartData}
            dataKey={currentChartConfig?.dataKey || "revenue"}
            secondaryDataKey={currentChartConfig?.id === "clients" ? "new" : "previous"}
            chartType={chartType}
            color={selectedChart === "revenue" ? "blue" : selectedChart === "transactions" ? "purple" : "emerald"}
            secondaryColor="emerald"
            loading={loading}
          />
        )}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card hover className="border-slate-800/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Melhores períodos</h3>
            <div className="space-y-3">
              {chartData.slice(0, 3).map((item, index) => {
                const value = item[currentChartConfig?.dataKey || "revenue"] as number;
                const percentage = chartStats.maxValue > 0 ? (value / chartStats.maxValue) * 100 : 0;

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-medium text-white">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 0,
                        }).format(value)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
              {chartData.length === 0 && !loading && (
                <p className="text-sm text-slate-500 text-center py-4">Sem dados disponíveis</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card hover className="border-slate-800/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo rápido</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <p className="text-xs text-slate-500 mb-1">Média do período</p>
                <p className="text-xl font-bold text-white">
                  {chartStats.average > 0
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      }).format(chartStats.average)
                    : "R$ 0"}
                </p>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <p className="text-xs text-slate-500 mb-1">Total do período</p>
                <p className="text-xl font-bold text-emerald-400">
                  {chartStats.total > 0
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      }).format(chartStats.total)
                    : "R$ 0"}
                </p>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <p className="text-xs text-slate-500 mb-1">Menor valor</p>
                <p className="text-xl font-bold text-slate-300">
                  {chartStats.minValue > 0
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      }).format(chartStats.minValue)
                    : "R$ 0"}
                </p>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <p className="text-xs text-slate-500 mb-1">Maior valor</p>
                <p className="text-xl font-bold text-blue-400">
                  {chartStats.maxValue > 0
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      }).format(chartStats.maxValue)
                    : "R$ 0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section - Single location */}
      <Card hover className="border-slate-800/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Exportar relatórios</h3>
          <p className="text-sm text-slate-500 mb-6">
            Baixe seus relatórios em diferentes formatos para análise offline ou compartilhamento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-red-500/30 hover:bg-slate-800/50 transition-all group"
              aria-label="Exportar relatório em formato PDF"
            >
              <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Relatório PDF</p>
                <p className="text-xs text-slate-500">Formato visual completo</p>
              </div>
            </button>

            <button
              onClick={() => handleExport("csv")}
              className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all group"
              aria-label="Exportar relatório em formato CSV"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <File className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Planilha CSV</p>
                <p className="text-xs text-slate-500">Dados editáveis</p>
              </div>
            </button>

            <button
              onClick={() => handleExport("xlsx")}
              className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all group"
              aria-label="Exportar relatório em formato Excel"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Microsoft Excel</p>
                <p className="text-xs text-slate-500">Tabelas e gráficos</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
