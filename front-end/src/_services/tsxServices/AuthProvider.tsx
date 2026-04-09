import { useState, type ReactNode } from "react"
import { AuthContext } from "../authContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState(
    !!localStorage.getItem("access")
  )
  const [loading] = useState(false)

  return (
    <AuthContext.Provider value={{ logged, setLogged, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
