import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings2,
  LogOut,
  Shield,
  Activity,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { listAdminUsers, blockUser } from "@/_services/admin";
import type { AdminUser } from "@/_services/types/Admin";
import { authService } from "@/_services/api";
import { useAuth } from "@/_services/authContext";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "blocked", label: "Bloqueados" },
  { value: "limited", label: "Limitados" },
];

function UserRow({
  user,
  onBlock,
}: {
  user: AdminUser;
  onBlock: (id: string, blocked: boolean) => void;
}) {
  const isBlocked = user.status === "blocked";

  const getStatusBadge = () => {
    switch (user.status) {
      case "active":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
            Ativo
          </span>
        );
      case "blocked":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
            Bloqueado
          </span>
        );
      case "limited":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
            Limitado
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = () => {
    if (user.role === "admin") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400">
          Admin
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
        Usuário
      </span>
    );
  };

  return (
    <tr className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center">
            <span className="text-violet-400 font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">{getRoleBadge()}</td>
      <td className="p-4">{getStatusBadge()}</td>
      <td className="p-4 text-white font-medium">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 0,
        }).format(user.revenue)}
      </td>
      <td className="p-4 text-slate-400">
        {new Intl.DateTimeFormat("pt-BR").format(new Date(user.created_at))}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600/50 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver
          </button>
          <button
            onClick={() => onBlock(user.id, !isBlocked)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${
                isBlocked
                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
              }
            `}
          >
            {isBlocked ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Desbloquear
              </>
            ) : (
              <>
                <Ban className="w-3.5 h-3.5" />
                Bloquear
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminUsers() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const navItems = [
    { id: "overview", label: "Visão geral", icon: LayoutDashboard },
    { id: "users", label: "Usuários", icon: Users },
    { id: "transactions", label: "Transações", icon: ArrowLeftRight },
    { id: "platform", label: "Plataforma", icon: Settings2 },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listAdminUsers({
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBlock = async (id: string, blocked: boolean) => {
    try {
      await blockUser(id, blocked);
      setActionFeedback({
        type: "success",
        message: blocked
          ? "Usuário bloqueado com sucesso"
          : "Usuário desbloqueado com sucesso",
      });
      fetchUsers();
    } catch {
      setActionFeedback({
        type: "error",
        message: "Erro ao atualizar usuário",
      });
    } finally {
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleLogout = () => {
    authService.logout();
    logout();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar - Same as AdminDashboard */}
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
                      layoutId="activeAdminTabUsers"
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
                Usuários
              </h1>
            </div>
            <p className="text-slate-500">
              Gestão de contas da plataforma ({total} total)
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>

        {/* Feedback */}
        {actionFeedback && (
          <div
            className={`flex items-center gap-3 p-4 mb-6 rounded-xl border ${
              actionFeedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            {actionFeedback.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                actionFeedback.type === "success"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {actionFeedback.message}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="flex-1 text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={fetchUsers}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  setPage(1);
                  
                  if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current);
                  }
                  searchTimeout.current = setTimeout(() => {
                    setSearch(value);
                  }, 400);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
              />
            </div>
            <div className="flex gap-2">
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
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-left">
                  <th className="p-4 font-medium rounded-tl-lg">Usuário</th>
                  <th className="p-4 font-medium">Função</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Receita Gerada</th>
                  <th className="p-4 font-medium">Registrado</th>
                  <th className="p-4 font-medium rounded-tr-lg text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && !users.length ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-800/30 animate-pulse"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl" />
                          <div className="h-4 w-24 bg-slate-800 rounded" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-32 bg-slate-800 rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-6 w-16 bg-slate-800 rounded-full" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-16 bg-slate-800 rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-20 bg-slate-800 rounded" />
                      </td>
                      <td className="p-4">
                        <div className="h-8 w-20 bg-slate-800 rounded-lg ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onBlock={handleBlock}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Nenhum usuário encontrado
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
