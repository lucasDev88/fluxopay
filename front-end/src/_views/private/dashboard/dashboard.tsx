import "@/style/App.css";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard.tsx";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import Notifications from "@/components/dashboard/Notifications";
import { getDashboardData, type DashboardData } from "@//_services/dashboard";

import PlanBox from "@/components/dashboard/PlanBox";
import ClientsChart from "@/components/dashboard/ClientesChart";
import PaymentModal from "@/components/dashboard/PaymentsForm";
import ClientsForm from "@/components/dashboard/ClientsForm";

import { useEffect, useState } from "react";
import { getUsername } from "../../../_services/user";
import {
  Calendar,
  Bell,
  Search,
  FileText,
  ChevronRight,
  Sparkles,
  UserPlus,
  Receipt,
} from "lucide-react";

interface DashboardHomeProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [username, setUsername] = useState("");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh data helper

  useEffect(() => {
    getUsername().then((data) => {
      setUsername(data.username);
    });
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate trend based on pending vs total
  const getTrend = (pending: number, total: number): "up" | "down" | "neutral" => {
    if (total === 0) return "neutral";
    const pendingRate = (pending / total) * 100;
    if (pendingRate < 20) return "up";
    if (pendingRate > 50) return "down";
    return "neutral";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="space-y-1">
          {/* Greeting */}
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Bem-vindo de volta
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Dashboard <span className="text-slate-500">|</span>{" "}
            <span className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {username}
            </span>
          </h2>
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-4 h-4" />
            <p className="text-sm">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Notifications */}
          <Notifications
            trigger={
              <button className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all">
                <Bell className="w-5 h-5" />
              </button>
            }
          />
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6"
      >
        {loading ? (
          // Loading skeletons
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} hover className="border-slate-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 animate-pulse">
                      <div className="w-5 h-5 bg-slate-700 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                      <div className="h-5 w-32 bg-slate-800 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : error ? (
          // Error state
          <div className="col-span-full flex items-center justify-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          // Real data
          <>
            <StatCard
              title="Receita total"
              value={dashboardData?.total_revenue 
                ? dashboardData.total_revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                : "R$ 0,00"}
              desc={`${dashboardData?.total_payments || 0} pagamentos`}
              trend={dashboardData && dashboardData.pending > 0 ? "neutral" : "up"}
              icon="revenue"
            />
            <StatCard
              title="Clientes"
              value={dashboardData?.total_clients?.toLocaleString("pt-BR") || "0"}
              desc="total de clientes"
              trend="up"
              icon="clients"
            />
            <StatCard
              title="Pagamentos"
              value={dashboardData?.total_payments?.toLocaleString("pt-BR") || "0"}
              desc={`${dashboardData?.pending || 0} pendentes`}
              trend={getTrend(dashboardData?.pending || 0, dashboardData?.total_payments || 1)}
              icon="payments"
            />
            <StatCard
              title="Falhas"
              value={dashboardData?.failed?.toString() || "0"}
              desc={`${dashboardData?.total_payments ? Math.round((dashboardData.failed / dashboardData.total_payments) * 100) : 0}% taxa`}
              trend={dashboardData?.failed && dashboardData.failed > 0 ? "down" : "up"}
              icon="failures"
            />
          </>
        )}
      </motion.div>

      {/* MAIN GRID */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Chart */}
        <ClientsChart />

        {/* Recent Transactions */}
        <RecentTransactions />
      </motion.div>

      {/* BOTTOM GRID */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Plan Box */}
        <PlanBox features={["Teste"]} name="Premium" />

        {/* Quick Actions */}
        <Card hover className="border-slate-700/50">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Ações rápidas</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Operações mais frequentes
                </p>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* New Payment */}
              <button
                onClick={() => setOpenPaymentModal(true)}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-blue-600/10 transition-all duration-200"
              >
                <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">Novo pagamento</p>
                  <p className="text-xs text-slate-500 mt-0.5">Criar transação</p>
                </div>
              </button>

              {/* Add Customer */}
              <button
                onClick={() => setOpenCustomerModal(true)}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-200"
              >
                <div className="p-3 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">Novo cliente</p>
                  <p className="text-xs text-slate-500 mt-0.5">Adicionar cliente</p>
                </div>
              </button>

              {/* View Reports */}
              <button
                onClick={() => onNavigate?.("relatorios")}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-200"
              >
                <div className="p-3 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">Relatórios</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ver Analytics</p>
                </div>
              </button>
            </div>

            {/* View All Link */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group">
                <span>Ver todas as ações</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* MODALS */}
      <PaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        onCreated={async () => {
          // Refresh dashboard data after creating payment
          try {
            const data = await getDashboardData();
            setDashboardData(data);
          } catch (err) {
            console.error("Error refreshing dashboard:", err);
          }
        }}
      />

      <ClientsForm
        open={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        onCreated={async () => {
          // Refresh dashboard data after creating customer
          try {
            const data = await getDashboardData();
            setDashboardData(data);
          } catch (err) {
            console.error("Error refreshing dashboard:", err);
          }
        }}
      />
    </motion.div>
  );
}
