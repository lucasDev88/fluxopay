"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", revenue: 4200 },
  { month: "Fev", revenue: 6800 },
  { month: "Mar", revenue: 5300 },
  { month: "Abr", revenue: 9100 },
  { month: "Mai", revenue: 7600 },
  { month: "Jun", revenue: 10200 },
]

export default function MonthlyChart() {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h3 className="text-white text-xl font-semibold mb-6">
        Receita Mensal
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}