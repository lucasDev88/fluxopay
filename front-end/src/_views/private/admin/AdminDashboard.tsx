import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings2,
  LogOut,
  Shield,
  Activity,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import { getAdminStats, listAdminTransactions } from "@/_services/admin";
import type { AdminStats, AdminTransaction } from "@/_services/types/Admin";
import { useAuth } from "@/_services/authContext";
import { authService } from "@/_services/api";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
});

const navItems = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "users", label: "Usuários", icon: Users },
  { id: "transactions", label: "Transações", icon: ArrowLeftRight },
  { id: "platform", label: "Plataforma", icon: Settings2 },
];

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
  index,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && (
            <p className={`text-xs mt-1 ${color}`}>{sub}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
          <div className="h-8 w-32 bg-slate-800 rounded mb-2" />
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
        <div className="w-12 h-12 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentTx, setRecentTx] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, txData] = await Promise.all([
        getAdminStats(),
        listAdminTransactions({ page: 1, limit: 5 }),
      ]);
      setStats(statsData);
      setRecentTx(txData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <div className="w-72 min-h-screen bg-linear-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
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

        {/* Navigation */}
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
                        ? "bg-linear-to-r from-violet-500/20 to-purple-500/10 text-white border border-violet-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-linear-to-b from-violet-400 to-purple-500"
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

        {/* Footer */}
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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
                ADMIN
              </span>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Visão Geral
              </h1>
            </div>
            <p className="text-slate-500">Métricas globais da plataforma</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {loading && !stats
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : stats && (
                <>
                  <StatCard
                    title="Usuários Ativos"
                    value={stats.active_users.toLocaleString("pt-BR")}
                    sub={`de ${stats.total_users.toLocaleString("pt-BR")} total`}
                    icon={Users}
                    color="text-emerald-400"
                    index={0}
                  />
                  <StatCard
                    title="Receita Mensal"
                    value={BRL.format(stats.monthly_revenue)}
                    sub={`Total: ${BRL.format(stats.total_revenue)}`}
                    icon={TrendingUp}
                    color="text-violet-400"
                    index={1}
                  />
                  <StatCard
                    title="Total de Transações"
                    value={stats.total_payments.toLocaleString("pt-BR")}
                    sub={`${stats.pending_payments} pendentes`}
                    icon={CreditCard}
                    color="text-blue-400"
                    index={2}
                  />
                  <StatCard
                    title="Alertas"
                    value={stats.failed_payments + stats.api_errors}
                    sub={`${stats.failed_payments} falhas, ${stats.api_errors} erros API`}
                    icon={AlertTriangle}
                    color="text-red-400"
                    index={3}
                  />
                </>
              )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card hover className="border-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">
                  Status do Sistema
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-emerald-400 font-medium">
                      Todos os serviços operacionais
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-slate-300">API Gateway</span>
                  </div>
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-slate-300">Banco de Dados</span>
                  </div>
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-slate-300">Processador de Pagamentos</span>
                  </div>
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card hover className="border-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Alertas</h3>
              </div>
              <div className="space-y-3">
                {loading && !stats ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-800/30 rounded-xl animate-pulse"
                    />
                  ))
                ) : stats && stats.failed_payments > 0 ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                      <XCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                      <div>
                        <p className="text-sm text-yellow-400 font-medium">
                          {stats.failed_payments} pagamentos falharam
                        </p>
                        <p className="text-xs text-slate-500">
                          Últimas 24 horas
                        </p>
                      </div>
                    </div>
                    {stats.pending_payments > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                        <div>
                          <p className="text-sm text-yellow-400 font-medium">
                            {stats.pending_payments} pagamentos pendentes
                          </p>
                          <p className="text-xs text-slate-500">
                            Aguardando processamento
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-400 font-medium">
                      Nenhum alerta pendente
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card hover className="border-slate-800/50 mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Transações Recentes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 text-left">
                    <th className="p-3 font-medium rounded-tl-lg">Usuário</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Valor</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium rounded-tr-lg">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && !recentTx.length ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-800/30 animate-pulse"
                      >
                        <td className="p-3">
                          <div className="h-4 w-24 bg-slate-800 rounded" />
                        </td>
                        <td className="p-3">
                          <div className="h-4 w-32 bg-slate-800 rounded" />
                        </td>
                        <td className="p-3">
                          <div className="h-4 w-16 bg-slate-800 rounded" />
                        </td>
                        <td className="p-3">
                          <div className="h-6 w-20 bg-slate-800 rounded-full" />
                        </td>
                        <td className="p-3">
                          <div className="h-4 w-20 bg-slate-800 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : recentTx.length > 0 ? (
                    recentTx.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-3 text-white font-medium">
                          {tx.user_name}
                        </td>
                        <td className="p-3 text-slate-400">{tx.user_email}</td>
                        <td className="p-3 text-white font-medium">
                          {BRL.format(tx.value)}
                        </td>
                        <td className="p-3">{getStatusBadge(tx.status)}</td>
                        <td className="p-3 text-slate-400">
                          {new Date(tx.created_at).toLocaleDateString("pt-BR")}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
