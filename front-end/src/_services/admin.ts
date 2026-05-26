import { api } from "./api";
import type {
  AdminStats,
  AdminUser,
  AdminTransaction,
  PlatformConfig,
  PaginatedResponse,
  TransactionSummary,
} from "./types/Admin";

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get<AdminStats>("/admin/stats");
  return response.data;
};

export const listAdminUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<AdminUser>> => {
  const response = await api.get<PaginatedResponse<AdminUser>>("/admin/users", {
    params,
  });
  return response.data;
};

export const blockUser = async (id: string, blocked: boolean): Promise<void> => {
  await api.put(`/admin/users/${id}/block`, { blocked });
};

export const listAdminTransactions = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedResponse<AdminTransaction>> => {
  const response = await api.get<PaginatedResponse<AdminTransaction>>(
    "/admin/transactions",
    { params }
  );
  return response.data;
};

export const getTransactionSummary = async (): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>(
    "/admin/transactions/summary"
  );
  return response.data;
};

export const getPlatformConfig = async (): Promise<PlatformConfig> => {
  const response = await api.get<PlatformConfig>("/admin/platform/config");
  return response.data;
};

export const updatePlatformConfig = async (
  config: Partial<PlatformConfig>
): Promise<void> => {
  await api.put("/admin/platform/config", config);
};

export const setMaintenanceMode = async (enabled: boolean): Promise<void> => {
  await api.post("/admin/platform/maintenance", { enabled });
};
