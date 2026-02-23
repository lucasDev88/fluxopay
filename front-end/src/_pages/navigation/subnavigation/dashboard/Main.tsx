import { useState } from "react"

import UserSidebar from "../../../../components/dashboard/Sidebar"
import AdminSidebar from "../../../../components/dashboard/AdminSidebar"

import DashboardHome from "./dashboard"
import SettingsTab from "./config"
import ClientesTab from "./clientesTab"
import PagamentosTab from "./paymentsTab"
import RelatoriosTab from "./relatoriosTab"

// páginas admin (crie depois se ainda não existirem)
import AdminDashboard from "../admin/AdminDashboard"
import AdminUsers from "../admin/AdminUsers"
import AdminPlans from "../admin/AdminPlans"
import AdminPlatform from "../admin/AdminPlatform"
import AdminTransactions from "../admin/AdminTransaction"

export default function UserDashboard() {
  const [tab, setTab] = useState("dashboard")

  const isAdminTab = tab.startsWith("admin")

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* SIDEBAR DINÂMICA */}
      {isAdminTab
        ? <AdminSidebar setTab={setTab} />
        : <UserSidebar setTab={setTab} />
      }

      {/* CONTEÚDO */}
      <div className="flex-1 p-10 space-y-8">

        {/* USER */}
        {tab === "dashboard" && <DashboardHome />}
        {tab === "settings" && <SettingsTab />}
        {tab === "clientes" && <ClientesTab />}
        {tab === "pagamentos" && <PagamentosTab />}
        {tab === "relatorios" && <RelatoriosTab />}


        {/* ADMIN */}
        {tab === "admin-dashboard" && <AdminDashboard />}
        {tab === "admin-users" && <AdminUsers />}
        {tab === "admin-plans" && <AdminPlans />}
        {tab === "admin-platform" && <AdminPlatform />}
        {tab === "admin-transactions" && <AdminTransactions />}

      </div>
    </div>
  )
}
