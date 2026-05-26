export interface AdminStats {
  total_users: number;
  active_users: number;
  total_revenue: number;
  monthly_revenue: number;
  total_payments: number;
  failed_payments: number;
  pending_payments: number;
  api_errors: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "blocked" | "limited";
  created_at: string;
  revenue: number;
}

export interface AdminTransaction {
  id: number;
  user_name: string;
  user_email: string;
  value: number;
  status: "approved" | "pending" | "failed";
  created_at: string;
}

export interface PlatformConfig {
  default_fee: number;
  free_limit: number;
  webhook_url: string;
  maintenance_mode: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionSummary {
  total: number;
  approved: number;
  pending: number;
  failed: number;
  revenue: number;
}
