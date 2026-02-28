import { api } from "./api";

export async function signup(data: {
    name: string,
    email: string,
    password: string
}) {
    const res = await api.post("/signup", data)

    localStorage.setItem("access", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)

    return res.data
}

export async function loginAuth(data: {
    email: string,
    password: string
}) {
    const res = await api.post("/login", data)

    console.log("Data recebida", res.data)
    localStorage.setItem("access", res.data.access_token)
    localStorage.setItem("refresh", res.data.refresh_token)

    return res.data
}