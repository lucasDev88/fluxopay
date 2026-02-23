import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext";
import type { ReactNode } from "react";

export default function ProtectedRoute( {children}: { children: ReactNode } ) {
    const { logged } = useAuth()

    if (!logged) return <Navigate to={"/login"}/>

    return children
}