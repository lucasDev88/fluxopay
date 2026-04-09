import { useState, useCallback } from "react";
import type { Payment } from "@/_services/types/Payments";
import type { StatePayment } from "@/components/home/types/State";
import { getPayments, createPayment, deletePayment, updatePayment } from "@/_services/payments";

interface CreatePaymentData {
  name: string;
  price: number;
  description: string;
  situation: StatePayment;
}

interface UpdatePaymentData {
  name?: string;
  price?: number;
  description?: string;
  situation?: StatePayment;
}

interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  addPayment: (data: CreatePaymentData) => Promise<{ success: boolean; error?: string }>;
  editPayment: (id: string, data: UpdatePaymentData) => Promise<{ success: boolean; error?: string }>;
  removePayment: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function usePayments(): UsePaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPayments();
      setPayments(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar pagamentos";
      setError(message);
      console.error("[usePayments] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPayment = useCallback(async (data: CreatePaymentData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      await createPayment(data);
      await fetchPayments();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Erro ao criar pagamento");
      setError(errorMessage);
      console.error("[usePayments] Create error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchPayments]);

  const editPayment = useCallback(async (id: string, data: UpdatePaymentData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      await updatePayment(id, data);
      await fetchPayments();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Erro ao atualizar pagamento");
      setError(errorMessage);
      console.error("[usePayments] Update error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchPayments]);

  const removePayment = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      await deletePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Erro ao excluir pagamento");
      setError(errorMessage);
      console.error("[usePayments] Delete error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    addPayment,
    editPayment,
    removePayment,
  };
}

// Helper to extract error messages from various error formats
function extractErrorMessage(err: unknown, defaultMessage: string): string {
  if (err instanceof Error) {
    return err.message;
  }
  // Handle axios-like errors with response data
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return defaultMessage;
}
