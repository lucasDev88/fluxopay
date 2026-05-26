import { useState, type ReactNode } from "react";
import { AuthContext } from "../authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState(!!localStorage.getItem("access"));
  const [loading] = useState(false);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLogged(false);
  };

  return (
    <AuthContext.Provider value={{ logged, setLogged, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
