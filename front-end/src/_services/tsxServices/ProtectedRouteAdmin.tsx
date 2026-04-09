import { Navigate } from "react-router-dom"
import { getUserFromToken } from "../auth"

interface Props {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRouteAdmin({ children, requiredRole }: Props) {
  const user = getUserFromToken()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}