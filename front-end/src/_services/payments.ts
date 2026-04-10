import type { StatePayment } from "@/components/home/types/State";
import { api } from "./api"
import { getClients } from "./clients";

interface PaymentData {
  name: string;
  price: number;
  description: string;
  situation: StatePayment;
  customerId?: string;
}

interface LinkPaymentResult {
  success: boolean;
  message: string;
  payment?: unknown;
  error?: string;
}

/**
 * Validates if a customer exists by ID
 * @param customerId - The unique customer ID to validate
 * @returns true if customer exists, false otherwise
 */
export async function validateCustomerExists(customerId: string): Promise<boolean> {
  try {
    const clients = await getClients();
    return clients.some((client: { id: string }) => String(client.id) === customerId);
  } catch {
    return false;
  }
}

/**
 * Links a payment to a customer
 * @param paymentId - The payment ID to link
 * @param customerId - The customer ID to link the payment to
 * @returns Result object with success status and message
 */
export async function linkPaymentToCustomer(
  paymentId: string,
  customerId: string
): Promise<LinkPaymentResult> {
  // Validate customer exists
  const customerExists = await validateCustomerExists(customerId);
  
  if (!customerExists) {
    return {
      success: false,
      message: "Cliente não encontrado",
      error: `No customer found with ID: ${customerId}`,
    };
  }

  try {
    const res = await api.put(`/api/payments/${paymentId}`, { customer_id: Number(customerId) });
    return {
      success: true,
      message: "Pagamento vinculado ao cliente com sucesso",
      payment: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao vincular pagamento ao cliente",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Creates a new payment associated with a customer
 * @param data - Payment data including optional customerId
 * @returns The created payment object
 * @throws Error if customerId is provided but customer doesn't exist
 */
export async function createPayment(data: PaymentData) {
  // Build request payload
  const payload: Record<string, unknown> = {
    name: data.name,
    price: data.price,
    description: data.description,
    situation: data.situation,
  };

  // Add customer_id if customerId is provided and valid
  if (data.customerId) {
    const customerExists = await validateCustomerExists(data.customerId);
    if (!customerExists) {
      throw new Error(`Cliente não encontrado com ID: ${data.customerId}`);
    }
    payload.customer_id = Number(data.customerId);
  }
  
  const res = await api.post("/api/payments", payload)
  return res.data
}

export async function getPayments() {
  const res = await api.get("/api/payments")
  return res.data
}

export async function deletePayment(id: string) {
  await api.delete(`/api/payments/${id}`)
}

export async function updatePayment(id: string, data: Partial<PaymentData>) {
  // Build request payload
  const payload: Record<string, unknown> = {};
  
  if (data.name !== undefined) payload.name = data.name;
  if (data.price !== undefined) payload.price = data.price;
  if (data.description !== undefined) payload.description = data.description;
  if (data.situation !== undefined) payload.situation = data.situation;
  
  // Add customer_id if customerId is provided
  if (data.customerId !== undefined) {
    if (data.customerId) {
      const customerExists = await validateCustomerExists(data.customerId);
      if (!customerExists) {
        throw new Error(`Cliente não encontrado com ID: ${data.customerId}`);
      }
      payload.customer_id = Number(data.customerId);
    } else {
      // Allow unlinking by sending null
      payload.customer_id = null;
    }
  }
  
  const res = await api.put(`/api/payments/${id}`, payload)
  return res.data
}
