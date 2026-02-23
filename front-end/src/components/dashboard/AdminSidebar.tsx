import "../../style/App.css";

import {
  Shield,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

interface AdminSidebarProps {
  setTab: (tab: string) => void;
}

function AdminSidebar({ setTab }: AdminSidebarProps) {
  return (
    <div className="w-64 min-h-screen bg-black text-white p-6 flex flex-col justify-between border-r border-slate-800">
      <div>
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-blue-400">
          <Shield size={20} /> FluxoPay Admin
        </h1>

        <nav className="space-y-3">
          <button
            onClick={() => setTab("admin-dashboard")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <BarChart3 size={18} /> Visão geral
          </button>

          <button
            onClick={() => setTab("admin-users")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <Users size={18} /> Usuários
          </button>

          <button
            onClick={() => setTab("admin-plans")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <CreditCard size={18} /> Planos
          </button>

          <button
            onClick={() => setTab("admin-transactions")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <TrendingUp size={18} /> Transações
          </button>

          <button
            onClick={() => setTab("admin-platform")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <Settings size={18} /> Plataforma
          </button>

          <button
            onClick={() => setTab("dashboard")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800 text-blue-400"
          >
            <ArrowLeft size={18} /> Voltar para usuário
          </button>
        </nav>
      </div>

      <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-red-400">
        <LogOut size={18} /> Sair
      </button>
    </div>
  );
}

export default AdminSidebar;
