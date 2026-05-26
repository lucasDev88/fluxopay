/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import type { TimePeriod, MultiSeriesDataPoint, Metric } from "./types/Analytics";
import { exportData, type ExportColumn, type ExportFormat } from "./export";
import { getDashboardData, type DashboardData } from "./dashboard";

// Fallback metrics structure for trend values (calculated from mock for now)
const mockMetricsFallback: Metric[] = [
  {
    id: "revenue",
    label: "Receita Mensal",
    value: 0,
    previousValue: 0,
    format: "currency",
    trend: "up",
    trendValue: "+0%",
  },
  {
    id: "ticket",
    label: "Ticket Médio",
    value: 0,
    previousValue: 0,
    format: "currency",
    trend: "up",
    trendValue: "+0%",
  },
  {
    id: "conversion",
    label: "Taxa de Conversão",
    value: 0,
    previousValue: 0,
    format: "percentage",
    trend: "up",
    trendValue: "+0%",
  },
  {
    id: "transactions",
    label: "Total de Transações",
    value: 0,
    previousValue: 0,
    format: "number",
    trend: "up",
    trendValue: "+0%",
  },
];

// Group payments by period label
function generateChartDataFromPayments(
  payments: DashboardData["recent_payments"],
  period: TimePeriod
): MultiSeriesDataPoint[] {
  if (!payments || payments.length === 0) {
    return [];
  }

  // Group payments by label based on period
  const groups: Record<string, { revenue: number; transactions: number; clients: Set<string> }> = {};

  // Month labels in Portuguese
  const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  payments.forEach((payment) => {
    const date = new Date(payment.created_at);
    let label: string;

    switch (period) {
      case "week":
        const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        label = days[date.getDay()];
        break;
      case "month":
        const week = Math.ceil(date.getDate() / 7);
        label = `Sem ${week}`;
        break;
      case "quarter":
        label = monthLabels[date.getMonth()];
        break;
      case "semester":
        label = monthLabels[date.getMonth()];
        break;
      case "year":
        label = date.getFullYear().toString();
        break;
      default:
        label = monthLabels[date.getMonth()];
    }

    if (!groups[label]) {
      groups[label] = { revenue: 0, transactions: 0, clients: new Set() };
    }

    // Only approved payments count for revenue
    if (payment.situation === "Aprovado") {
      groups[label].revenue += payment.price;
    }
    groups[label].transactions += 1;
    if (payment.name) {
      groups[label].clients.add(payment.name);
    }
  });

  // Convert to array and sort
  const result = Object.entries(groups)
    .map(([label, data]) => ({
      label,
      revenue: data.revenue,
      transactions: data.transactions,
      clients: data.clients.size,
      previous: 0,
    }))
    .sort((a, b) => {
      // Sort by period order
      const periodOrder: Record<string, number> = {
        // Week
        Dom: 0, Seg: 1, Ter: 2, Qua: 3, Qui: 4, Sex: 5, Sáb: 6,
        // Month weeks
        "Sem 1": 0, "Sem 2": 1, "Sem 3": 2, "Sem 4": 3,
        // Months
        Jan: 0, Fev: 1, Mar: 2, Abr: 3, Mai: 4, Jun: 5, Jul: 6, Ago: 7, Set: 8, Out: 9, Nov: 10, Dez: 11,
      };
      return (periodOrder[a.label] ?? 99) - (periodOrder[b.label] ?? 99);
    });

  return result;
}

// Calculate real metrics from dashboard data
function calculateRealMetrics(data: DashboardData): Metric[] {
  const totalPayments = data.total_payments || 0;
  const totalRevenue = data.total_revenue || 0;
  const pending = data.pending || 0;
  const failed = data.failed || 0;
  const totalClients = data.total_clients || 0;

  // Ticket médio
  const ticketMedio = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  // Taxa de conversão: (aprovados / total) * 100
  const totalAll = totalPayments + pending + failed;
  const taxaConversao = totalAll > 0 ? (totalPayments / totalAll) * 100 : 0;

  return [
    {
      id: "revenue",
      label: "Receita Mensal",
      value: totalRevenue,
      previousValue: 0,
      format: "currency",
      trend: totalRevenue > 0 ? "up" : "neutral",
      trendValue: "+0%",
    },
    {
      id: "ticket",
      label: "Ticket Médio",
      value: Math.round(ticketMedio),
      previousValue: 0,
      format: "currency",
      trend: ticketMedio > 0 ? "up" : "neutral",
      trendValue: "+0%",
    },
    {
      id: "conversion",
      label: "Taxa de Conversão",
      value: Math.round(taxaConversao * 10) / 10,
      previousValue: 0,
      format: "percentage",
      trend: taxaConversao > 0 ? "up" : "neutral",
      trendValue: "+0%",
    },
    {
      id: "transactions",
      label: "Total de Transações",
      value: totalPayments,
      previousValue: 0,
      format: "number",
      trend: totalPayments > 0 ? "up" : "neutral",
      trendValue: "+0%",
    },
  ];
}

// Analytics API functions
export async function getAnalyticsOverview(period: TimePeriod = "semester"): Promise<{
  metrics: Metric[];
  charts: {
    revenue: MultiSeriesDataPoint[];
    transactions: MultiSeriesDataPoint[];
    clients: MultiSeriesDataPoint[];
  };
}> {
  // Fetch real dashboard data
  const dashboardData = await getDashboardData();
  
  // Calculate real metrics
  const realMetrics = calculateRealMetrics(dashboardData);
  
  // Generate chart data from recent payments
  const chartData = generateChartDataFromPayments(dashboardData.recent_payments, period);

  return {
    metrics: realMetrics,
    charts: {
      revenue: chartData,
      transactions: chartData,
      clients: chartData.map((d) => ({
        label: d.label,
        total: Number(d.clients) + 10,
        new: d.clients,
        revenue: 0,
        transactions: 0,
        previous: 0,
      })),
    },
  };
}

export async function getChartData(
  _chartType: "revenue" | "transactions" | "clients",
  period: TimePeriod
): Promise<MultiSeriesDataPoint[]> {
  // Fetch real dashboard data
  const dashboardData = await getDashboardData();
  
  // Generate chart data from recent payments
  return generateChartDataFromPayments(dashboardData.recent_payments, period);
}

export async function getMetricsByPeriod(period: TimePeriod): Promise<Metric[]> {
  // Fetch real dashboard data
  const dashboardData = await getDashboardData();
  
  // Return calculated metrics
  return calculateRealMetrics(dashboardData);
}

export async function exportReport(
  format: "pdf" | "csv" | "xlsx",
  dateRange: { start: string; end: string }
): Promise<Blob> {
  // Fetch real dashboard data for export
  const dashboardData = await getDashboardData();
  const metrics = calculateRealMetrics(dashboardData);

  const exportDataFormatted = metrics.map((m) => ({
    ...m,
    formattedValue: m.format === "currency" 
      ? m.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : m.format === "percentage"
        ? `${m.value}%`
        : m.value.toLocaleString("pt-BR"),
  }));

  const columns: ExportColumn<typeof exportDataFormatted[0]>[] = [
    { key: "id", label: "Métrica", width: 20 },
    { key: "label", label: "Descrição", width: 25 },
    { key: "formattedValue", label: "Valor", width: 15 },
    { key: "trendValue", label: "Variação", width: 15 },
    { key: "format", label: "Tipo", width: 15 },
  ];

  const blob = exportData(exportDataFormatted, columns, format as ExportFormat, {
    fileName: "relatorio-fluxopay",
    title: "Relatório FluxoPay",
    dateRange,
  });

  return blob;
}
