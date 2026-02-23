import Stat from "../../../components/utils/Stat";
import Box from "../../../components/utils/Box";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">Admin • Visão Geral</h1>
        <p className="text-slate-400">Métricas globais da plataforma</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Stat title="Usuários totais" value="1.284" sub="+42 hoje" />
        <Stat title="Empresas ativas" value="742" sub="+9 hoje" />
        <Stat title="MRR" value="R$ 38.920" sub="+6%" />
        <Stat title="Erros API" value="3" sub="24h" danger />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Box title="Status do sistema">
          <p className="text-green-400 font-semibold">
            ● Todos os serviços operacionais
          </p>
        </Box>

        <Box title="Alertas">
          <p className="text-yellow-400">2 contas com comportamento suspeito</p>
        </Box>
      </div>
    </div>
  );
}
