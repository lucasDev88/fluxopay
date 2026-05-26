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
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Save,
  Loader2,
} from "lucide-react";
import {
  getPlatformConfig,
  updatePlatformConfig,
  setMaintenanceMode,
} from "@/_services/admin";
import type { PlatformConfig } from "@/_services/types/Admin";
import { authService } from "@/_services/api";
import { useAuth } from "@/_services/authContext";

export default function AdminPlatform() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("platform");
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [defaultFee, setDefaultFee] = useState("");
  const [freeLimit, setFreeLimit] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const navItems = [
    { id: "overview", label: "Visão geral", icon: LayoutDashboard },
    { id: "users", label: "Usuários", icon: Users },
    { id: "transactions", label: "Transações", icon: ArrowLeftRight },
    { id: "platform", label: "Plataforma", icon: Settings2 },
  ];

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlatformConfig();
      setConfig(data);
      setDefaultFee(data.default_fee.toString());
      setFreeLimit(data.free_limit.toString());
      setWebhookUrl(data.webhook_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar configuração");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleMaintenanceToggle = async () => {
    if (!config) return;

    try {
      setMaintenanceLoading(true);
      await setMaintenanceMode(!config.maintenance_mode);
      setConfig((prev) =>
        prev ? { ...prev, maintenance_mode: !prev.maintenance_mode } : null
      );
      setFeedback({
        type: "success",
        message: config.maintenance_mode
          ? "Modo manutenção desativado"
          : "Modo manutenção ativado",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Erro ao atualizar modo manutenção",
      });
    } finally {
      setMaintenanceLoading(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    const fee = parseFloat(defaultFee);
    const limit = parseInt(freeLimit, 10);

    if (isNaN(fee) || fee < 0 || fee > 100) {
      setFeedback({
        type: "error",
        message: "Taxa deve ser um número entre 0 e 100",
      });
      return;
    }

    if (isNaN(limit) || limit < 0) {
      setFeedback({
        type: "error",
        message: "Limite deve ser um número positivo",
      });
      return;
    }

    try {
      setSaveLoading(true);
      await updatePlatformConfig({
        default_fee: fee,
        free_limit: limit,
        webhook_url: webhookUrl,
      });
      setConfig((prev) =>
        prev
          ? {
              ...prev,
              default_fee: fee,
              free_limit: limit,
              webhook_url: webhookUrl,
            }
          : null
      );
      setFeedback({
        type: "success",
        message: "Configurações salvas com sucesso",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Erro ao salvar configurações",
      });
    } finally {
      setSaveLoading(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleLogout = () => {
    authService.logout();
    logout();
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
                      layoutId="activeAdminTabPlatform"
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
                Plataforma
              </h1>
            </div>
            <p className="text-slate-500">Configurações globais do sistema</p>
          </div>
          <button
            onClick={fetchConfig}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`flex items-center gap-3 p-4 mb-6 rounded-xl border ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                feedback.type === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {feedback.message}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="flex-1 text-sm font-medium text-red-400">{error}</p>
            <button
              onClick={fetchConfig}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl ${
                  config?.maintenance_mode
                    ? "bg-yellow-500/10"
                    : "bg-emerald-500/10"
                }`}
              >
                {config?.maintenance_mode ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Modo Manutenção
                </h3>
                <p className="text-sm text-slate-500">
                  {config?.maintenance_mode
                    ? "Sistema em manutenção"
                    : "Sistema operacional"}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              Quando ativado, apenas administradores poderão acessar a
              plataforma. Usuários comuns verão uma página de manutenção.
            </p>

            {/* Toggle Switch */}
            <button
              onClick={handleMaintenanceToggle}
              disabled={maintenanceLoading}
              className={`
                relative w-14 h-8 rounded-full transition-all duration-300 disabled:opacity-50
                ${
                  config?.maintenance_mode
                    ? "bg-yellow-500"
                    : "bg-slate-700"
                }
              `}
            >
              {maintenanceLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              ) : (
                <motion.div
                  animate={{
                    x: config?.maintenance_mode ? 28 : 4,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                />
              )}
            </button>
          </motion.div>

          {/* System Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Informações do Sistema
                </h3>
                <p className="text-sm text-slate-500">Status e versões</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <span className="text-sm text-slate-400">Versão</span>
                <span className="text-sm text-white font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <span className="text-sm text-slate-400">Ambiente</span>
                <span className="text-sm text-white font-medium">Produção</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <span className="text-sm text-slate-400">Última Atualização</span>
                <span className="text-sm text-white font-medium">
                  {new Date().toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">
            Configurações da Plataforma
          </h3>

          {loading && !config ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-800/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Taxa Padrão (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Limite Free
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={freeLimit}
                    onChange={(e) => setFreeLimit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
                  placeholder="https://seu-dominio.com/webhook"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium transition-all disabled:opacity-50 min-w-[180px] justify-center"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : feedback?.type === "success" && feedback.message === "Configurações salvas com sucesso" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Salvo!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar Configurações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
