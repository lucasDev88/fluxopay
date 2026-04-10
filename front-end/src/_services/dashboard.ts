import { api } from "./api";

export interface DashboardData {
  total_clients: number;
  total_payments: number;
  total_revenue: number;
  pending: number;
  failed: number;
  recent_payments: Array<{
    id: number;
    name: string;
    price: number;
    situation: string;
    created_at: string;
  }>;
}

export async function getDashboardData(): Promise<DashboardData> {
  const res = await api.get("/api/dashboard");
  return res.data;
}
