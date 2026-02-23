import { Card } from "../../../../components/utils/Card"
import { CardContent } from "../../../../components/utils/CardContent"

export default function AdminTransactions() {
  const data = [
    { id: 1, user: "João", plan: "Premium", value: "R$29,90", status: "Aprovado" },
    { id: 2, user: "Maria", plan: "Premium+", value: "R$39,90", status: "Aprovado" },
    { id: 3, user: "Carlos", plan: "Free", value: "R$0", status: "Isento" },
    { id: 4, user: "Ana", plan: "Premium", value: "R$29,90", status: "Falhou" },
  ]

  return (
    <div className="space-y-8 text-white">

      <div>
        <h1 className="text-3xl font-bold">Transações</h1>
        <p className="text-slate-400">Controle financeiro da plataforma</p>
      </div>

      <Card>
        <CardContent>

          <table className="w-full text-left">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3">Usuário</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map(tx => (
                <tr key={tx.id} className="border-b border-slate-900">
                  <td className="py-3">{tx.user}</td>
                  <td>{tx.plan}</td>
                  <td>{tx.value}</td>
                  <td>
                    <span className={`
                      px-3 py-1 rounded-lg text-sm
                      ${tx.status === "Aprovado" && "bg-green-900 text-green-300"}
                      ${tx.status === "Falhou" && "bg-red-900 text-red-300"}
                      ${tx.status === "Isento" && "bg-slate-800 text-slate-300"}
                    `}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </CardContent>
      </Card>

    </div>
  )
}
