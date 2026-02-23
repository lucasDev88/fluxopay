import "../../../../style/App.css"
import { Card } from "../../../../components/utils/Card";
import { CardContent } from "../../../../components/utils/CardContent";
import Button from "../../../../components/utils/Button";
import { Input } from "../../../../components/utils/Input";

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Configurações</h2>
        <p className="text-slate-400">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="text-white">
          <CardContent className="space-y-4">
            <h3 className="font-bold">Perfil</h3>
            <Input placeholder="Nome da empresa" />
            <Input placeholder="Email" />
            <Input placeholder="Telefone" />
            <Button>Salvar perfil</Button>
          </CardContent>
        </Card>

        <Card className="text-white">
          <CardContent className="space-y-4">
            <h3 className="font-bold">Segurança</h3>
            <Input type="password" placeholder="Nova senha" />
            <Input type="password" placeholder="Confirmar senha" />
            <Button variant="secondary">Atualizar senha</Button>
          </CardContent>
        </Card>

        <Card className="text-white">
          <CardContent className="space-y-4">
            <h3 className="font-bold">Plano atual</h3>
            <p className="text-slate-300">Premium</p>
            <Button variant="outline">Gerenciar assinatura</Button>
          </CardContent>
        </Card>

        <Card className="text-white">
          <CardContent className="space-y-4">
            <h3 className="font-bold">Preferências</h3>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" /> Receber emails
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" /> Alertas de pagamento
            </label>
            <Button variant="secondary">Salvar preferências</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsTab