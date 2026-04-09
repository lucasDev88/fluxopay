import type { StatePayment } from "@/components/home/types/State";
import { api } from "./api"

export async function createPayment(data: { name: string; price: number; description: string; situation: StatePayment }) {
  const res = await api.post("/api/payments", data)
  return res.data
}

export async function getPayments() {
  const res = await api.get("/api/payments")
  return res.data
}

export async function deletePayment(id: string) {
  await api.delete(`/api/payments/${id}`)
}

export async function updatePayment(id: string, data: { name?: string; price?: number; description?: string; situation?: StatePayment }) {
  const res = await api.put(`/api/payments/${id}`, data)
  return res.data
}
