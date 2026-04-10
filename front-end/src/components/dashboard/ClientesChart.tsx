import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../../style/App.css";
import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";
import { Users, TrendingUp, Loader2 } from "lucide-react";
import { getPayments } from "@/_services/payments";
import type { Payment } from "@/_services/types/Payments";

interface ChartData {
  date: string;
  total: number;
  count: number;
}

export default function ClientsChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const payments = await getPayments();
        
        // Group payments by date (last 6 months)
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        
        // Create data for last 6 months
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleDateString("pt-BR", { month: "short" });
          const year = date.getFullYear();
          
          // Filter payments for this month
          const monthPayments = payments.filter((p: Payment) => {
            const paymentDate = new Date(p.created_at || Date.now());
            return paymentDate.getMonth() === date.getMonth() && 
                   paymentDate.getFullYear() === date.getFullYear();
          });
          
          const total = monthPayments.reduce((sum: number, p: Payment) => sum + (p.price || 0), 0);
          
          months.push({
            date: `${monthKey} ${year}`,
            total: total,
            count: monthPayments.length,
          });
        }
        
        setChartData(months);
        
        // Calculate growth (current month vs previous)
        if (months.length >= 2) {
          const current = months[months.length - 1].total;
          const previous = months[months.length - 2].total;
          if (previous > 0) {
            setGrowth(((current - previous) / previous) * 100);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
          <p className="text-slate-300 font-medium mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-400">Receita:</span>
              <span className="text-sm font-semibold text-white">
                {data.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm text-slate-400">Pagamentos:</span>
              <span className="text-sm font-semibold text-emerald-400">+{data.count}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card hover className="border-slate-700/50">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Receita mensal</h3>
            </div>
            <p className="text-sm text-slate-500 ml-8">Últimos 6 meses</p>
          </div>

          {/* Growth indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            growth >= 0 
              ? "bg-emerald-500/10 border-emerald-500/20" 
              : "bg-red-500/10 border-red-500/20"
          }`}>
            <TrendingUp className={`w-3.5 h-3.5 ${growth >= 0 ? "text-emerald-400" : "text-red-400"}`} />
            <span className={`text-sm font-medium ${growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
            <span className="text-xs text-slate-400">Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <span className="text-xs text-slate-400">Qtd pagtos</span>
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">Sem dados suficientes</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  width={60}
                  tickFormatter={(value) => 
                    value >= 1000 
                      ? `R$${(value/1000).toFixed(0)}k` 
                      : `R$${value}`
                  }
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#334155", fillOpacity: 0.3 }} />
                <Bar
                  dataKey="total"
                  fill="url(#blueGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
