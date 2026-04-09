import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../../style/App.css";
import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";
import { Users, TrendingUp } from "lucide-react";

function ClientsChart() {
  const data = [
    { month: "Jan", clientes: 240, novos: 45 },
    { month: "Fev", clientes: 310, novos: 78 },
    { month: "Mar", clientes: 428, novos: 95 },
    { month: "Abr", clientes: 580, novos: 120 },
    { month: "Mai", clientes: 720, novos: 145 },
    { month: "Jun", clientes: 890, novos: 168 },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
          <p className="text-slate-300 font-medium mb-2">{label} 2024</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-400">Total:</span>
              <span className="text-sm font-semibold text-white">{payload[0].value}</span>
            </div>
            {payload[1] && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-400">Novos:</span>
                <span className="text-sm font-semibold text-emerald-400">+{payload[1].value}</span>
              </div>
            )}
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
              <h3 className="text-lg font-semibold text-white">Crescimento de clientes</h3>
            </div>
            <p className="text-sm text-slate-500 ml-8">Últimos 6 meses</p>
          </div>

          {/* Growth indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">+18.2%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
            <span className="text-xs text-slate-400">Total de clientes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <span className="text-xs text-slate-400">Novos clientes</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#334155"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#334155", fillOpacity: 0.3 }} />
              <Bar
                dataKey="clientes"
                fill="url(#blueGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="novos"
                fill="url(#emeraldGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClientsChart;
