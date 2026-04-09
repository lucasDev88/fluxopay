import "../../style/App.css";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield,
  Users,
  CreditCard,
  TrendingUp,
  LogOut,
  BarChart3,
  ArrowLeft,
  Activity,
  Server,
  UserCog,
} from "lucide-react";

interface AdminSidebarProps {
  setTab: (tab: string) => void;
}

const navItems = [
  { id: "admin-dashboard", label: "Visão geral", icon: BarChart3 },
  { id: "admin-users", label: "Usuários", icon: Users },
  { id: "admin-plans", label: "Planos", icon: CreditCard },
  { id: "admin-transactions", label: "Transações", icon: TrendingUp },
  { id: "admin-platform", label: "Plataforma", icon: Server },
];

function AdminSidebar({ setTab }: AdminSidebarProps) {
  const [activeTab, setActiveTab] = useState("admin-dashboard");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setTab(tabId);
  };

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col border-r border-slate-800/50">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FluxoPay</h1>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-red-400" />
              <p className="text-xs text-red-400 font-medium">Admin Mode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Painel administrativo
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`
                    relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white border border-purple-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-purple-400 to-pink-500"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  <Icon
                    className={`
                      w-5 h-5 transition-colors
                      ${isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"}
                    `}
                  />
                  <span className={`font-medium ${isActive ? "text-white" : ""}`}>
                    {item.label}
                  </span>

                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Tools */}
        <div>
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Ferramentas
          </p>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent transition-all duration-200 group">
              <UserCog className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
              <span className="font-medium">Configurações</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50 space-y-3">
        {/* Back to user dashboard */}
        <button
          onClick={() => handleTabChange("dashboard")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-200 group"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar para usuário</span>
        </button>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair da conta</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
