import { useState, type ReactNode } from "react"
import { AuthContext } from "../authContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState(
    !!localStorage.getItem("access")
  )

  return (
    <AuthContext.Provider value={{ logged, setLogged }}>
      {children}
    </AuthContext.Provider>
  )
}
