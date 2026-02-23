import { createContext, useContext } from "react"

export type AuthCtx = {
  logged: boolean
  setLogged: (v: boolean) => void
}

export const AuthContext = createContext<AuthCtx | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth fora do provider")
  return ctx
}
