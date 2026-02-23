import { Card } from "../../../components/utils/Card";
import { CardContent } from "../../../components/utils/CardContent";

export default function AdminPlatform() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">Plataforma</h1>
        <p className="text-slate-400">Configurações globais do sistema</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Modo manutenção</h3>
            <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-xl">
              Ativar
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Logs do sistema</h3>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
              Ver logs
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Backup banco</h3>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl">
              Gerar backup
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="font-semibold">Variáveis da plataforma</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Taxa padrão (%)"
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl"
            />

            <input
              placeholder="Limite Free usuários"
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl"
            />

            <input
              placeholder="Webhook URL"
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl md:col-span-2"
            />
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl">
            Salvar configurações
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
