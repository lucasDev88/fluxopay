/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"
import { getUserFromToken } from "@/_services/auth"
import AdminSidebar from "@/components/dashboard/AdminSidebar"
import UserSidebar from "@/components/dashboard/Sidebar"
import DashboardHome from "./dashboard"
import AdminDashboard from "../admin/AdminDashboard"
import AdminPlans from "../admin/AdminPlans"
import AdminPlatform from "../admin/AdminPlatform"
import AdminTransactions from "../admin/AdminTransaction"
import AdminUsers from "../admin/AdminUsers"
import ClientesTab from "./clientesTab"
import SettingsTab from "./config"
import PagamentosTab from "./paymentsTab"
import RelatoriosTab from "./relatoriosTab"

export default function UserDashboard() {
  const [tab, setTab] = useState("dashboard")
  const user = getUserFromToken()

  const isAdminTab = tab.startsWith("admin")

  // 🔴 BLOQUEIO REAL DE ADMIN
  useEffect(() => {
    if (isAdminTab && user?.role !== "admin") {
      setTab("dashboard")
    }
  }, [isAdminTab, tab, user])

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {isAdminTab ? (
        <AdminSidebar setTab={setTab} />
      ) : (
        <UserSidebar setTab={setTab} />
      )}

      <div className="flex-1 p-10 space-y-8">
        {/* USER */}
        {tab === "dashboard" && <DashboardHome />}
        {tab === "settings" && <SettingsTab />}
        {tab === "clientes" && <ClientesTab />}
        {tab === "pagamentos" && <PagamentosTab />}
        {tab === "relatorios" && <RelatoriosTab />}

        {/* 🔐 ADMIN SOMENTE SE FOR ADMIN */}
        {user?.role === "admin" && tab === "admin-dashboard" && <AdminDashboard />}
        {user?.role === "admin" && tab === "admin-users" && <AdminUsers />}
        {user?.role === "admin" && tab === "admin-plans" && <AdminPlans />}
        {user?.role === "admin" && tab === "admin-platform" && <AdminPlatform />}
        {user?.role === "admin" && tab === "admin-transactions" && <AdminTransactions />}
      </div>
    </div>
  )
}