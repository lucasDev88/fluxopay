import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings2,
  LogOut,
  Shield,
  Activity,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  listAdminTransactions,
  getTransactionSummary,
} from "@/_services/admin";
import type {
  AdminTransaction,
  TransactionSummary,
} from "@/_services/types/Admin";
import { authService } from "@/_services/api";
import { useAuth } from "@/_services/authContext";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
});

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "approved", label: "Aprovados" },
  { value: "pending", label: "Pendentes" },
  { value: "failed", label: "Falhos" },
];

export default function AdminTransactions() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const navItems = [
    { id: "overview", label: "Visão geral", icon: LayoutDashboard },
    { id: "users", label: "Usuários", icon: Users },
    { id: "transactions", label: "Transações", icon: ArrowLeftRight },
    { id: "platform", label: "Plataforma", icon: Settings2 },
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txData, summaryData] = await Promise.all([
        listAdminTransactions({
          page,
          limit,
          status: statusFilter || undefined,
        }),
        getTransactionSummary(),
      ]);
      setTransactions(txData.data);
      setTotal(txData.total);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    authService.logout();
    logout();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
            Aprovado
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
            Pendente
          </span>
        );
      case "failed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
            Falhou
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="w-72 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FluxoPay</h1>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-violet-400" />
                <p className="text-xs text-violet-400 font-medium">Admin Mode</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-6">
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
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-white border border-violet-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminTabTx"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-violet-400 to-purple-500"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`
                      w-5 h-5 transition-colors
                      ${isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}
                    `}
                  />
                  <span className={`font-medium ${isActive ? "text-white" : ""}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/50 space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-200 group"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="font-medium">Voltar para usuário</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair da conta</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
                ADMIN
              </span>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Transações
              </h1>
            </div>
            <p className="text-slate-500">
              Controle financeiro da plataforma ({total} total)
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="flex-1 text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={fetchData}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4"
            >
              <p className="text-slate-500 text-xs font-medium mb-1">Total</p>
              <p className="text-xl font-bold text-white">
                {summary.total.toLocaleString("pt-BR")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4"
            >
              <p className="text-slate-500 text-xs font-medium mb-1">Aprovados</p>
              <p className="text-xl font-bold text-emerald-400">
                {summary.approved.toLocaleString("pt-BR")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4"
            >
              <p className="text-slate-500 text-xs font-medium mb-1">Pendentes</p>
              <p className="text-xl font-bold text-yellow-400">
                {summary.pending.toLocaleString("pt-BR")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4"
            >
              <p className="text-slate-500 text-xs font-medium mb-1">Falhos</p>
              <p className="text-xl font-bold text-red-400">
                {summary.failed.toLocaleString("pt-BR")}
              </p>
            </motion.div>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 mb-6">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setStatusFilter(option.value);
                setPage(1);
              }}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  statusFilter === option.value
                    ? "bg-violet-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-left">
                  <th className="p-4 font-medium rounded-tl-lg">Usuário</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Valor</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium rounded-tr-lg">Data</th>
                </tr>
              </thead>
              <tbody>
                {loading && !transactions.length ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-800/30 animate-pulse"
                    >
                      <td className="p-4">
                        <div className="h-4 w-24 bg-slate-800 rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-32 bg-slate-800 rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-16 bg-slate-800 rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-6 w-20 bg-slate-800 rounded-full" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-20 bg-slate-800 rounded" />
                      </td>
                    </tr>
                  ))
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">
                        {tx.user_name}
                      </td>
                      <td className="p-4 text-slate-400">{tx.user_email}</td>
                      <td className="p-4 text-white font-medium">
                        {BRL.format(tx.value)}
                      </td>
                      <td className="p-4">{getStatusBadge(tx.status)}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(tx.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800/50">
              <p className="text-sm text-slate-500">
                Mostrando {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, total)} de {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`
                          w-10 h-10 rounded-lg text-sm font-medium transition-all
                          ${
                            page === pageNum
                              ? "bg-violet-600 text-white"
                              : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
