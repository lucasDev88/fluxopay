import "../../style/App.css";
import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";
import { ArrowUpRight, ArrowDownRight, Clock, ChevronRight } from "lucide-react";

interface Transaction {
  id: number;
  name: string;
  value: string;
  type: "income" | "expense";
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function RecentTransactions() {
  const transactions: Transaction[] = [
    { id: 1, name: "Pagamento João Silva", value: "R$ 1.250,00", type: "income", date: "Hoje, 14:32", status: "completed" },
    { id: 2, name: "Assinatura Maria Costa", value: "R$ 399,00", type: "income", date: "Hoje, 12:15", status: "completed" },
    { id: 3, name: "Compra API Enterprise", value: "R$ 2.999,00", type: "income", date: "Hoje, 09:48", status: "completed" },
    { id: 4, name: "Taxa processamento", value: "R$ 12,50", type: "expense", date: "Ontem, 18:22", status: "completed" },
    { id: 5, name: "Reembolso pedido #1234", value: "R$ 89,90", type: "expense", date: "Ontem, 15:30", status: "pending" },
  ];

  const statusStyles = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((acc) => acc + 1, 0);

  return (
    <Card hover className="border-slate-700/50">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Transações recentes</h3>
            <p className="text-sm text-slate-500 mt-0.5">{totalIncome} concluídas hoje</p>
          </div>
          <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Transactions list */}
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Type indicator */}
                <div
                  className={`
                    p-2 rounded-lg
                    ${t.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10"}
                  `}
                >
                  {t.type === "income" ? (
                    <ArrowUpRight className={`w-4 h-4 ${t.type === "income" ? "text-emerald-400" : ""}`} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Transaction info */}
                <div>
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {t.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{t.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status badge */}
                <span
                  className={`
                    px-2.5 py-1 rounded-full text-xs font-medium border
                    ${statusStyles[t.status]}
                  `}
                >
                  {t.status === "completed" ? "Concluído" : t.status === "pending" ? "Pendente" : "Falhou"}
                </span>

                {/* Value */}
                <span
                  className={`
                    font-semibold tabular-nums
                    ${t.type === "income" ? "text-emerald-400" : "text-red-400"}
                  `}
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
