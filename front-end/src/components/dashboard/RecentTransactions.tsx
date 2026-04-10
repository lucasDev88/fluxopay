import { useEffect, useState } from "react";
import "../../style/App.css";
import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";
import { ArrowUpRight, Clock, ChevronRight } from "lucide-react";
import { getPayments } from "@/_services/payments";
import type { Payment } from "@/_services/types/Payments";
import type { StatePayment } from "@/components/home/types/State";

interface Transaction {
  id: number;
  name: string;
  price: number;
  situation: StatePayment;
  created_at: string;
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const payments = await getPayments();
        
        // Sort by date (most recent first) and take first 5
        const sorted = [...payments]
          .sort((a: Payment, b: Payment) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5)
          .map((p: Payment) => ({
            id: Number(p.id),
            name: p.name || "Pagamento sem nome",
            price: p.price || 0,
            situation: p.situation as StatePayment,
            created_at: p.created_at || new Date().toISOString(),
          }));
        
        setTransactions(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Erro ao carregar transações");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  // Map situation to status
  const getStatus = (situation: string): "completed" | "pending" | "failed" => {
    switch (situation) {
      case "Aprovado":
        return "completed";
      case "Pendente":
        return "pending";
      case "Recusado":
        return "failed";
      default:
        return "pending";
    }
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Agora mesmo";
    if (diffHours < 24) return `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return `Ontem, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const statusStyles = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusLabels = {
    completed: "Concluído",
    pending: "Pendente",
    failed: "Falhou",
  };

  const completedCount = transactions.filter((t) => t.situation === "Aprovado").length;

  return (
    <Card hover className="border-slate-700/50">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Transações recentes</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? "Carregando..." : `${completedCount} concluídas`}
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-slate-700 rounded" />
                    <div className="w-20 h-3 bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="py-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && transactions.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-slate-500">Nenhuma transação encontrada</p>
          </div>
        )}

        {/* Transactions list */}
        {!loading && !error && transactions.length > 0 && (
          <div className="space-y-3">
            {transactions.map((t) => {
              const status = getStatus(t.situation);
              return (
                <div
                  key={t.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Type indicator */}
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    </div>

                    {/* Transaction info */}
                    <div>
                      <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                        {t.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">{formatDate(t.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
                      {statusLabels[status]}
                    </span>

                    {/* Value */}
                    <span className="font-semibold text-emerald-400 tabular-nums">
                      +{t.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
