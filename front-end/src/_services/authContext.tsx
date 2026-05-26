/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "./api" // seu axios

export type AuthCtx = {
  logged: boolean
  setLogged: (v: boolean) => void
  loading: boolean
  logout: () => void
}


export const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setLogged(false)
    navigate("/login")
  }

  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem("access")

      if (!token) {
        setLogged(false)
        setLoading(false)
        return
      }

      try {
        await api.get("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setLogged(true)
      } catch {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        setLogged(false)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  return (
    <AuthContext.Provider value={{ logged, setLogged, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth fora do provider")
  return ctx
}