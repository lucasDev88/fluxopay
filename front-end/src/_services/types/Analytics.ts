// Chart data types
export type ChartDataPoint = {
  label: string;
  value: number;
};

export type MultiSeriesDataPoint = {
  label: string;
  [key: string]: string | number;
};

// Time period types
export type TimePeriod = "week" | "month" | "quarter" | "semester" | "year";

export type DateRange = {
  start: Date;
  end: Date;
};

// Metric/KPI types
export type MetricTrend = "up" | "down" | "neutral";

export interface Metric {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  format: "currency" | "percentage" | "number";
  trend?: MetricTrend;
  trendValue?: string;
}

// Chart configuration types
export type ChartType = "line" | "bar" | "area";

export interface ChartConfig {
  type: ChartType;
  title: string;
  dataKey: string;
  color?: string;
  gradientColors?: [string, string];
}

// Analytics overview response
export interface AnalyticsOverview {
  metrics: Metric[];
  charts: {
    revenue: MultiSeriesDataPoint[];
    transactions: MultiSeriesDataPoint[];
    clients: MultiSeriesDataPoint[];
  };
}

// Period comparison
export interface PeriodComparison {
  current: number;
  previous: number;
  percentage: number;
  trend: MetricTrend;
}

// Export format types
export type ExportFormat = "pdf" | "csv" | "xlsx";
