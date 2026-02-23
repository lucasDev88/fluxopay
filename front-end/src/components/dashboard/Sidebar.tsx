import "../../style/App.css";

import {
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";

interface UserSidebarProps {
  setTab: (tab: string) => void;
}

function UserSidebar({ setTab }: UserSidebarProps) {
  return (
    <div className="w-64 min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">FluxoPay</h1>

        <nav className="space-y-3">
          <button
            onClick={() => setTab("dashboard")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <BarChart3 size={18} /> Dashboard
          </button>

          <button
            onClick={() => setTab("clientes")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <Users size={18} /> Clientes
          </button>

          <button
            onClick={() => setTab("pagamentos")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <CreditCard size={18} /> Pagamentos
          </button>

          <button
            onClick={() => setTab("relatorios")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <TrendingUp size={18} /> Relatórios
          </button>

          <button
            onClick={() => setTab("settings")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <Settings size={18} /> Configurações
          </button>

          <button
            onClick={() => setTab("admin")}
            className="flex items-center gap-3 w-full text-left p-3 rounded-xl hover:bg-slate-800"
          >
            <Briefcase size={18} /> Administrador
          </button>
        </nav>
      </div>

      <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-red-400">
        <LogOut size={18} /> Sair
      </button>
    </div>
  );
}

export default UserSidebar;
