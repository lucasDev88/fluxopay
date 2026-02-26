import Chart from "@/components/dashboard/Chart";
import AnualData from "@/components/dashboard/Data/AnualChartData";
import SemesterData from "@/components/dashboard/Data/SemesterChartData";
import TrimesterData from "@/components/dashboard/Data/TirmesterChartData";
import WeekData from "@/components/dashboard/Data/WeekChartData";
import Button from "@/components/utils/Button";

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
        <p className="text-slate-200 font-bold text-2xl"> Esse é o gráfico semanal, preste atenção.</p>
        <Chart name="Receita semanal" data={WeekData} />
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border-slate-800">
        <p className="text-slate-200 font-bold text-2xl"> Esse é o gráfico trimestral, preste atenção.</p>
        <Chart name="Receita trimestral" data={TrimesterData} />
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border-slate-800 ">
        <p className="text-slate-200 font-bold text-2xl"> Esse é o gráfico semestral, preste atenção.</p>
        <Chart name="Receita semestral" data={SemesterData} />
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border-slate-800 ">
        <p className="text-slate-200 font-bold text-2xl"> Esse é o gráfico Anual, preste atenção.</p>
        <Chart name="Receita anual" data={AnualData} />
      </div>

      <div className="bg-slate-900 rounded-2xl p-10 border-slate-800 grid md:grid-cols-2">
        <Button className="p-3" variant="primary" >
          Relatório das receitas
        </Button>

        <Button className="p-3" variant="secondary">
          Relatório de meses ruins
        </Button>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border-slate-800">
        <h1 className="text-white text-4xl font-bold text-center">Relatório gerado</h1>

        <div className="mt-10 bg-black rounded-2xl p-6 border-slate-900">
          <p className="text-2xl text-center font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, autem vel quos inventore aliquam dolor quibusdam atque eius odit ab sit esse, quia tenetur laborum aliquid recusandae amet unde quidem.
          </p>
        </div>
      </div>
      
    </div>
  )
}
