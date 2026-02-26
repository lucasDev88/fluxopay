"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Data } from "./types/TypeDataChart";

type ChartsProps = {
  data: Data[],
  name: string
}

export default function Chart({ data, name }: ChartsProps) {
  return (
    <div className="bg-zinc-900 p-15 mt-5 rounded-2xl border border-zinc-800">
      <h3 className="text-white text-xl font-semibold mb-6">
        {name}
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="Name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Lucro"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
