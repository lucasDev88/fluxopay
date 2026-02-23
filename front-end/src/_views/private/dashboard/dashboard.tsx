  import "../../../../style/App.css";
import { motion } from "framer-motion";
import StatCard from "../../../components/dashboard/StatCard";
import { Card } from "../../../components/utils/Card";
import { CardContent } from "../../../components/utils/CardContent";
import RecentTransactions from "../../../components/dashboard/RecentTransactions";
import Button from "../../../components/utils/Button";
import PlanBox from "../../../components/dashboard/PlanBox";
import ClientsChart from "../../../components/dashboard/ClientesChart";
import PaymentModal from "../../../components/dashboard/ModalPayment";

import { useEffect, useState } from "react";
import { getUsername } from "../../../_services/user";

export default function DashboardHome() {
  const [username, setUsername] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getUsername().then((data) => {
      setUsername(data.username);
    });
  }, []);

  return (
    <>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white">
          Dashboard | {username}
        </h2>
        <p className="text-slate-400">Visão geral da sua conta</p>
      </motion.div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Receita mensal"
          value="R$ 192.302.394"
          desc="+18% vs mês anterior"
        />
        <StatCard
          title="Clientes ativos"
          value="3103982"
          desc="+12 novos hoje"
        />
        <StatCard title="Pagamentos" value="129381098" desc="últimos 30 dias" />
        <StatCard title="Falhas" value="3" desc="30% taxa" />
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ClientsChart />
        <RecentTransactions />

        <PlanBox features={["Teste"]} name="Premium" />

        {/* AÇÕES */}
        <Card className="text-white">
          <CardContent className="space-y-4">
            <h3 className="font-bold">Ações rápidas</h3>

            <Button onClick={() => setOpenModal(true)}>Novo pagamento</Button>

            <Button variant="secondary">Criar cobrança</Button>

            <Button variant="outline">Exportar relatório</Button>
          </CardContent>
        </Card>
      </div>

      {/* MODAL */}
      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={() => {
          console.log("Pagamento criado — atualizar lista depois");
        }}
      />
    </>
  );
}
