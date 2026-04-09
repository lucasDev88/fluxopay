import type { TimePeriod, MultiSeriesDataPoint, Metric } from "./types/Analytics";

// Mock data for development - in production, these would be real API calls
const mockMetrics: Metric[] = [
  {
    id: "revenue",
    label: "Receita Mensal",
    value: 192302394,
    previousValue: 162876450,
    format: "currency",
    trend: "up",
    trendValue: "+18%",
  },
  {
    id: "ticket",
    label: "Ticket Médio",
    value: 87450,
    previousValue: 82100,
    format: "currency",
    trend: "up",
    trendValue: "+6.5%",
  },
  {
    id: "conversion",
    label: "Taxa de Conversão",
    value: 4.2,
    previousValue: 3.8,
    format: "percentage",
    trend: "up",
    trendValue: "+10.5%",
  },
  {
    id: "transactions",
    label: "Total de Transações",
    value: 129381098,
    previousValue: 118500000,
    format: "number",
    trend: "up",
    trendValue: "+9.2%",
  },
];

const generateMockChartData = (period: TimePeriod): MultiSeriesDataPoint[] => {
  const baseValue = 50000;
  
  let points: { label: string; count: number }[] = [];
  
  switch (period) {
    case "week":
      points = [
        { label: "Seg", count: 4 },
        { label: "Ter", count: 4 },
        { label: "Qua", count: 4 },
        { label: "Qui", count: 4 },
        { label: "Sex", count: 4 },
        { label: "Sáb", count: 4 },
        { label: "Dom", count: 4 },
      ];
      break;
    case "month":
      points = [
        { label: "Sem 1", count: 1 },
        { label: "Sem 2", count: 1 },
        { label: "Sem 3", count: 1 },
        { label: "Sem 4", count: 1 },
      ];
      break;
    case "quarter":
      points = [
        { label: "Jan", count: 3 },
        { label: "Fev", count: 3 },
        { label: "Mar", count: 3 },
      ];
      break;
    case "semester":
      points = [
        { label: "Jan", count: 6 },
        { label: "Fev", count: 6 },
        { label: "Mar", count: 6 },
        { label: "Abr", count: 6 },
        { label: "Mai", count: 6 },
        { label: "Jun", count: 6 },
      ];
      break;
    case "year":
      points = [
        { label: "2022", count: 12 },
        { label: "2023", count: 12 },
        { label: "2024", count: 12 },
        { label: "2025", count: 12 },
      ];
      break;
  }
  
  return points.map((p) => ({
    label: p.label,
    revenue: Math.round(baseValue * (0.8 + Math.random() * 0.4)),
    previous: Math.round(baseValue * (0.6 + Math.random() * 0.3)),
    transactions: Math.round(100 + Math.random() * 200),
    clients: Math.round(10 + Math.random() * 30),
  }));
};

// Analytics API functions
export async function getAnalyticsOverview(period: TimePeriod = "semester"): Promise<{
  metrics: Metric[];
  charts: {
    revenue: MultiSeriesDataPoint[];
    transactions: MultiSeriesDataPoint[];
    clients: MultiSeriesDataPoint[];
  };
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In production, replace with actual API call:
  // const response = await api.get('/api/analytics/overview', { params: { period } });
  // return response.data;
  
  const chartData = generateMockChartData(period);
  
  return {
    metrics: mockMetrics,
    charts: {
      revenue: chartData,
      transactions: chartData,
      clients: chartData.map((d) => ({
        label: d.label,
        total: (d.clients as number) + 100,
        new: d.clients,
      })),
    },
  };
}

export async function getChartData(
  _chartType: "revenue" | "transactions" | "clients",
  period: TimePeriod
): Promise<MultiSeriesDataPoint[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // In production:
  // const response = await api.get(`/api/analytics/${chartType}`, { params: { period } });
  // return response.data;
  
  return generateMockChartData(period);
}

export async function getMetricsByPeriod(period: TimePeriod): Promise<Metric[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // In production:
  // const response = await api.get('/api/analytics/metrics', { params: { period } });
  // return response.data;
  
  return mockMetrics.map((m) => ({
    ...m,
    value: period === "week" ? m.value * 0.25 : 
           period === "month" ? m.value * 0.33 :
           period === "quarter" ? m.value :
           period === "semester" ? m.value * 2 :
           m.value * 4,
  }));
}

export async function exportReport(
  format: "pdf" | "csv" | "xlsx",
  dataRange: { start: string; end: string }
): Promise<Blob> {
  // In production:
  // const response = await api.post('/api/analytics/export', 
  //   { format, dataRange },
  //   { responseType: 'blob' }
  // );
  // return response.data;
  
  // For demo, return a mock blob
  const content = `Relatório FluxoPay\nPeríodo: ${dataRange.start} - ${dataRange.end}\nFormato: ${format}`;
  return new Blob([content], { type: "text/plain" });
}
