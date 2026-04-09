import "../../style/App.css";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Briefcase,
  Home,
  Bell,
  HelpCircle,
} from "lucide-react";

interface UserSidebarProps {
  setTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
  { id: "relatorios", label: "Relatórios", icon: TrendingUp },
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "admin", label: "Administrador", icon: Briefcase },
];

function UserSidebar({ setTab }: UserSidebarProps) {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setTab(tabId);
  };

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col border-r border-slate-800/50">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FluxoPay</h1>
            <p className="text-xs text-slate-500">Plataforma de pagamentos</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Menu principal
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
                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-white border border-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-blue-600"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  <Icon
                    className={`
                      w-5 h-5 transition-colors
                      ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}
                    `}
                  />
                  <span className={`font-medium ${isActive ? "text-white" : ""}`}>
                    {item.label}
                  </span>

                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Suporte
          </p>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent transition-all duration-200 group">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
              <span className="font-medium">Notificações</span>
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                3
              </span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent transition-all duration-200 group">
              <HelpCircle className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
              <span className="font-medium">Ajuda</span>
            </button>
          </nav>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-800/50">
        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 mb-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">AS</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin Sistema</p>
            <p className="text-xs text-slate-500 truncate">admin@fluxopay.com</p>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair da conta</span>
        </button>
      </div>
    </div>
  );
}

// Import React for useState
import React from "react";

export default UserSidebar;
