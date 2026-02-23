import { api } from "../_services/api"

export async function getUsername() {
    const res = await api.get("/api/username")
    return res.data
}