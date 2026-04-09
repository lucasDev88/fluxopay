import { useState, useCallback } from "react";
import type { Clients } from "@/_services/types/Clients";
import type { StateClient } from "@/components/home/types/State";
import { getClients, createClient, deleteClient, updateClient } from "@/_services/clients";

interface CreateClientData {
  name: string;
  email: string;
  situation: StateClient;
}

interface UpdateClientData {
  name?: string;
  email?: string;
  situation?: StateClient;
}

interface UseClientsReturn {
  clients: Clients[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (data: CreateClientData) => Promise<{ success: boolean; error?: string }>;
  editClient: (id: string, data: UpdateClientData) => Promise<{ success: boolean; error?: string }>;
  removeClient: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Clients[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();
      setClients(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar clientes";
      setError(message);
      console.error("[useClients] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addClient = useCallback(async (data: CreateClientData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      await createClient(data);
      await fetchClients();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Erro ao criar cliente");
      setError(errorMessage);
      console.error("[useClients] Create error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  const editClient = useCallback(async (id: string, data: UpdateClientData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      await updateClient(id, data);
      await fetchClients();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Erro ao atualizar cliente");
      setError(errorMessage);
      console.error("[useClients] Update error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  const removeClient = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Erro ao excluir cliente");
      setError(errorMessage);
      console.error("[useClients] Delete error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    editClient,
    removeClient,
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
