import { useState, useCallback, useEffect } from "react";
import type { 
  Metric, 
  TimePeriod, 
  MultiSeriesDataPoint,
  ChartType 
} from "@/_services/types/Analytics";
import { 
  getAnalyticsOverview, 
  getChartData
} from "@/_services/analytics";

interface UseAnalyticsReturn {
  // State
  metrics: Metric[];
  chartData: MultiSeriesDataPoint[];
  selectedPeriod: TimePeriod;
  selectedChart: "revenue" | "transactions" | "clients";
  chartType: ChartType;
  loading: boolean;
  error: string | null;
  
  // Actions
  setSelectedPeriod: (period: TimePeriod) => void;
  setSelectedChart: (chart: "revenue" | "transactions" | "clients") => void;
  setChartType: (type: ChartType) => void;
  refresh: () => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<MultiSeriesDataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("semester");
  const [selectedChart, setSelectedChart] = useState<"revenue" | "transactions" | "clients">("revenue");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [overview, data] = await Promise.all([
        getAnalyticsOverview(selectedPeriod),
        getChartData(selectedChart, selectedPeriod),
      ]);
      
      setMetrics(overview.metrics);
      setChartData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(message);
      console.error("[useAnalytics] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedChart, selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    metrics,
    chartData,
    selectedPeriod,
    selectedChart,
    chartType,
    loading,
    error,
    setSelectedPeriod,
    setSelectedChart,
    setChartType,
    refresh,
  };
}

// Helper hook for individual metric cards
export function useMetricCard(metricId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMetric = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // In production: fetch specific metric
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setLoading(false);
    }
  }, [metricId]);

  return { loading, error, refreshMetric };
}
