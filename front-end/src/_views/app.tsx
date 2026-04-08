import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./public/home";
import "../style/App.css";
import Login from "./public/auth/login";
import SignUp from "./public/auth/SignUp";
import UserDashboard from "./private/dashboard/Main";
import ProtectedRoute from "../_services/tsxServices/ProtectedRoute";
import ProtectedRouteAdmin from "@/_services/tsxServices/ProtectedRouteAdmin";
import AdminDashboard from "./private/admin/AdminDashboard";
import PlanDetails from "./public/plans/plansPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/planos/:id" element={<PlanDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRouteAdmin requiredRole="admin">
              <AdminDashboard />
            </ProtectedRouteAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
