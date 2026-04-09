import "@/style/App.css";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard.tsx";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

import PlanBox from "@/components/dashboard/PlanBox";
import ClientsChart from "@/components/dashboard/ClientesChart";
import PaymentModal from "@/components/dashboard/PaymentsForm";

import { useEffect, useState } from "react";
import { getUsername } from "../../../_services/user";
import {
  Calendar,
  Bell,
  Search,
  Plus,
  FileText,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function DashboardHome() {
  const [username, setUsername] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getUsername().then((data) => {
      setUsername(data.username);
    });
  }, []);

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
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
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
          <button className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6"
      >
        <StatCard
          title="Receita mensal"
          value="R$ 192.302.394"
          desc="+18% vs mês anterior"
          trend="up"
          icon="revenue"
        />
        <StatCard
          title="Clientes ativos"
          value="3.103.982"
          desc="+12 novos hoje"
          trend="up"
          icon="clients"
        />
        <StatCard
          title="Pagamentos"
          value="129.381.098"
          desc="últimos 30 dias"
          trend="neutral"
          icon="payments"
        />
        <StatCard
          title="Falhas"
          value="3"
          desc="30% taxa"
          trend="down"
          icon="failures"
        />
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
                onClick={() => setOpenModal(true)}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-blue-600/10 transition-all duration-200"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">Novo pagamento</p>
                  <p className="text-xs text-slate-500 mt-0.5">Criar transação</p>
                </div>
              </button>

              {/* Create Charge */}
              <button className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-200">
                <div className="p-3 rounded-xl bg-slate-700 group-hover:bg-slate-600 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">Criar cobrança</p>
                  <p className="text-xs text-slate-500 mt-0.5">PIX, boleto, etc</p>
                </div>
              </button>

              {/* Export Report */}
              <button className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-200">
                <div className="p-3 rounded-xl bg-slate-700 group-hover:bg-slate-600 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white text-sm">Exportar</p>
                  <p className="text-xs text-slate-500 mt-0.5">Gerar relatório</p>
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

      {/* MODAL */}
      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={() => {
          console.log("Pagamento criado — atualizar lista depois");
        }}
      />
    </motion.div>
  );
}
