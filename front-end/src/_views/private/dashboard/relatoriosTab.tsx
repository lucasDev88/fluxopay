import MonthlyChart from "@/components/dashboard/MonthlyChart";

export default function RelatoriosTab() {
  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-3xl font-bold">Relatórios</h2>
        <p className="text-slate-400">Indicadores de desempenho</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Receita mensal</p>
          <p className="text-2xl font-bold mt-2">R$ 12.450</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Ticket médio</p>
          <p className="text-2xl font-bold mt-2">R$ 87</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Conversão</p>
          <p className="text-2xl font-bold mt-2">4.2%</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hidden">
        <p className="text-slate-400">
          Exportação de relatórios e gráficos detalhados disponíveis nos planos PRO +.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border-slate-800 ">
        <MonthlyChart />
      </div>
    </div>
  )
}
