import type { StateClient } from "@/components/home/types/State";
import { api } from "./api";

export async function createClient(data: { name: string; email: string; situation: StateClient }) {
  const res = await api.post("/api/clients", data);
  return res.data;
}

export async function getClients() {
  const res = await api.get("/api/clients");
  return res.data;
}

export async function deleteClient(id: string) {
  await api.delete(`/api/clients/${id}`);
}

export async function updateClient(id: string, data: { name?: string; email?: string; situation?: StateClient }) {
  const res = await api.put(`/api/clients/${id}`, data);
  return res.data;
}
