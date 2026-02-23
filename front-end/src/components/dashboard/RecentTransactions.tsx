import "../../style/App.css"
import { Card } from "../utils/Card"
import { CardContent } from "../utils/CardContent"

export default function RecentTransactions() {
  const items = [
    { id: 1, name: "Pagamento João", value: "R$120" },
    { id: 2, name: "Assinatura Maria", value: "R$39" },
    { id: 3, name: "Compra API", value: "R$300" },
  ]

  return (
    <Card className="text-white">
      <CardContent>
        <h3 className="font-bold mb-4">Transações recentes</h3>
        <div className="space-y-3">
          {items.map(t => (
            <div key={t.id} className="flex justify-between text-sm">
              <span className="text-slate-300">{t.name}</span>
              <span className="font-semibold">{t.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}