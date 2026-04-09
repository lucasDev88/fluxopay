/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getUserFromToken } from "@/_services/auth";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import UserSidebar from "@/components/dashboard/Sidebar";
import DashboardHome from "./dashboard";
import AdminDashboard from "../admin/AdminDashboard";
import AdminPlans from "../admin/AdminPlans";
import AdminPlatform from "../admin/AdminPlatform";
import AdminTransactions from "../admin/AdminTransaction";
import AdminUsers from "../admin/AdminUsers";
import ClientesTab from "./clientesTab";
import SettingsTab from "./config";
import PagamentosTab from "./paymentsTab";
import RelatoriosTab from "./relatoriosTab";

export default function UserDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getUserFromToken();

  const isAdminTab = tab.startsWith("admin");

  // Bloqueio real de admin
  useEffect(() => {
    if (isAdminTab && user?.role !== "admin") {
      setTab("dashboard");
    }
  }, [isAdminTab, tab, user]);

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [tab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 text-white shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-50 lg:z-auto
          transition-transform duration-300 ease-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {isAdminTab ? (
          <AdminSidebar setTab={setTab} />
        ) : (
          <UserSidebar setTab={setTab} />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Top bar for mobile */}
        <div className="lg:hidden h-16" />

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          {/* Background decoration */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl" />
          </div>

          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* USER */}
            {tab === "dashboard" && <DashboardHome />}
            {tab === "settings" && <SettingsTab />}
            {tab === "clientes" && <ClientesTab />}
            {tab === "pagamentos" && <PagamentosTab />}
            {tab === "relatorios" && <RelatoriosTab />}

            {/* Admin somente se for admin */}
            {user?.role === "admin" && tab === "admin-dashboard" && (
              <AdminDashboard />
            )}
            {user?.role === "admin" && tab === "admin-users" && <AdminUsers />}
            {user?.role === "admin" && tab === "admin-plans" && <AdminPlans />}
            {user?.role === "admin" && tab === "admin-platform" && (
              <AdminPlatform />
            )}
            {user?.role === "admin" && tab === "admin-transactions" && (
              <AdminTransactions />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
